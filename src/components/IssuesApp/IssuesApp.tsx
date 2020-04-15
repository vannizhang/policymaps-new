import './style.scss';
import * as React from 'react';

import { 
    Tier
} from '../../AppConfig';

import {
    formatAsAgolItem,
    AgolItem
} from '../../utils/arcgis-online-item-formatter';

import { 
    getCategorySchema, 
    CategorySchemaDataItem
} from '../../utils/category-schema-manager';

import ArcGISOnlineGroupData, { 
    SearchResponse 
} from '../../utils/arcgis-online-group-data';

import HeroBanner from './HeroBanner';
import CategoryFilter from './CategoryFilter';
import CardList from './CardList';

const IssuesPage:React.FC<{}> = ()=>{

    const [ categorySchema, setCategorySchema ] = React.useState<CategorySchemaDataItem>();
    const [ agolGroupData, setAgolGroupData ] = React.useState<ArcGISOnlineGroupData>();
    const [ searchResponse, setSearchReponse ] = React.useState<SearchResponse>();

    const [ activeMainCategoryTitle, setActiveMainCategoryTitle] = React.useState<string>();

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

        setCategorySchema(categorySchema);
    }

    // init the module that will be used to query items from the Policy Maps group on ArcGIS online
    const initAgolGroupData = async ()=>{

        const arcGISOnlineGroupData = new ArcGISOnlineGroupData({
            groupId: Tier.PROD.AGOL_GROUP_ID,
            categorySchema,
            queryParams: {
                // contentType: 'webmap',
                sortField: 'modified'
            }
        });

        setAgolGroupData(arcGISOnlineGroupData);
    };

    // search items from the policy maps group
    const searchItems = async({
        num = 10,
        searchNextSet = false
    }={})=>{

        const start = ( searchNextSet && searchResponse ) 
            ? searchResponse.nextStart
            : 1; 
        
        if(searchNextSet && start === -1){
            console.error('no more items to load');
            return;
        }

        const response = await agolGroupData.search({
            start,
            num
        });
        
        response.results = response.results
            .map(d=>formatAsAgolItem(d));
        
        console.log('search response', response);

        setSearchReponse(response);
    };

    const categoryFilterOnChange = (mainCategoryTitle:string, activeSubcategories:string[])=>{
        console.log(mainCategoryTitle, activeSubcategories)
        agolGroupData.updateSelectedCategory(mainCategoryTitle, activeSubcategories);
        searchItems();
    };

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

    // // start searching policy maps items once agolGroupData is ready
    // React.useEffect(()=>{
    //     if(agolGroupData){
    //         searchItems();
    //     }
    // }, [ agolGroupData ]);
    
    return (
        <div>
            <HeroBanner 
                categorySchema={categorySchema}
                onSelect={setActiveMainCategoryTitle}
            />

            <div className='grid-container leader-2'>
                <div className='column-5 tablet-column-12 trailer-1'>

                    <CategoryFilter 
                        categorySchema={categorySchema}
                        activeMainCategoryTitle={activeMainCategoryTitle}
                        onSelect={categoryFilterOnChange}
                    />
                </div>

                <div className='column-19'>
                    <CardList 
                        data={ searchResponse ? searchResponse.results : [] }
                    />
                </div>
            </div>
        </div>
    )
};

export default IssuesPage;