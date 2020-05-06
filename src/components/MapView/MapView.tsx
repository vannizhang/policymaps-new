import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadModules, loadCss } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import IWebMap from "esri/WebMap";
import IwatchUtils from 'esri/core/watchUtils';

import {
    setCenterLocation,
    centerLocationSelector,
	activeWebmapSelector
} from '../../store/browseApp/reducers/map';

interface Props {
    webmapId?: string;
    children?: React.ReactNode;
};

const MapView:React.FC<Props> = ({
    // webmapId,
    children
}: Props)=>{

    const dispatch = useDispatch();

    const activeWebmapItem = useSelector(activeWebmapSelector);

    const mapCenterLocation = useSelector(centerLocationSelector)

    const mapDivRef = React.useRef<HTMLDivElement>();

    const [ mapView, setMapView] = React.useState<IMapView>(null);

    const initMapView = async()=>{
        
        type Modules = [typeof IMapView, typeof IWebMap];

        try {
            const [ 
                MapView, 
                WebMap 
            ] = await (loadModules([
                'esri/views/MapView',
                'esri/WebMap',
            ]) as Promise<Modules>);

            const view = new MapView({
                container: mapDivRef.current,
                map: new WebMap({
                    portalItem: {
                        id: activeWebmapItem.id
                    }  
                }),
                center: mapCenterLocation ? [ mapCenterLocation.lon, mapCenterLocation.lat ] : undefined,
                zoom: mapCenterLocation ? mapCenterLocation.zoom : undefined
            });

            view.when(()=>{
                setMapView(view);
            });

        } catch(err){   
            console.error(err);
        }
    };

    const updateWebMap = async()=>{
        type Modules = [typeof IWebMap];

        try {
            const [ 
                WebMap 
            ] = await (loadModules([
                'esri/WebMap'
            ]) as Promise<Modules>);

            mapView.map = new WebMap({
                portalItem: {
                    id: activeWebmapItem.id
                }
            });

        } catch(err){   
            console.error(err);
        }
    };

    const addWatchEvent = async()=>{
        type Modules = [typeof IwatchUtils];

        try {
            const [ 
                watchUtils 
            ] = await (loadModules([
                'esri/core/watchUtils'
            ]) as Promise<Modules>);

            watchUtils.whenTrue(mapView, 'stationary', ()=>{
                // console.log('mapview is stationary', mapView.center, mapView.zoom);

                const centerLocation = {
                    lat: mapView.center && mapView.center.latitude 
                        ? +mapView.center.latitude.toFixed(3) 
                        : 0,
                    lon: mapView.center && mapView.center.longitude 
                        ? +mapView.center.longitude.toFixed(3) 
                        : 0,
                    zoom: mapView.zoom
                }
                
                dispatch(setCenterLocation(centerLocation));
            });

        } catch(err){   
            console.error(err);
        }
    };

    React.useEffect(()=>{
        
        if(!activeWebmapItem){
            return;
        }

        if(!mapView){
            initMapView();
        } else {
            updateWebMap();
        }

    }, [ activeWebmapItem ]);

    React.useEffect(()=>{
        if(mapView){
            addWatchEvent();
        }
    }, [ mapView ]);

    React.useEffect(()=>{
        loadCss();
    }, []);

    return (
        <>
            <div 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    margin: 0,
                    padding: 0,
                    width: '100%',
                    height: '100%',
                }}
                ref={mapDivRef}
            ></div>
            { 
                React.Children.map(children, (child)=>{
                    return React.cloneElement(child as React.ReactElement<any>, {
                        mapView,
                    });
                }) 
            }
        </>
    );
};

export default MapView;