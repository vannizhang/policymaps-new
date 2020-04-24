import { urlFns } from 'helper-toolkit-ts';

type SearhParamKeys = 'col' | 'viz' | 'loc' | 'hs';

type IsSideBarHideValue = '0' | '1';

export interface Location {
    lat: number;
    lon: number;
    zoom: number;
}

interface encodeSearchParamsOptions {
    collections?: string[];
    activeWebmapId?: string;
    location?: Location
    isSideBarHide?: boolean;
}

interface decodeSearchParamsResponse {
    collections?: string[];
    activeWebmapId?: string;
    location?: Location
    isSideBarHide?: boolean;
}

const SearchParamKeyLookup: {
    [key:string]: SearhParamKeys
} = {
    'collections': 'col',
    'activeWebmapId': 'viz',
    'location': 'loc',
    'isSideBarHide': 'hs'
}

export const encodeSearchParams = ({
    collections = [],
    activeWebmapId,
    location,
    isSideBarHide
}: encodeSearchParamsOptions)=>{

    if(location){
        const key = SearchParamKeyLookup['location'];
        const value = encodeLocation(location);
        urlFns.updateQueryParam({
            key,
            value
        });
    }

    if(collections){

        const key = SearchParamKeyLookup['collections'];
        const value = collections.length 
            ? collections.join(',') 
            : 'null';

        urlFns.updateQueryParam({
            key,
            value
        });
    }

    if(activeWebmapId){
        const key = SearchParamKeyLookup['activeWebmapId'];
        const value = activeWebmapId;

        urlFns.updateQueryParam({
            key,
            value
        });
    }

    if(typeof isSideBarHide === 'boolean'){
        const key = SearchParamKeyLookup['isSideBarHide'];
        const value:IsSideBarHideValue = isSideBarHide ? '1' : '0';

        urlFns.updateQueryParam({
            key,
            value
        });
    }

};

export const decodeSearchParams = ():decodeSearchParamsResponse=>{
    const searchParams = urlFns.parseQuery();

    const collections = searchParams['col'] && searchParams['col'] !== 'null'
        ? searchParams['col'].split(',') 
        : [];

    const activeWebmapId = searchParams['viz'] || ''; 

    const location = searchParams['loc'] 
        ? decodeLocation(searchParams['loc']) 
        : null;

    const isSideBarHide = searchParams['hs'] && searchParams['hs'] === '1' 
        ? true 
        : false;

    return {
        collections,
        activeWebmapId,
        location,
        isSideBarHide
    };
};

const encodeLocation = (location:Location)=>{
    const { lon, lat, zoom } = location;
    return `${lon},${lat},${zoom}`;
};

const decodeLocation = (val:string): Location=>{
    const values = val.split(',');
    return {
        lon: +values[0],
        lat: +values[1],
        zoom: +values[2]
    }
}