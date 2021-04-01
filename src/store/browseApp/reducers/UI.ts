import { 
    createSlice,
    createSelector
} from '@reduxjs/toolkit';

import {
    RootState,
    StoreDispatch,
    StoreGetState
} from '../configureStore';

import {
    decodeSearchParams
} from '../../../utils/url-manager/BrowseAppUrlManager';

import {
    miscFns
} from 'helper-toolkit-ts'

interface UIInitialState {
    hideSideBar: boolean;
};

const { isSideBarHide } = decodeSearchParams();

const isMobile = miscFns.isMobileDevice();

// sidebar should be hidden by default when using mobile device
const initialState4HideSidebar = isMobile 
    ? true 
    : isSideBarHide;

const slice = createSlice({
    name: 'ui',
    initialState: {
        hideSideBar: initialState4HideSidebar
    } as UIInitialState,
    reducers: {
        hideSideBarToggled: (state)=>{
            const { hideSideBar } = state;
            state.hideSideBar = !hideSideBar;
        }
    }
});

const {
    reducer,
} = slice;

const {
    hideSideBarToggled
} = slice.actions;

export const toggleSidebar = ()=> (dispatch:StoreDispatch, getState:StoreGetState)=>{
    dispatch(hideSideBarToggled())
};

export const hideSideBarSelectore = createSelector(
    (state:RootState)=>state.ui.hideSideBar,
    hideSideBar => hideSideBar
)

export default reducer;