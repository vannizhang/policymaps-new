import * as React from 'react';

import { useSelector } from 'react-redux';

import {
    itemCollectionSelector
} from '../../../store/browseApp/reducers/itemCollections';
import { updateCollectionsInQueryParam } from '../../../utils/url-manager/BrowseAppUrlManager';

import CardList from '../CardList/CardListContainer';

const MyCollectionContainer:React.FC = ()=>{

    const collectionItems = useSelector(itemCollectionSelector);

    React.useEffect(()=>{
        const itemIds = collectionItems && collectionItems.length 
            ? collectionItems.map(d=>d.id) 
            : [];

        updateCollectionsInQueryParam(itemIds);
        
    }, [collectionItems])

    return (
        <CardList 
            title={'My collection of maps'}
            data={collectionItems}
        />
    );
};

export default MyCollectionContainer;