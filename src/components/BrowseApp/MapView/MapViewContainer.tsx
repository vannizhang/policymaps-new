import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    setCenterLocation,
    centerLocationSelector,
	activeWebmapSelector
} from '../../../store/browseApp/reducers/map';

import { 
    updateActiveWebmapIdInQueryParam, 
    updateMapCenterLocationInQueryParam 
} from '../../../utils/url-manager/BrowseAppUrlManager';

import MapView from './MapView';

interface Props {
    children?: React.ReactNode;
};

const MapViewContainer:React.FC<Props> = ({
    children
}: Props)=>{

    const dispatch = useDispatch();

    const activeWebmapItem = useSelector(activeWebmapSelector);

    const mapCenterLocation = useSelector(centerLocationSelector);

    React.useEffect(()=>{
        if(activeWebmapItem){
            updateActiveWebmapIdInQueryParam(activeWebmapItem.id)
        }
    }, [activeWebmapItem])

    React.useEffect(()=>{
        if(mapCenterLocation){
            updateMapCenterLocationInQueryParam(mapCenterLocation)
        }
    }, [mapCenterLocation])

    return  (
        <MapView
            webmapItem={activeWebmapItem}
            initialZoom={mapCenterLocation ? mapCenterLocation.zoom : undefined}
            initialCenter={mapCenterLocation ? { lat: mapCenterLocation.lat, lon: mapCenterLocation.lon } : undefined}
            onStationary={(location)=>{
                dispatch(setCenterLocation(location));
            }}
        >
            { children }
        </MapView>
    );
};

export default MapViewContainer;