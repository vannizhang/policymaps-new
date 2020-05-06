import * as React from 'react';

import { 
    // AgolItem,
    queryItemsByIds
} from '../utils/arcgis-online-group-data';

import { 
    AgolItem,
    formatAsAgolItem
} from '../utils/arcgis-online-item-formatter';

import {
    encodeSearchParams,
    Location
} from '../utils/url-manager/BrowseAppUrlManager';

// import { Tier } from '../AppConfig';

// export { AgolItem };

interface BrowseAppContextProps {
    // activeWebmapItem: AgolItem;
    // setActiveWebmapItem: (item:AgolItem)=>void;

    // itemsCollection: AgolItem[],
    // toggleFromItemCollections: (item:AgolItem)=>void;

    // hideSideBar: boolean;
    // toggleHideSideBar: ()=>void;

    // mapCenterLocation: Location;
    // setMapCenterLocation: (location:Location)=>void;

    // myFavItems: string[];
    // setMyFavItems: (items: string[])=>void;

    // currentUrl: string;
};

interface BrowseAppContextProviderProps {
    // children: React.ReactNode;
    // the item id for the webmap that will be used to init the map view
    webmapId: string;
    // list of items ids for the predefined collection 
    collections?: string[];

    defaultLocation?: Location;
    hideSideBarByDefault?: boolean;
};

export const BrowseAppContext = React.createContext<BrowseAppContextProps>(null);

export const BrowseAppContextProvider:React.FC<BrowseAppContextProviderProps> = ({ 
    webmapId,
    collections,
    defaultLocation,
    hideSideBarByDefault,
    children,
})=>{

    // const [ activeWebmapItem, setActiveWebmapItem ] = React.useState<AgolItem>(null);

    // const [ itemsCollection, setItemsCollection ] = React.useState<AgolItem[]>(null);

    // const [ hideSideBar, setHideSideBar ] = React.useState<boolean>(hideSideBarByDefault);

    // const [ mapCenterLocation, setMapCenterLocation ] = React.useState<Location>(defaultLocation);

    // const [ currentUrl, setCurrentUrl ] = React.useState<string>(window.location.href);

    // const [ myFavItems, setMyFavItems ] = React.useState<string[]>([]);

    // const toggleFromItemCollections = (item:AgolItem)=>{
    //     const itemIds = itemsCollection.map(d=>d.id);

    //     const index = itemIds.indexOf(item.id);

    //     const newItemsCollection:AgolItem[] = [...itemsCollection];
        
    //     // push to end of the list if the item doesn't exist,
    //     // otherwise, remove the item from collections
    //     if(index === -1){
    //         newItemsCollection.push(item)
    //     } else {
    //         newItemsCollection.splice(index, 1);
    //     }

    //     setItemsCollection(newItemsCollection);
    // };

    // // fetch items required to init the browse app (active web map, items in collection)
    // const fetchData = async()=>{

    //     const itemIds = [
    //         webmapId, 
    //         // ...collections
    //     ];

    //     const results = await queryItemsByIds({
    //         itemIds,
    //         groupId: Tier.PROD.AGOL_GROUP_ID
    //     });
    //     console.log('agol items to init browse app', results);

    //     // initItemsCollection(results);

    //     initActiveWebmap(results);
    // };

    // const initActiveWebmap = (data:AgolItem[])=>{
    //     const webmapItem = data.filter(d=>d.id === webmapId)[0];
    //     setActiveWebmapItem(formatAsAgolItem(webmapItem));
    // }

    // const initItemsCollection = (data:AgolItem[])=>{
    //     const itemsCollection: AgolItem[] = [];

    //     data.forEach(item=>{
    //         const index = collections.indexOf(item.id);
    //         itemsCollection[index] = formatAsAgolItem(item);
    //     });

    //     setItemsCollection(itemsCollection);
    // }

    // const toggleHideSideBar = ()=>{
    //     setHideSideBar(!hideSideBar);
    // };

    const value = {
        // activeWebmapItem,
        // setActiveWebmapItem,

        // itemsCollection,
        // toggleFromItemCollections,

        // hideSideBar,
        // toggleHideSideBar,

        // mapCenterLocation,
        // setMapCenterLocation,

        // myFavItems,
        // setMyFavItems,

        // currentUrl
    };

    // React.useEffect(()=>{
    //     fetchData();
    // }, []);

    // React.useEffect(()=>{
    //     encodeSearchParams({
    //         // activeWebmapId: activeWebmapItem ? activeWebmapItem.id : '',
    //         // collections: itemsCollection && itemsCollection.length ? itemsCollection.map(d=>d.id) : [],
    //         // location: mapCenterLocation,
    //         // isSideBarHide: hideSideBar
    //     });

    //     setCurrentUrl(window.location.href);
        
    // }, []);

    return (
        <BrowseAppContext.Provider value={value}>
            { 
                children
            }
        </BrowseAppContext.Provider>
    );
}