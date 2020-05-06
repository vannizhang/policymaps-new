import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import ActiveMapSwitcher from './ActiveMapSwitcher';

import {
    itemCollectionSelector
} from '../../../store/browseApp/reducers/itemCollections';

import {
    setActiveWebmap,
	activeWebmapSelector
} from '../../../store/browseApp/reducers/map';

interface Props {
    isMinimal: boolean;
}

const ActiveMapSwitcherContainer:React.FC<Props> = ({
    isMinimal
})=>{

    const dispatch = useDispatch();

    const itemsCollection = useSelector(itemCollectionSelector);

    const activeWebmapItem = useSelector(activeWebmapSelector);

    const activeWebmapIdOnChange = (itemId:string)=>{
        const newItem = itemsCollection.filter(d=>d.id === itemId)[0];
        dispatch(setActiveWebmap(newItem));
    }

    return activeWebmapItem ? (
        <ActiveMapSwitcher 
            isMinimal={isMinimal}
            activeItemId={activeWebmapItem.id}
            activeItemTitle={activeWebmapItem.title}
            allItemIds={itemsCollection.map(d=>d.id)}
            activeItemIdOnChange={activeWebmapIdOnChange}
        />
    ) : null;
};

export default ActiveMapSwitcherContainer;