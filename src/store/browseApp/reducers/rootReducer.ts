import { combineReducers } from 'redux';

import itemCollectionsReducer from './itemCollections';
import myFavItemsReducer from './myFavItems';
import mapReducer from './map';
import uiReducer from './UI';

const entities = combineReducers({
    itemCollection: itemCollectionsReducer,
    myFavItems: myFavItemsReducer
});

export default combineReducers({
    entities,
    map: mapReducer,
    ui: uiReducer
});