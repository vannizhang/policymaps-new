import axios from 'axios';

interface Props {
    searchTerm: string;
    groupId: string;
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
    agolHost = 'https://www.arcgis.com'
}:Props): Promise<SuggestApiResponse>=>{

    if(!searchTerm || searchTerm.length < 3){
        // console.log('search term with length greater or equal to 3 is required');
        return null;
    }

    try {
        const requestUrl = `${agolHost}/sharing/rest/search/suggest?f=json&suggest=${searchTerm}&filters=group:${groupId}`;
        const { data } = await axios.get(requestUrl);

        return data;
    } catch (err){
        console.log('failed to call suggest api', err);
        return;
    }

};