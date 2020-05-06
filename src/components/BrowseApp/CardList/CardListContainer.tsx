import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { 
    SiteContext 
} from '../../../contexts/SiteContextProvider';

import {
    itemCollectionSelector,
    toggleCollectionItem
} from '../../../store/browseApp/reducers/itemCollections';

import {
    activeWebmapSelector,
    setActiveWebmap
} from '../../../store/browseApp/reducers/map';

import CardList, {
    CardListData
} from '../CardList/CardList';

import {
    toggleAsMyFavItem
} from '../../../utils/my-favorites/myFav';

import {
    setMyFavItems,
	myFavItemsSelector
} from '../../../store/browseApp/reducers/myFavItems';

import { AgolItem } from '../../../utils/arcgis-online-group-data';

interface Props {
    title: string;
    data: AgolItem[]
}

const CardListContainer:React.FC<Props> = ({
    title,
    data
})=>{

    const { esriOAuthUtils } = React.useContext(SiteContext);

    const dispatch = useDispatch();

    const collectionItems = useSelector(itemCollectionSelector);

    const activeWebmap = useSelector(activeWebmapSelector);

    const myFavItemIds = useSelector(myFavItemsSelector);
    
    const getData = (): CardListData[]=>{

        const collectionItemIds = collectionItems.map(d=>d.id);

        return data.map(d=>{
            return {
                data: d,
                inCollection: collectionItemIds.indexOf(d.id) > -1,
                viewOnMap: activeWebmap && activeWebmap.id === d.id,
                isMyFav: myFavItemIds.indexOf(d.id) > -1
            }
        })
    };

    const myFavBtnOnClickHandler = async(item:AgolItem)=>{
        try {
            const myFavItems = await toggleAsMyFavItem(item.id);
            dispatch(setMyFavItems(myFavItems))
        } catch(err){
            esriOAuthUtils.sigIn();
        }
    };

    return (
        <CardList 
            items={getData()}
            itemCount={data ? data.length : 0}
            title={title}

            viewBtnOnClick={(item)=>{
                dispatch(setActiveWebmap(item))
            }}
            toggleCollectBtnOnClick={(item)=>{
                dispatch(toggleCollectionItem(item))
            }}
            toggleAsMyFavBtnOnClick={myFavBtnOnClickHandler}
        />
    );
};

export default CardListContainer;