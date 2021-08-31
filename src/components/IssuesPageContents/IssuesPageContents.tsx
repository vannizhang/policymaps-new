import './style.scss';
import * as React from 'react';

import { 
    Tier
} from '../../AppConfig';

import {
    formatAsAgolItem,
} from '../../utils/arcgis-online-item-formatter';

import { 
    getCategorySchema, 
    CategorySchemaDataItem
} from '../../utils/category-schema-manager';

import ArcGISOnlineGroupData, { 
    SearchResponse,
    ContentType,
    SortField,
} from '../../utils/arcgis-online-group-data';

import { 
    SearchAutoComplete,
    DropdownFilter
} from '../index';

import HeroBanner from './HeroBanner';
import CategoryFilter from './CategoryFilter';
import CardList from './CardList';
import PageNav from './PageNav';
import ShareDialogModal from '../BrowseApp/ShareDialog/ShareDialogModal'

import {
    ContentTypeFilterData,
    SortFilterData
} from './Config';
import { batchUpdateHashParam, getHashParams } from '../../utils/url-manager/issuesPageUrlParams';
import { shareToSocialMedia } from '../BrowseApp/ShareDialog/ShareDialogContainer';

const hashParams = getHashParams();

type SearchResult = {
    searchResponse: SearchResponse;
    isForAlternativeItems: boolean;
}

const IssuesPage:React.FC<{}> = ()=>{

    const [ categorySchema, setCategorySchema ] = React.useState<CategorySchemaDataItem>();
    const [ agolGroupData, setAgolGroupData ] = React.useState<ArcGISOnlineGroupData>();
    // const [ searchResponse, setSearchReponse ] = React.useState<SearchResponse>();
    const [ searchResult, setSearchResult ] = React.useState<SearchResult>();
    const [ isLoading, setIsLoading] = React.useState<boolean>(true)
    const [ isShareDialogOn, setIsShareDialogOn] = React.useState<boolean>(false) 

    const [ activeMainCategoryTitle, setActiveMainCategoryTitle] = React.useState<string>(hashParams.category ? hashParams.category.split(':')[0] : '');
    const searchTermRef = React.useRef<string>(hashParams.q || '');

    const initCategorySchema = async () =>{

        const categorySchemaRes = await getCategorySchema({ 
            agolGroupId: Tier.PROD.AGOL_GROUP_ID 
        });
        // console.log(categorySchemaRes);

        const categorySchema:CategorySchemaDataItem = categorySchemaRes[0];

        // filter out 'Resources' category
        categorySchema.categories = categorySchema.categories.filter(item=>{
            return item.title !== 'Resources';
        });

        // console.log(categorySchema)

        setCategorySchema(categorySchema);
    }

    // init the module that will be used to query items from the Policy Maps group on ArcGIS online
    const initAgolGroupData = async ()=>{

        const { type, sort, q } = hashParams;

        const arcGISOnlineGroupData = new ArcGISOnlineGroupData({
            groupId: Tier.PROD.AGOL_GROUP_ID,
            categorySchema,
            filters: {
                contentType: type as ContentType,
                sortField: sort as SortField,
                searchTerm: q
            }
        });

        setAgolGroupData(arcGISOnlineGroupData);
    };

    // search items from the policy maps group
    const searchItems = async({
        num = 10,
        start = 1,
        searchNextSet = false
    }={})=>{

        if(searchNextSet && start === -1){
            console.error('no more items to load');
            return;
        }

        setIsLoading(true);

        const searchResponse = searchResult?.searchResponse;

        const response = await agolGroupData.search({
            start: ( searchNextSet && searchResponse ) 
                ? searchResponse.nextStart
                : start,
            num
        });
        
        response.results = response.results
            .map(d=>formatAsAgolItem(d));
        
        const response4Alternatives = response.total === 0 
            ? await agolGroupData.search({
                searchAlternative: true
            })
            : null

        setSearchResult({
            searchResponse: response.total === 0 ? response4Alternatives : response,
            isForAlternativeItems: response4Alternatives !== null
        });
        
        // console.log('search response', response);
    };

    const categoryFilterOnChange = (mainCategoryTitle:string, activeSubcategories:string[])=>{
        agolGroupData.updateSelectedCategory(mainCategoryTitle, activeSubcategories);

        // the first search request is triggered by this event when category filter is ready,
        // and if the searchResponse is null, then we know it's the first time we call searchItems,
        // therefore we should try to use the start from hash params
        let start = 1;

        if(!searchResult){
            start = +hashParams.start || 1
        }

        searchItems({ start });
    };

    const searchAutoCompleteOnChange = (val:string)=>{
        agolGroupData.updateSearchTerm(val);
        searchItems();
        searchTermRef.current = val;
    };

    const contentTypeOnChange = (val:ContentType)=>{
        agolGroupData.updateContentType(val);
        searchItems();
    };

    const sortFieldOnChange = (val:SortField)=>{
        agolGroupData.updateSortField(val);
        searchItems();
    };

    // const expandSearch = ()=>{
    //     // remove content type filter
    //     agolGroupData.updateContentType();
    //     // remove sub category files
    //     agolGroupData.selectAllSubcategories();

    //     searchItems();
    // };

    const searchOnLivingAtlas = ()=>{
        const link = `https://livingatlas.arcgis.com/en/browse/#d=2&q=${searchTermRef.current}`
        window.open(link, 'blank')
    };

    const getSearchResult = ()=>{
        // console.log(searchResponse)

        if(isLoading){
            return (
                <div className='text-center'>
                    <div className="loader is-active padding-leader-5 padding-trailer-3">
                        <div className="loader-bars"></div>
                    </div>
                </div>
            )
        }

        if(!searchResult || searchResult.isForAlternativeItems){

            // const searchResponse = searchResult?.searchResponse;

            // const secondOption = searchResponse && searchResponse.total
            //     // ? <span className="btn btn-transparent padding-left-0 padding-right-0" onClick={expandSearch}>Expand this search</span>
            //     ? <span className="">Expand this search</span>
            //     : <span>Check each of the major categories at the top of this section, just above</span>;

            return (
                <div className='padding-leader-5 padding-trailer-4'
                    style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <div>
                        <p className='font-size-1 avenir-light'>No results match your search criteria. Suggestions:</p>

                        <ul>
                            <li>Try different search terms, change both filters to "All" at left, or change category just above.</li>  
                            {/* <li>{secondOption}</li>   */}
                            <li>Search <span className="btn btn-transparent padding-left-0 padding-right-0 padding-leader-0" onClick={searchOnLivingAtlas}>ArcGIS Living Atlas of the World</span> for your criteria </li>  
                        </ul>
                    </div>

                    {/* <p >No results match your search criteria. Try different criteria or explore <a href={`https://livingatlas.arcgis.com/en/browse/`} target='_blank'>ArcGIS Living Atlas of the World</a> for additional maps, apps, and more.</p> */}
                </div>
            )
        }

        const searchResponse = searchResult?.searchResponse;

        return (
            <>
                <div className='trailer-1'>
                    <CardList 
                        data={ searchResponse ? searchResponse.results : [] }
                    />
                </div>

                <PageNav 
                    searchResponse={searchResponse}
                    prevBtnOnClick={()=>{
                        searchItems({
                            start: searchResponse.start - 10
                        })
                    }}
                    nextBtnOnClick={()=>{
                        searchItems({
                            searchNextSet: true
                        })
                    }}
                />
            </>
        )
    }

    // fetch the category schema first
    React.useEffect(()=>{
        initCategorySchema();
    }, [])

    // once category schema is ready, init the AGOL Group Data module
    React.useEffect(()=>{
        if(categorySchema){
            initAgolGroupData();
        }
    }, [ categorySchema ]);

    React.useEffect(()=>{
        if(searchResult){
            setIsLoading(false);

            const { searchResponse } = searchResult;

            const start = searchResponse.start;

            const {
                searchTerm,
                sortField,
                contentType,
                categories
            } = agolGroupData.getCurrentFilterValues();

            batchUpdateHashParam({
                q: searchTerm,
                sort: sortField,
                types: contentType,
                category: categories,
                start: start.toString()
            });
        }
        // console.log(searchResponse)
    }, [searchResult])

    return (
        <>
            <div>
                <HeroBanner 
                    categorySchema={categorySchema}
                    activeMainCategoryTitle={activeMainCategoryTitle}
                    onSelect={setActiveMainCategoryTitle}
                />

                <div className='grid-container leader-2'>
                    <div className='column-5 tablet-column-12 trailer-1'>

                        <div className='trailer-half'
                            style={{
                                'border': '1px solid #efefef',
                                'paddingLeft': '.5rem'
                            }}
                        >
                            <SearchAutoComplete 
                                groupId={Tier.PROD.AGOL_GROUP_ID }
                                onSelect={searchAutoCompleteOnChange}
                                placeholder={'Search items'}
                                deafultVal={hashParams.q || ''}
                            />
                        </div>

                        <div className='trailer-half'>
                            <CategoryFilter 
                                categorySchema={categorySchema}
                                activeMainCategoryTitle={activeMainCategoryTitle}
                                defaultSubCategory={hashParams.category ? hashParams.category.split(':')[1] : ''}
                                onSelect={categoryFilterOnChange}
                            />
                        </div>


                        <div className='trailer-half'>
                            <DropdownFilter 
                                data={ContentTypeFilterData}
                                title={'Item Type'}
                                expandedByDefault={hashParams.type && hashParams.type !== ''}
                                onChange={contentTypeOnChange}
                                activeValueByDefault={hashParams.type || ''}
                            />
                        </div>

                        <div className='trailer-half'>
                            <DropdownFilter 
                                data={SortFilterData}
                                title={'Sort By'}
                                expandedByDefault={hashParams.sort && hashParams.sort !== 'modified'}
                                onChange={sortFieldOnChange}
                                activeValueByDefault={hashParams.sort || 'modified'}
                            />
                        </div>

                        <div className='trailer-half'>
                            <div className='btn btn-fill btn-clear'
                                onClick={setIsShareDialogOn.bind(undefined, true)}
                            >
                                Share these items
                            </div>
                        </div>

                    </div>

                    <div className='column-19 trailer-2'>
                        { getSearchResult() }
                    </div>
                </div>
            </div>

            {
                isShareDialogOn && (
                    <ShareDialogModal 
                        title='Share these items'
                        currentUrl={window.location.href}
                        onClose={setIsShareDialogOn.bind(undefined, false)}
                        shareToSocialMediaOnClick={(name)=>{
                            shareToSocialMedia(name, 'Check out these policy mapping items from the Esri Maps for Public Policy site')
                        }}
                    />
                )
            }
            
        </>
    )
};

export default IssuesPage;