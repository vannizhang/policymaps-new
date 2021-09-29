import { PartialRootState } from './configureStore';

import { initialUIState, UIState } from './reducers/UI';
import { initialMapState, MapState} from './reducers/map';
import { initialItemCollectionState, ItemCollectionState} from './reducers/itemCollections';
import { initialMyFavItemsState, MyFavItemsState } from './reducers/myFavItems';
import { decodeSearchParams, Location } from '../../utils/url-manager/BrowseAppUrlManager';
import { AgolItem, formatAsAgolItem } from '../../utils/arcgis-online-item-formatter';
import { queryItemsByCategory, queryItemsByIds } from '../../utils/arcgis-online-group-data';
import { Tier } from '../../AppConfig';
import { miscFns } from 'helper-toolkit-ts';

const isMobile = miscFns.isMobileDevice();

const searchParams = decodeSearchParams();

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

const getPreloadedState4UI = (): UIState => {

    const { isSideBarHide } = searchParams

    const state: UIState = {
        ...initialUIState,
        hideSideBar: isMobile ? true : isSideBarHide
    };

    return state;
};

const getPreloadedState4Map = async(): Promise<MapState> => {

    const { activeWebmapId, location } = searchParams;

    let activeWebmap: AgolItem = activeWebmapId 
        ? (await fetchItems([activeWebmapId]))[0]
        : await fetchDefaultWebmap();

    const state: MapState = {
        ...initialMapState,
        activeWebmap,
        centerLocation: location
    };

    return state;
};

const getPreloadedState4ItemCollection = async(): Promise<ItemCollectionState> => {

    const { collections } = searchParams;

    const items = collections.length 
        ? await fetchItems(collections) 
        : [];
    
    const byIds = {};

    items.forEach(item=>{
        byIds[item.id] = item
    })

    const state: ItemCollectionState = {
        ...initialItemCollectionState,
        allIds: collections,
        byIds
    };

    return state;
};

const getPreloadedState4MyFavItems = (): MyFavItemsState => {

    const state: MyFavItemsState = {
        ...initialMyFavItemsState,
    };

    return state;
};

const getPreloadedState = async (): Promise<PartialRootState> => {

    const preloadedState = {
        ui: getPreloadedState4UI(),
        map: await getPreloadedState4Map(),
        entities: {
            itemCollection: await getPreloadedState4ItemCollection(),
            myFavItems: getPreloadedState4MyFavItems()
        }
    } as PartialRootState;

    return preloadedState;
};

export default getPreloadedState;