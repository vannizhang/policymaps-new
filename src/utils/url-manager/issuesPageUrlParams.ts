import { urlFns } from 'helper-toolkit-ts';

type ParamKeys = 'q' | 'type' | 'sort' | 'category';

const hashParamsData = urlFns.parseHash();

export const updateHashParam = (key:ParamKeys, value:string)=>{
    urlFns.updateHashParam({key, value})
} 

export const getHashParams = ():Record<ParamKeys, string>=>{

    const { q, type, sort, category } = hashParamsData;

    return {
        q, 
        type, 
        sort, 
        category
    }
}