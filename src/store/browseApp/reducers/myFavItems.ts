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

const slice = createSlice({
    name: 'myFavItems',
    initialState: {
        allIds: []
    } as MyFavItemsInitialState,
    reducers: {}
});

const {
    reducer,
} = slice;

export default reducer;