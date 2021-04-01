import * as React from 'react';

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import ILegend from 'esri/widgets/Legend';
import IExpand from 'esri/widgets/Expand'
import { SiteContext } from '../../contexts/SiteContextProvider';

interface Props {
    mapView?: IMapView;
}

const LegendWidget:React.FC<Props> = ({
    mapView
})=>{

    const { isMobile } = React.useContext(SiteContext)

    const [ legend, setLegend ] = React.useState<ILegend>();

    const init = async()=>{
        type Modules = [typeof ILegend, typeof IExpand];

        try {
            const [ 
                Legend, 
                Expand
            ] = await (loadModules([
                'esri/widgets/Legend',
                'esri/widgets/Expand',
            ]) as Promise<Modules>);

            const legend = new Legend({
                view: mapView
            });

            setLegend(legend);

            const legendWidgetExpand = new Expand({
                view: mapView,
                content: legend,
                expandIconClass: 'esri-icon-legend',
                expanded: isMobile ? false : true,
                mode: 'floating'
            });

            mapView.ui.add(legendWidgetExpand, "bottom-left");

        } catch(err){   
            console.error(err);
        }
    };

    React.useEffect(()=>{
        if(mapView){
            init();
        }
    }, [mapView]);

    return null;
};

export default LegendWidget;

