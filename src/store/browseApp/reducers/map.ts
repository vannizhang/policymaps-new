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
    AgolItem
} from '../../../utils/arcgis-online-item-formatter';

import {
    Location,
    decodeSearchParams
} from '../../../utils/url-manager/BrowseAppUrlManager';

interface MapInitialState {
    activeWebmap: AgolItem;
    centerLocation: Location;
};

interface ActiveMapChangedAction {
    type: string;
    payload: AgolItem;
};

interface CenterLocationChangedAction {
    type: string;
    payload: Location;
};

const { location } = decodeSearchParams();

const slice = createSlice({
    name: 'map',
    initialState: {
        activeWebmap: null,
        centerLocation: location
    } as MapInitialState,
    reducers: {
        activeMapChanged: (map, action:ActiveMapChangedAction)=>{
            map.activeWebmap = action.payload;
        },
        mapCenterLocationChanged: (map, action:CenterLocationChangedAction)=>{
            map.centerLocation = action.payload
        }
    }
});

const {
    reducer,
} = slice;

const {
    activeMapChanged,
    mapCenterLocationChanged
} = slice.actions;

export const setActiveWebmap = (item:AgolItem)=> (dispatch:StoreDispatch, getState:StoreGetState)=>{
    dispatch(activeMapChanged(item));
};

export const setCenterLocation = (location:Location)=> (dispatch:StoreDispatch, getState:StoreGetState)=>{
    dispatch(mapCenterLocationChanged(location));
};

// selector
export const activeWebmapSelector = createSelector(
    (state:RootState)=>state.map.activeWebmap,
    activeWebmap=>activeWebmap
);

export const centerLocationSelector = createSelector(
    (state:RootState)=>state.map.centerLocation,
    centerLocation=>centerLocation
);

export default reducer;