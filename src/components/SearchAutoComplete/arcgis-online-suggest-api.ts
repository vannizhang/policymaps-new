import axios from 'axios';

interface Props {
    searchTerm: string;
    groupId: string;
    // type:"web map"
    filters: string;
    agolHost?: string;
}

export interface SuggestResult {
    owner: string;
    id: string;
    categories: string[];
    type: string;
    title: string;
    tags: string[];
    typeKeywords: string[];
}

export interface SuggestApiResponse {
    total: number;
    suggest: string;
    results: SuggestResult[];
}

export const getSearchSuggest = async({
    searchTerm,
    groupId,
    filters,
    agolHost = 'https://www.arcgis.com'
}:Props): Promise<SuggestApiResponse>=>{

    if(!searchTerm || searchTerm.length < 3){
        // console.log('search term with length greater or equal to 3 is required');
        return null;
    }

    try {
        const filterString = [ `group:"${groupId}"`, filters ].filter(d=>d).join(' AND ');
        const requestUrl = `${agolHost}/sharing/rest/search/suggest?f=json&suggest=${searchTerm}&filters=${filterString}`;
        const { data } = await axios.get(requestUrl);

        return data;
    } catch (err){
        console.log('failed to call suggest api', err);
        return;
    }

};