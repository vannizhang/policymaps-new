import axios from 'axios';

import {
    AgolItem,
    SearchResponse,
    getUrlForSearchOperation,
} from './index';

interface Props {
    itemIds: string[];
    groupId: string,
    agolHost?: string;
}

const queryItemsByIds = async({
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
    };

    const paramsAsStr = Object.keys(params).map(key=>{
        return `${key}=${params[key]}`;
    }).join('&');

    const requestURL = `${urlForSearchOperation}?${paramsAsStr}`;

    try {
        const { data } = await axios.get<SearchResponse>(requestURL);
        return data.results;
        
    } catch(err){
        console.error(err);
    }

};

export default queryItemsByIds;