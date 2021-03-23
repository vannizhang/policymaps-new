import * as React from 'react';

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import ILegend from 'esri/widgets/Legend';
import IExpand from 'esri/widgets/Expand'
import { SiteContext } from '../../contexts/SiteContextProvider';

interface Props {
    isVisible?: boolean;
    mapView?: IMapView;
}

const LegendWidget:React.FC<Props> = ({
    isVisible,
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

            if(isMobile){
                const bgExpand = new Expand({
                    view: mapView,
                    content: legend,
                    expandIconClass: 'esri-icon-legend'
                });

                mapView.ui.add(bgExpand, "bottom-left");
            } else {
                mapView.ui.add(legend, "bottom-left");
            }

        } catch(err){   
            console.error(err);
        }
    };

    const toggleLegend = ()=>{

        if(isMobile){
            return;
        }

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

