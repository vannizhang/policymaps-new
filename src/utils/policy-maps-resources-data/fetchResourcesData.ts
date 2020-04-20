import axios from 'axios';

import {
    Tier
} from '../../AppConfig';

import {
    formatAsAgolItem,
    AgolItem
} from '../../utils/arcgis-online-item-formatter';

export type ResourceCategoryName = 'Industry Perspectives' | 'Getting Started' | 'Learn Lessons' | 'Best Practices' | 'In the News';

interface fetchResourcesDataOptions {
    categories: ResourceCategoryName[]
};

export const fetchResourcesData = async({
    categories
}:fetchResourcesDataOptions): Promise<AgolItem[]>=>{

    try {
        const { AGOL_GROUP_ID } = Tier.PROD;

        const categoryPaths = categories
            .map(d=>{
                return `/Categories/Resources/${d}`;
            })
            .join(',');

        const requestUrl = `https://www.arcgis.com/sharing/rest/content/groups/${AGOL_GROUP_ID}/search?f=json&start=1&num=100&sortField=modified&sortOrder=desc&categories=${categoryPaths}`;

        const { data } = await axios.get(requestUrl);

        if(!data || !data.results || !data.results.length){
            return [];
        }

        const resourcesData = data.results
            .map((d:AgolItem)=>formatAsAgolItem(d , { thumbnailWidth: 400 }));

        return resourcesData;

    } catch(err){
        console.error(err);
    }
    
};