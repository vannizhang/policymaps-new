import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { urlFns } from 'helper-toolkit-ts';

import BrowseApp from './App';

import {
    decodeSearchParams
} from '../../../utils/url-manager/BrowseAppUrlManager';

import { 
    MapConfig 
} from '../Config';

import {
    getMyFavItemIds
} from '../../../utils/my-favorites/myFav';

import { 
    // AgolItem,
    queryItemsByIds
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

const BrowseAppContainer:React.FC = ()=>{

    const dispatch = useDispatch();

    const searchParams = decodeSearchParams();

    const hashParams = urlFns.parseHash();

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
        const items = await fetchItems([ activeWebmapId || MapConfig.DEFAULT_WEBMAP_ID ]);
        // setActiveWebmapItem(items[0]);

        dispatch(setActiveWebmap(items[0]));
    };

    const fetchMyFavItems = async()=>{
        const myFavItems = await getMyFavItemIds();
        // console.log('myFavItems', myFavItems)

        dispatch(setMyFavItems(myFavItems));
    };

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

    React.useEffect(()=>{
        fetchItemCollections();
        fecthActiveWebmapItem();
        fetchMyFavItems();
    }, []);

    return <BrowseApp
        disableSearch={hashParams.disableSearch ? true : false}
    />
}

export default BrowseAppContainer;