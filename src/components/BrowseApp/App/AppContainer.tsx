import * as React from 'react';
import { useDispatch } from 'react-redux';

import {
    SiteContext
} from '../../../contexts/SiteContextProvider';

import BrowseApp from './App';

// import {
//     decodeSearchParams
// } from '../../../utils/url-manager/BrowseAppUrlManager';

import {
    getMyFavItemIds
} from '../../../utils/my-favorites/myFav';

// import { 
//     // AgolItem,
//     queryItemsByIds,
//     queryItemsByCategory
// } from '../../../utils/arcgis-online-group-data';

import { 
    AgolItem,
    formatAsAgolItem
} from '../../../utils/arcgis-online-item-formatter';

// import {
//     loadCollectionItems
// } from '../../../store/browseApp/reducers/itemCollections';

// import {
//     setActiveWebmap
// } from '../../../store/browseApp/reducers/map';

import {
    setMyFavItems
} from '../../../store/browseApp/reducers/myFavItems';

import { Tier } from '../../../AppConfig';

import { 
    getCategorySchema, 
    CategorySchemaDataItem
} from '../../../utils/category-schema-manager';

import ArcGISOnlineGroupData, { 
    SearchResponse 
} from '../../../utils/arcgis-online-group-data';

import { SelectedCategory } from '../CategoryFilter';

const BrowseAppContainer:React.FC = ()=>{

    const dispatch = useDispatch();
    // const searchParams = decodeSearchParams();

    const { isSearchDisabled } = React.useContext(SiteContext);
    const [ categorySchema, setCategorySchema ] = React.useState<CategorySchemaDataItem>();
    const [ agolGroupData, setAgolGroupData ] = React.useState<ArcGISOnlineGroupData>();
    const [ searchResponse, setSearchReponse ] = React.useState<SearchResponse>();
    const [ webMapItems, setWebMapItems ] = React.useState<AgolItem[]>([]);

    const fetchMyFavItems = async()=>{
        const myFavItems = await getMyFavItemIds();
        // console.log('myFavItems', myFavItems)

        dispatch(setMyFavItems(myFavItems));
    };

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
            filters: {
                contentType: 'webmap',
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
        console.log('search response', response);

        setSearchReponse(response);
    };

    const processSearchResults = ()=>{

        const { results } = searchResponse;

        results.forEach(item=>{
            item = formatAsAgolItem(item);
        });

        const items = ( searchResponse.start === 1 )
            ? results 
            : [ ...webMapItems, ...results ];

        setWebMapItems(items);

    }

    const categoryFilterOnChange = (data:SelectedCategory)=>{
        agolGroupData.updateSelectedCategory(data.title, data.subcategories);
        searchItems();
    };

    const searchAutoCompleteOnChange = (val:string)=>{
        agolGroupData.updateSearchTerm(val);
        searchItems();
    };

    const searchMoreItems = ()=>{
        if(isSearchDisabled){
            return;
        }

        searchItems({
            searchNextSet: true
        });
    }

    React.useEffect(()=>{

        // fetchItemCollections();
        // fecthActiveWebmapItem();
        fetchMyFavItems();

        if(!isSearchDisabled){
            // load category schema to enable modules required to search arcgis online items
            initCategorySchema();
        }
    }, []);

    // once category schema is ready, init the AGOL Group Data module
    React.useEffect(()=>{
        if(categorySchema){
            initAgolGroupData();
        }
    }, [ categorySchema ]);

    // start searching policy maps items once agolGroupData is ready
    React.useEffect(()=>{
        if(agolGroupData){
            searchItems();
        }
    }, [ agolGroupData ]);

    // update webmap items after search response is updated
    React.useEffect(()=>{
        if(searchResponse){
            processSearchResults();
        };

    }, [ searchResponse ]);

    return <BrowseApp
        disableSearch={isSearchDisabled}
        searchResults={webMapItems}
        searchResultsCount={searchResponse ? searchResponse.total : 0}
        categorySchema={categorySchema}

        sidebarScrolledToEnd={searchMoreItems}
        categoryFilterOnChange={categoryFilterOnChange}
        searchAutoCompleteOnChange={searchAutoCompleteOnChange}
    />
}

export default BrowseAppContainer;