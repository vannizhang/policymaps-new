import { urlFns } from 'helper-toolkit-ts';

type ParamKeys = 'q' | 'type' | 'sort' | 'category' | 'start';

const hashParamsData = urlFns.parseHash();

export const updateHashParam = (key:ParamKeys, value:string)=>{
    urlFns.updateHashParam({key, value})
} 

export const batchUpdateHashParam = ({
    q, 
    types, 
    sort, 
    category, 
    start
}: {
    q: string,
    types: string, 
    sort: string,
    category: string,
    start: string,
})=>{

    const data = {
        q, 
        types, 
        sort, 
        category, 
        start
    };

    const hashParams = [];

    for (const [key, value] of Object.entries(data)) {
        if(value){
            hashParams.push(`${key}=${value}`)
        }
    }

    window.location.hash = hashParams.join('&');

    // urlFns.updateHashParam({key, value})
} 

export const getHashParams = ():Record<ParamKeys, string>=>{

    const { q, type, sort, category, start } = hashParamsData;

    return {
        q, 
        type, 
        sort, 
        category,
        start: start || '1'
    }
}