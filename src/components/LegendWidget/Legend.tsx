import * as React from 'react';

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import ILegend from 'esri/widgets/Legend';

interface Props {
    isVisible?: boolean;
    mapView?: IMapView;
}

const LegendWidget:React.FC<Props> = ({
    isVisible,
    mapView
})=>{

    const [ legend, setLegend ] = React.useState<ILegend>();

    const init = async()=>{
        type Modules = [typeof ILegend];

        try {
            const [ 
                Legend, 
            ] = await (loadModules([
                'esri/widgets/Legend',
            ]) as Promise<Modules>);

            const legend = new Legend({
                view: mapView
            });

            setLegend(legend);

            mapView.ui.add(legend, "bottom-left");

        } catch(err){   
            console.error(err);
        }
    };

    const toggleLegend = ()=>{
        if( isVisible && !legend ){
            init();
        } else {
            legend.destroy();
            setLegend(null);
        }
    }

    React.useEffect(()=>{
        if(mapView){
            toggleLegend();
        }
    }, [isVisible]);

    React.useEffect(()=>{
        if(mapView){
            init();
        }
    }, [mapView]);

    return null;
};

export default LegendWidget;

