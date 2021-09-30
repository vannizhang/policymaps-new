import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    SiteContext
} from '../../../contexts/SiteContextProvider';

import BrowseApp from './App';

import { SelectedCategory } from '../CategoryFilter';
import { itemsSelector, loadMoreItems, searchItems, searchResultSelector, updateCategory, updateSearchTerm } from '../../../store/browseApp/reducers/groupContent';
import { IGroupCategory } from '@esri/arcgis-rest-portal';

type Props = {
    categorySchema:IGroupCategory
}

const BrowseAppContainer:React.FC<Props> = ({
    categorySchema
}:Props)=>{

    const dispatch = useDispatch();

    const { isSearchDisabled } = React.useContext(SiteContext);

    const items = useSelector(itemsSelector);

    const searchResponse = useSelector(searchResultSelector)

    const categoryFilterOnChange = (data:SelectedCategory)=>{
        dispatch(updateCategory(data.title, data.subcategories))
    };

    const searchAutoCompleteOnChange = (val:string)=>{
        dispatch(updateSearchTerm(val))
    };

    const searchMoreItems = ()=>{
        if(isSearchDisabled){
            return;
        }

        dispatch(loadMoreItems())
    }

    React.useEffect(()=>{
        if(!isSearchDisabled){
            dispatch(searchItems())
        }
    }, []);

    return <BrowseApp
        disableSearch={isSearchDisabled}
        searchResults={items}
        searchResultsCount={searchResponse ? searchResponse.total : 0}
        categorySchema={categorySchema}

        sidebarScrolledToEnd={searchMoreItems}
        categoryFilterOnChange={categoryFilterOnChange}
        searchAutoCompleteOnChange={searchAutoCompleteOnChange}
    />
}

export default BrowseAppContainer;