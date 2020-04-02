import * as React from 'react';

import { loadModules, loadCss } from 'esri-loader';

import { 
    BrowseAppContext 
} from '../../contexts/BrowseAppProvider';

import IMapView from 'esri/views/MapView';
import IWebMap from "esri/WebMap";
import IwatchUtils from 'esri/core/watchUtils';

interface Props {
    webmapId?: string;
    children?: React.ReactNode;
};

const MapView:React.FC<Props> = ({
    // webmapId,
    children
}: Props)=>{

    const { activeWebmapItem, mapCenterLocation, setMapCenterLocation } = React.useContext(BrowseAppContext);

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

                setMapCenterLocation({
                    lat: +mapView.center.latitude.toFixed(3),
                    lon: +mapView.center.longitude.toFixed(3),
                    zoom: mapView.zoom
                });
            });

        } catch(err){   
            console.error(err);
        }
    };

    React.useEffect(()=>{
        // console.log('active webmap id on change', activeWebmapId);

        if(mapView){
            updateWebMap();
        }

    }, [ activeWebmapItem ]);

    React.useEffect(()=>{
        if(mapView){
            addWatchEvent();
        }
    }, [ mapView ])

    React.useEffect(()=>{
        loadCss();
        initMapView();
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