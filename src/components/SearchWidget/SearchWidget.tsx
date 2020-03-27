import * as React from 'react';

import { loadModules } from 'esri-loader';

import IMapView from 'esri/views/MapView';
import ISearchWidget from 'esri/widgets/Search';

export const SearchWidgetContainerId = 'searcgWidgetContainer';

interface Props {
    mapView?: IMapView;
}

const SearchWidget:React.FC<Props> = ({
    mapView
})=>{

    const init = async()=>{
        type Modules = [typeof ISearchWidget];

        try {
            const [ 
                Search, 
            ] = await (loadModules([
                'esri/widgets/Search',
            ]) as Promise<Modules>);

            const searchWidget = new Search({
                view: mapView,
                container: SearchWidgetContainerId
            });

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

export default SearchWidget;

