import axios from 'axios';

interface AgolItem {
    id: string;
    title: string;
    type: string;
    owner?: string;
    typeKeywords?: string[];
    description?: string;
    snippet?: string;
    documentation?: string;
    extent?: number[][];
    categories?: string[];
    culture?: string;
    properties?: any;
    url?: string;
    tags?: string[];
    thumbnail?: string;
    [key: string]: any;
};

interface ShareOperationResponse {
    itemId: string;
};

let myFavItemIds:string[] = [];

const LOCAL_STORAGE_KEY_ADD = 'itemsToBeAddedToAgolFavGroup';

const portalData = {
    agolHost: '',
    favGroupId: '',
    token: ''
};

const setMyFavItemIds = (itemIds:string[])=>{
    myFavItemIds = itemIds;
}

const getMyFavItems = (): Promise<AgolItem[]>=>{

    const { agolHost, favGroupId, token } = portalData;

    return new Promise(async(resolve, reject)=>{

        if(!favGroupId || !token){
            reject('skip query my fav items for anonymous user');
        }

        const requestUrl = `${agolHost}/sharing/rest/search`;

        const params = {
            start: 1,
            num: 1000,
            q: `(group:${favGroupId})`,
            f: 'json',
            token
        };

        axios.get(requestUrl, { params })
        .then(res=>{
            if(res && res.data && res.data.results){
                resolve(res.data.results);
            } else {
                reject('')
            }
        }).catch(err=>{
            reject(err);
        });

    });


};

const addToMyFavGroup = (itemId='')=>{

    const { favGroupId, token } = portalData;

    return new Promise(async(resolve, reject)=>{

        if(!favGroupId || !token){

            saveToLocalStorage(LOCAL_STORAGE_KEY_ADD, itemId);

            // console.error('favorite group id and token are required to add fav item');
            reject({
                message: 'favorite group id and token are required to add fav item, please sign in first',
                isSignInRequired: true
            });

        } else {

            try {
                const toggleShareAsMyFavRes = await toggleShareAsMyFav(itemId, true);
                resolve(toggleShareAsMyFavRes);
            } catch (err){
                reject(err);
            }

        }
    });
};

const removeFromMyFavGroup = (itemId='')=>{

    const { favGroupId, token } = portalData;

    return new Promise(async(resolve, reject)=>{
            
        if(!favGroupId || !token){

            // console.error('favorite group id and token are required to add fav item');
            reject({
                message: 'favorite group id and token are required to remove fav item, please sign in first',
                isSignInRequired: true
            });

        } else {

            try {
                const toggleShareAsMyFavRes = await toggleShareAsMyFav(itemId, false);
                resolve(toggleShareAsMyFavRes);
            } catch (err){
                reject(err);
            }
        }
    })
};

const addUnSavedItemToMyFav = (): Promise<string>=>{

    const itemId = localStorage.getItem(LOCAL_STORAGE_KEY_ADD) ? localStorage.getItem(LOCAL_STORAGE_KEY_ADD): null;

    return new Promise(async(resolve, reject)=>{

        if(itemId){
        
            resetLocalStorage(LOCAL_STORAGE_KEY_ADD);

            try {
                const res = await addToMyFavGroup(itemId);
                resolve(itemId);
            } catch(err){
                reject(err);
            }
            
        } else {
            reject('no items to be added to my fav');
        }
    })
};

const saveToLocalStorage = (key='', itemIds='')=>{
    localStorage.setItem(key, itemIds);
};

const resetLocalStorage = (key='')=>{
    localStorage.removeItem(key);
};

const toggleMyFavItemIds = (itemId:string)=>{

    const idx = myFavItemIds.indexOf(itemId);
    const newMyFavItemIds = [...myFavItemIds];

    if(idx > -1){
        newMyFavItemIds.splice(idx, 1);
    } else {
        newMyFavItemIds.push(itemId);
    }

    setMyFavItemIds(newMyFavItemIds);
}

const toggleShareAsMyFav = (itemId:string, isAddingToMyFav:boolean): Promise<ShareOperationResponse>=>{

    const { agolHost, favGroupId, token } = portalData;

    const operation = isAddingToMyFav ? 'share' : 'unshare';

    const requestUrl = `${agolHost}/sharing/rest/content/items/${itemId}/${operation}`;

    const bodyFormData = new FormData();
    bodyFormData.append('groups', favGroupId);
    bodyFormData.append('items', itemId);
    bodyFormData.append('token', token);
    bodyFormData.append('f', 'json');

    // console.log(bodyFormData);

    return new Promise((resolve, reject) => {
        axios.post(requestUrl, bodyFormData)
        .then((response)=>{
            // console.log(response);
            resolve(response.data);
        })
        .catch(err => {
            console.error(err);
            reject(err);
        });
    });
};

export const getMyFavItemIds = async()=>{

    let myFavItemIds: string[] = [];

    if(!portalData.favGroupId && !portalData.token){
        return myFavItemIds;
    }
    
    try {
        const myFavItems = await getMyFavItems();

        myFavItemIds = myFavItems.map(d=>{
            return d.id;
        });

        // there could be item in the localstorage that still needs to be share to the fav group,
        // this could be caused by tring to add item to fav group anomanonsly. 
        // so we need to make sure this item is shared to fav and add the id to myFavItemIds
        const idForUnsavedItem = await addUnSavedItemToMyFav();

        if(idForUnsavedItem){
            myFavItemIds.push(idForUnsavedItem);
        }

    } catch(err){
        // console.log('my fav items not found');
        console.log(err);
    }

    setMyFavItemIds(myFavItemIds);

    return myFavItemIds;
};

export const toggleAsMyFavItem = (itemId:string): Promise<string[]>=>{

    const isInMyFavItems = myFavItemIds.indexOf(itemId) > -1 ? true : false;

    return new Promise(async(resolve, reject)=>{

        try {
                
            if(isInMyFavItems){
                const removeFromMyFavGroupRes = await removeFromMyFavGroup(itemId);
                // console.log('removeFromMyFavGroupRes', removeFromMyFavGroupRes)
            } else {
                const addToMyFavGroupRes = await addToMyFavGroup(itemId);
                // console.log('addToMyFavGroupRes', addToMyFavGroupRes)
            }
    
            toggleMyFavItemIds(itemId);

            resolve(myFavItemIds);
            
        } catch(err){
            // console.log(err);
            reject(err);
        }

    });

};

export const setPortalData4MyFavItems = ({
    agolHost = 'https://www.arcgis.com',
    favGroupId = '',
    token = ''
}={})=>{
    portalData.agolHost = agolHost;
    portalData.favGroupId = favGroupId;
    portalData.token = token;
};