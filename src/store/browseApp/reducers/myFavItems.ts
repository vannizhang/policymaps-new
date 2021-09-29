import { 
    createSlice,
    createSelector
} from '@reduxjs/toolkit';

import {
    RootState,
    StoreDispatch,
    StoreGetState
} from '../configureStore';

export interface MyFavItemsState {
    allIds: string[];
};

interface MyFavItemsChangedAction {
    type: string;
    payload: string[];
}

export const initialMyFavItemsState:MyFavItemsState = {
    allIds: []
}

const slice = createSlice({
    name: 'myFavItems',
    initialState: initialMyFavItemsState,
    reducers: {
        myFavItemsChanged: (state, action:MyFavItemsChangedAction)=>{
            state.allIds = action.payload;
        }
    }
});

const {
    reducer,
} = slice;

const {
    myFavItemsChanged
} = slice.actions;

export const setMyFavItems = (ids:string[])=>(dispatch:StoreDispatch, getState:StoreGetState)=>{
    dispatch(myFavItemsChanged(ids));
};

export const myFavItemsSelector = createSelector(
    (state:RootState)=>state.entities.myFavItems.allIds,
    (allIds)=>allIds
);

export default reducer;