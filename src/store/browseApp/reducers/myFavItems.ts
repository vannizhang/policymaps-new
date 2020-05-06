import { 
    createSlice,
    createSelector
} from '@reduxjs/toolkit';

import {
    RootState,
    StoreDispatch,
    StoreGetState
} from '../configureStore';

interface MyFavItemsInitialState {
    allIds: string[];
};

interface MyFavItemsChangedAction {
    type: string;
    payload: string[];
}

const slice = createSlice({
    name: 'myFavItems',
    initialState: {
        allIds: []
    } as MyFavItemsInitialState,
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