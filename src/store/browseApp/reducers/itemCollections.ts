import { 
    createSlice,
    createSelector,
    createAsyncThunk
} from '@reduxjs/toolkit';

import {
    RootState,
    StoreDispatch,
    StoreGetState
} from '../configureStore';

import { 
    AgolItem,
} from '../../../utils/arcgis-online-item-formatter';

interface ItemCollectionInitialState {
    byIds: {
        [key:string]: AgolItem
    };
    allIds: string[];
};

interface ItemsLoadedAction {
    type: string;
    payload: AgolItem[]
};

interface ItemToggledAction {
    type: string;
    payload: AgolItem
};

const slice = createSlice({
    name: 'itemCollection',
    initialState: {
        byIds: {},
        allIds: []
    } as ItemCollectionInitialState,
    reducers: {
        itemsLoaded: ({ byIds, allIds }, action:ItemsLoadedAction)=>{
            const items= action.payload;

            items.forEach(item=>{
                const { id } = item;
                byIds[id] = item;
                allIds.push(id)
            });
        },
        itemAdded: ({ byIds, allIds}, action:ItemToggledAction)=>{
            const item = action.payload;
            const { id } = item;

            byIds[id] = item;
            allIds.push(id);
        },
        itemRemoved: ({ byIds, allIds}, action:ItemToggledAction)=>{
            const item = action.payload;
            const { id } = item;
            const index = allIds.indexOf(id);

            allIds.splice(index, 1);
            delete byIds[item.id];
        }
    }
});

const {
    reducer,
} = slice;

const {
    itemsLoaded,
    itemAdded,
    itemRemoved
} = slice.actions;

// actions
export const loadCollectionItems = (items:AgolItem[])=> async(dispatch:StoreDispatch, getState:StoreGetState)=>{
    dispatch(itemsLoaded(items));
};

export const toggleCollectionItem = (item:AgolItem)=> (dispatch:StoreDispatch, getState:StoreGetState)=>{
    const { id } = item;
    const state = getState()
    const byIds = state.entities.itemCollection.byIds;

    if(!byIds[id]){
        dispatch(itemAdded(item));
    } else {
        dispatch(itemRemoved(item));
    }
};

// selectors
export const itemCollectionSelector = createSelector(
    (state:RootState)=>state.entities.itemCollection.allIds,
    (state:RootState)=>state.entities.itemCollection.byIds,
    (allIds, byIds)=>{
        const items = allIds
            .map(id=>byIds[id])
            .filter(d=>d);
        return items;
    }
)

export default reducer;