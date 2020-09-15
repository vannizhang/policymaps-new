import * as React from 'react';
import { loadModules, loadCss } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import IWebMap from "esri/WebMap";
import IwatchUtils from 'esri/core/watchUtils';
import IExtent from "esri/geometry/Extent";

import { 
    AgolItem 
} from '../../../utils/arcgis-online-group-data';

import {
    Location
} from '../../../utils/url-manager/BrowseAppUrlManager';

interface Props {
    webmapItem?: AgolItem;
    initialCenter?: {
        lon: number;
        lat: number;
    };
    initialZoom?: number;

    onStationary?: (location:Location)=>void;

    children?: React.ReactNode;
};

// get preferred extent for webmap covers local topics
const getPreferredExtent = async(item:AgolItem):Promise<IExtent>=>{

    const isLocal = item.groupCategories.indexOf('/Categories/Resources/Ready to Use Maps/Local') > -1;
    const isRegional = item.groupCategories.indexOf('/Categories/Resources/Ready to Use Maps/Regional') > -1;
    const isNational = item.groupCategories.indexOf('/Categories/Resources/Ready to Use Maps/National') > -1;

    if(isRegional && isNational){
        return null;
    }

    if(!isLocal){
        return null;
    }

    type Modules = [typeof IExtent];

    const [ 
        Extent
    ] = await (loadModules([
        'esri/geometry/Extent'
    ]) as Promise<Modules>);

    const [ xmin, ymin ] = item.extent[0];
    const [ xmax, ymax ] = item.extent[1];

    return new Extent({
        xmin,
        xmax,
        ymin,
        ymax
    });

}

const MapView:React.FC<Props> = ({
    webmapItem,
    initialCenter,
    initialZoom,
    onStationary,
    children
}: Props)=>{

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

            const preferredExtent = !initialCenter && !initialZoom ? await getPreferredExtent(webmapItem) : undefined;

            const view = new MapView({
                container: mapDivRef.current,
                map: new WebMap({
                    portalItem: {
                        id: webmapItem.id
                    }  
                }),
                extent: preferredExtent,
                center: initialCenter ? [ initialCenter.lon, initialCenter.lat ] : undefined,
                zoom: initialZoom ? initialZoom : undefined
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
                    id: webmapItem.id
                }
            });

            const preferredExtent = await getPreferredExtent(webmapItem);

            if(preferredExtent){
                mapView.extent = preferredExtent;
            }

            // const preferredZoom = await getPreferredZoom(webmapItem);

            // if(!preferredExtent && preferredZoom > 0){
            //     mapView.zoom = preferredZoom;
            // }

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

                if(mapView.zoom === -1){
                    return;
                }

                const centerLocation = {
                    lat: mapView.center && mapView.center.latitude 
                        ? +mapView.center.latitude.toFixed(3) 
                        : 0,
                    lon: mapView.center && mapView.center.longitude 
                        ? +mapView.center.longitude.toFixed(3) 
                        : 0,
                    zoom: mapView.zoom
                }
                
                onStationary(centerLocation);
            });

        } catch(err){   
            console.error(err);
        }
    };

    React.useEffect(()=>{
        loadCss();
    }, []);

    React.useEffect(()=>{

        if(!webmapItem){
            return;
        }

        if(!mapView){
            initMapView();
        } else {
            updateWebMap();
        }
    }, [ webmapItem ]);

    React.useEffect(()=>{
        if(mapView){
            addWatchEvent();
        }
    }, [ mapView ]);

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