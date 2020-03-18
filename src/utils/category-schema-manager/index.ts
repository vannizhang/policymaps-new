import axios from 'axios';
import { dateFns } from 'helper-toolkit-ts';
import config from './config';

const EXPIRATION_TIME_IN_MINUTES = config["expiration-time-in-minutes"];
const LOCALSTORAGE_ITEM_KEY_CATEGORY_SCHEMA = config["local-storage-keys"]["category-schema"];
const LOCALSTORAGE_ITEM_KEY_EXPIRATION_TIME = config["local-storage-keys"]["expiration-time"];

interface getCategorySchemaProps {
    agolGroupId: string;
    agolHost?: string;
}

interface CategorySchemaSubCategory {
    title: string;
    categories: []
}

interface CategorySchemaMainCategory {
    title: string;
    categories: CategorySchemaSubCategory[];
}

interface CategorySchemaDataItem {
    title: string;
    categories: CategorySchemaMainCategory[];
}

interface CategorySchemaJSON {
    categorySchema: CategorySchemaDataItem[]
}

// get catgeory schema for an AGOL Group
export const getCategorySchema = async({
    agolGroupId,
    agolHost = 'https://www.arcgis.com'
}:getCategorySchemaProps): Promise<CategorySchemaJSON>=>{

    if(!agolGroupId){
        console.error('ArcGIS Online Group ID is missing');
        return;
    }

    const cachedCategorySchema = window.localStorage[LOCALSTORAGE_ITEM_KEY_CATEGORY_SCHEMA] 
        ? JSON.parse(window.localStorage[LOCALSTORAGE_ITEM_KEY_CATEGORY_SCHEMA]) 
        : null;

    const cachedCategorySchemaExpirationTime = window.localStorage[LOCALSTORAGE_ITEM_KEY_EXPIRATION_TIME] 
        ? +window.localStorage[LOCALSTORAGE_ITEM_KEY_EXPIRATION_TIME] 
        : null;

    const currentTime = new Date().getTime();

    // get the category schema and save it to localstorage if either cachedCategorySchema or cachedCategorySchemaExpirationTime is null or it's expired
    if(!cachedCategorySchema || !cachedCategorySchemaExpirationTime || currentTime > cachedCategorySchemaExpirationTime){

        const categorySchema = await fecthContentCategoryItem(agolGroupId, agolHost);
        setCachedCategorySchema(categorySchema);
        resetExpirationTime();

        // console.log('cached category schema is not found or has expired, download category schema');
        return categorySchema;

    } else {
        // console.log('use cached category schema');
        return cachedCategorySchema;
    }
};

const setCachedCategorySchema = (cachedCategorySchema: CategorySchemaJSON)=>{
    window.localStorage.setItem(LOCALSTORAGE_ITEM_KEY_CATEGORY_SCHEMA, JSON.stringify(cachedCategorySchema));
};

const resetExpirationTime = ()=>{
    const expirationTime = dateFns.addMinutesToCurrentTime(EXPIRATION_TIME_IN_MINUTES);
    window.localStorage.setItem(LOCALSTORAGE_ITEM_KEY_EXPIRATION_TIME, expirationTime.toString());
};

const fecthContentCategoryItem = (agolGroupId:string, agolHost:string): Promise<CategorySchemaJSON>=>{

    // const requestURL = agolHost + '/sharing/rest/content/items/' + categorySchemaItemID + '/data?f=json';

    const requestURL = `${agolHost}/sharing/rest/community/groups/${agolGroupId}/categorySchema?f=json`

    return new Promise((resolve, reject)=>{

        axios.get(requestURL)
        .then(res=>{
            if(res && res.data && res.data.categorySchema){
                resolve(res.data.categorySchema);
            } else {
                reject('cannot donwload category schema');
            }
            
        })
        .catch(err=>{
            reject(err)
        });
    });

};