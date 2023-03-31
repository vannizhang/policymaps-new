import { 
    createSlice,
    createSelector,
    PayloadAction
} from '@reduxjs/toolkit';

import {
    RootState,
    StoreDispatch,
    StoreGetState
} from '../configureStore';

// import {
//     decodeSearchParams
// } from '../../../utils/url-manager/BrowseAppUrlManager';

// import {
//     miscFns
// } from 'helper-toolkit-ts'

export type AlertType = 'hitMaxNumOfItemsInMyCollection'

export interface UIState {
    hideSideBar: boolean;
    /**
     * if true, show dialog of adding items in my collections to my favorites group
     */
    showAddCollections2MyFavDialog: boolean;
    /**
     * active alert to be displayed
     */
    activeAlert?: AlertType
};

// const { isSideBarHide } = decodeSearchParams();
// const isMobile = miscFns.isMobileDevice();

export const initialUIState:UIState = {
    hideSideBar: false, 
    showAddCollections2MyFavDialog: false,
    activeAlert: null
}

const slice = createSlice({
    name: 'ui',
    initialState: initialUIState,
    reducers: {
        hideSideBarToggled: (state)=>{
            const { hideSideBar } = state;
            state.hideSideBar = !hideSideBar;
        },
        showAddCollections2MyFavDialogToggled: (state)=>{
            state.showAddCollections2MyFavDialog = !state.showAddCollections2MyFavDialog
        },
        activeAlertUpdated: (state, action:PayloadAction<AlertType>)=>{
            state.activeAlert = action.payload;
        }
    }
});

const {
    reducer,
} = slice;

export const {
    hideSideBarToggled,
    showAddCollections2MyFavDialogToggled,
    activeAlertUpdated
} = slice.actions;

export const toggleSidebar = ()=> (dispatch:StoreDispatch, getState:StoreGetState)=>{
    dispatch(hideSideBarToggled())
};

export const hideSideBarSelectore = createSelector(
    (state:RootState)=>state.ui.hideSideBar,
    hideSideBar => hideSideBar
)

export const selectShowAddCollections2MyFavDialog = createSelector(
    (state:RootState)=>state.ui.showAddCollections2MyFavDialog,
    showAddCollections2MyFavDialog => showAddCollections2MyFavDialog
)

export const selectActiveAlert = createSelector(
    (state:RootState)=>state.ui.activeAlert,
    activeAlert => activeAlert
)

export default reducer;