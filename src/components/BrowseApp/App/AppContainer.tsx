import * as React from 'react';
import { useDispatch } from 'react-redux';

import {
    SiteContext
} from '../../../contexts/SiteContextProvider';

import BrowseApp from './App';

import {
    decodeSearchParams
} from '../../../utils/url-manager/BrowseAppUrlManager';

import {
    getMyFavItemIds
} from '../../../utils/my-favorites/myFav';

import { 
    // AgolItem,
    queryItemsByIds,
    queryItemsByCategory
} from '../../../utils/arcgis-online-group-data';

import { 
    AgolItem,
    formatAsAgolItem
} from '../../../utils/arcgis-online-item-formatter';

import {
    loadCollectionItems
} from '../../../store/browseApp/reducers/itemCollections';

import {
    setActiveWebmap
} from '../../../store/browseApp/reducers/map';

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
    const searchParams = decodeSearchParams();

    const { isSearchDisabled } = React.useContext(SiteContext);
    const [ categorySchema, setCategorySchema ] = React.useState<CategorySchemaDataItem>();
    const [ agolGroupData, setAgolGroupData ] = React.useState<ArcGISOnlineGroupData>();
    const [ searchResponse, setSearchReponse ] = React.useState<SearchResponse>();
    const [ webMapItems, setWebMapItems ] = React.useState<AgolItem[]>([]);

    const fetchItemCollections = async()=>{
        const { collections } = searchParams;

        const sortedResults: AgolItem[] = [];
        const items = collections.length ? await fetchItems(collections) : [];
        
        items.forEach(item=>{
            const index = collections.indexOf(item.id);
            sortedResults[index] = item;
        });

        dispatch(loadCollectionItems(sortedResults))
    };

    const fecthActiveWebmapItem = async()=>{
        const { activeWebmapId } = searchParams;

        if(activeWebmapId){
            // set active map using item id from URL query params
            const [ item ] = await fetchItems([activeWebmapId])
            dispatch(setActiveWebmap(item));
        } else {
            // set active map using a item from policy maps group
            // that are pickup up as default webmap by curators 
            const item = await fetchDefaultWebmap()
            dispatch(setActiveWebmap(item));
        }

    };

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
            queryParams: {
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

    const fetchItems = async(itemIds: string[])=>{
        try {

            let items = await queryItemsByIds({
                itemIds,
                groupId: Tier.PROD.AGOL_GROUP_ID
            });

            items = items.map(item=>formatAsAgolItem(item, { thumbnailWidth: 200 }));

            return items;

        } catch(err){
            console.error(err);
        }
    };

    const fetchDefaultWebmap = async():Promise<AgolItem>=>{
        // search items from the Policy Maps group that contains 'Default Explore Maps' category
        try {
            const items = await queryItemsByCategory({
                categories: ['/Categories/Resources/Default Explore Maps'],
                groupId: Tier.PROD.AGOL_GROUP_ID
            });
            
            const randomIdx = Math.floor(Math.random() * items.length)
            
            return items[randomIdx];

        } catch(err){
            console.error(err);
        }
    }

    React.useEffect(()=>{

        fetchItemCollections();
        fecthActiveWebmapItem();
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