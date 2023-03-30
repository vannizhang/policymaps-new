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

const STORAGE_KEY_ADD_2_MY_FAV = 'itemToBeAddedToAgolFavGroup';

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

const addToMyFavGroup = (itemId=''): Promise<ShareOperationResponse>=>{

    const { favGroupId, token } = portalData;

    return new Promise(async(resolve, reject)=>{

        if(!favGroupId || !token){
            sessionStorage.setItem(STORAGE_KEY_ADD_2_MY_FAV, itemId);

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

const removeFromMyFavGroup = (itemId=''): Promise<ShareOperationResponse>=>{

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

const addUnsavedItemsToMyFav = async(): Promise<string[]>=>{

    const val = sessionStorage.getItem(STORAGE_KEY_ADD_2_MY_FAV);
    sessionStorage.removeItem(STORAGE_KEY_ADD_2_MY_FAV);

    if(!val){
        return []
    }

    const itemIds = val.split(',')

    try {

        const requests = itemIds.map(itemId=>toggleShareAsMyFav(itemId, true))

        await Promise.all(requests)

        return itemIds
    } catch(err){
        console.log(err);
    }

    return []
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

        // there could be item in the session storage that still needs to be share to the fav group,
        // this is caused by attempting to add item to my fav group anomanonsly. 
        // so we need to make sure this item is shared to fav and add the id to myFavItemIds
        const idsForUnsavedItem = await addUnsavedItemsToMyFav();

        if(idsForUnsavedItem){
            
            for(const id of idsForUnsavedItem){
                if(myFavItemIds.indexOf(id) === -1){
                    myFavItemIds.push(id);
                }
            }
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

export const batchAdd = (itemIds: string[]): Promise<string[]>=>{

    return new Promise(async(resolve, reject)=>{

        const { favGroupId, token } = portalData;

        if(!favGroupId || !token){
            sessionStorage.setItem(STORAGE_KEY_ADD_2_MY_FAV, itemIds.join(','));
            reject('favorite group id and token are required to remove fav item, please sign in first');
            return
        }

        try {

            for(let i = 0, len = itemIds.length; i < len; i++){
                const itemId = itemIds[i]
                const addToMyFavGroupRes = await addToMyFavGroup(itemId);
                toggleMyFavItemIds(itemId);
            }
    
            resolve(myFavItemIds);
        } catch(err){
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