import { urlFns } from 'helper-toolkit-ts';

type SearhParamKeys = 'col' | 'viz' | 'loc' | 'hs';

type IsSideBarHideValue = '0' | '1';

export interface Location {
    lat: number;
    lon: number;
    zoom: number;
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

type URLData = {
    [key in SearhParamKeys]: string;
}

const urlQueryData: URLData = urlFns.parseQuery();
const urlHashData: URLData = urlFns.parseHash();

export const updateCollectionsInQueryParam = (collections: string[])=>{
    if(collections){
        const key = SearchParamKeyLookup['collections'];
        const value = collections.length 
            ? collections.join(',') 
            : 'null';

        urlFns.updateHashParam({
            key,
            value
        });
    }
}

export const updateMapCenterLocationInQueryParam = (location:Location)=>{
    if(location){
        const key = SearchParamKeyLookup['location'];
        const value = encodeLocation(location);
        urlFns.updateHashParam({
            key,
            value
        });
    }
}

export const updateActiveWebmapIdInQueryParam = (activeWebmapId:string)=>{
    if(activeWebmapId){
        const key = SearchParamKeyLookup['activeWebmapId'];
        const value = activeWebmapId;
    
        urlFns.updateHashParam({
            key,
            value
        });
    }
}

export const updateSideBarHideInQueryParam = (isSideBarHide:boolean)=>{
    if(typeof isSideBarHide === 'boolean'){
        const key = SearchParamKeyLookup['isSideBarHide'];
        const value:IsSideBarHideValue = isSideBarHide ? '1' : '0';

        urlFns.updateHashParam({
            key,
            value
        });
    }
}

export const decodeSearchParams = ():decodeSearchParamsResponse=>{

    const urlData:URLData = Object.keys(urlHashData).length
        ? urlHashData
        : urlQueryData;

    // const searchParams = urlFns.parseQuery();

    const collections = urlData['col'] && urlData['col'] !== 'null'
        ? urlData['col'].split(',') 
        : [];

    const activeWebmapId = urlData['viz'] || ''; 

    const location = urlData['loc'] 
        ? decodeLocation(urlData['loc']) 
        : null;

    const isSideBarHide = urlData['hs'] && urlData['hs'] === '1' 
        ? true 
        : false;

    // // the app used to save UI states in URL Search Params, which is not ideal as it makes very hard for the CDN to cache all of those URLs,
    // // this is the reason why we switched from using Search Params to Hash Params. And we need to remove Search Params from the URL to keep the URL clean and unique.
    if(Object.keys(urlQueryData).length){
        // remove the query string from URL
        window.history.pushState({}, document.title, window.location.pathname);
    }

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