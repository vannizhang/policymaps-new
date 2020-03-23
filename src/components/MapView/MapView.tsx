import * as React from 'react';

import { loadModules, loadCss } from 'esri-loader';

import { 
    BrowseAppContext 
} from '../../contexts/BrowseAppProvider';

import { 
    AgolItem 
} from '../../utils/arcgis-online-group-data';

import IMapView from 'esri/views/MapView';
import IWebMap from "esri/WebMap";

interface Props {
    webmapId: string;
    children?: React.ReactNode;
};

const MapView:React.FC<Props> = ({
    // webmapId,
    children
}: Props)=>{

    const { activeWebmapId } = React.useContext(BrowseAppContext);

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
                        id: activeWebmapId
                    }  
                }),
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
                    id: activeWebmapId
                }  
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

    }, [ activeWebmapId ])

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