import * as React from 'react';

import { useSelector } from 'react-redux';

import {
    itemCollectionSelector
} from '../../../store/browseApp/reducers/itemCollections';

import CardList from '../CardList/CardListContainer';

const MyCollectionContainer:React.FC = ()=>{

    const collectionItems = useSelector(itemCollectionSelector);

    return (
        <CardList 
            title={'My collection of maps'}
            data={collectionItems}
        />
    );
};

export default MyCollectionContainer;