import axios from 'axios';

import {
    AgolItem,
    SearchResponse,
    getUrlForSearchOperation,
} from './index';

interface Props {
    itemIds?: string[];
    categories?: string[];
    groupId: string,
    agolHost?: string;
}

type SearchParam = {
    f: string;
    start?: number;
    num?: number;
    q?: string;
    category?: string;
    sortField?: string;
    sortOrder?: string;
}

const convertParams2str = (params: SearchParam)=>{
    const paramsAsStr = Object.keys(params).map(key=>{
        return `${key}=${params[key]}`;
    }).join('&');

    return paramsAsStr;
}

export const queryItemsByIds = async({
    itemIds,
    groupId,
    agolHost = 'https://www.arcgis.com'
}:Props): Promise<AgolItem[]>=>{

    const urlForSearchOperation = getUrlForSearchOperation(groupId, agolHost);

    const queryStrForItemIds = itemIds
    .filter(d=>d)
    .map(id=>{
        return `id:${id}`
    }).join(' OR ');

    const params = {
        f: 'json',
        start: 1,
        num: 100,
        q: `(${queryStrForItemIds})`
    } as SearchParam;

    const requestURL = `${urlForSearchOperation}?${convertParams2str(params)}`;

    try {
        const { data } = await axios.get<SearchResponse>(requestURL);
        return data.results;
        
    } catch(err){
        console.error(err);
    }

};

export const queryItemsByCategory = async({
    categories,
    groupId,
    agolHost = 'https://www.arcgis.com'
}:Props): Promise<AgolItem[]>=>{

    if(!categories || !categories.length){
        return [];
    }

    const urlForSearchOperation = getUrlForSearchOperation(groupId, agolHost);

    const params = {
        f: 'json',
        start: 1,
        num: 5,
        sortField: 'modified',
        sortOrder: 'desc',
        categories: `${categories.join(',')}`
    };

    const requestURL = `${urlForSearchOperation}?${convertParams2str(params)}`;

    try {
        const { data } = await axios.get<SearchResponse>(requestURL);
        return data.results;
        
    } catch(err){
        console.error(err);
    }

};

// export default queryItemsByIds;