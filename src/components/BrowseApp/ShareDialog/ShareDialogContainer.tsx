import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
    SiteContext 
} from '../../../contexts/SiteContextProvider';

import {
    batchAdd
} from '../../../utils/my-favorites/myFav';

import {
    itemCollectionSelector
} from '../../../store/browseApp/reducers/itemCollections';

import {
    setMyFavItems
} from '../../../store/browseApp/reducers/myFavItems';

import ShareDialog from './ShareDialog';
import ShareDialogModal from './ShareDialogModal'
import { showAddCollections2MyFavDialogToggled } from '../../../store/browseApp/reducers/UI';

export type SupportedSocialMedia = 'twitter' | 'facebook'

interface Props {
    // if true, show modal window instead of floating panel
    // to get better UX in mobile device
    showModal: boolean;
    onClose?: ()=>void; 
}

export const shareToSocialMedia = (name:SupportedSocialMedia, text?:string)=>{
    const socialmediaLookUp = {
        'twitter': 'tw',
        'facebook': 'fb',
    };

    const socialMedia = socialmediaLookUp[name];

    text = text || 'Policy maps for your consideration from the Esri Maps for Public Policy site';

    const urlToOpen = `https://www.arcgis.com/home/socialnetwork.html?t=${text}&n=${socialMedia}&u=${window.location.href}&h=policymaps`;

    window.open(urlToOpen);
};


const ShareDialogContainer:React.FC<Props> = ({
    showModal,
    onClose
})=>{

    const dispatch = useDispatch();

    const itemsCollection = useSelector(itemCollectionSelector);

    const { isEmbedded } = React.useContext(SiteContext);

    const [ currentUrl, setCurrentUrl ] = React.useState<string>(window.location.href);

    const sendEmail = ()=>{

        const emailSubjectText = 'Policy maps for your consideration';
        
        const shareLink = encodeURIComponent(currentUrl);
        const lineBreak = '%0D%0A';
        const myCollectionItemName = itemsCollection && itemsCollection.length ? itemsCollection.map(d=>d.title).join(lineBreak) : ''

        const emailBodyText = itemsCollection && itemsCollection.length >= 2 
            ? 'I was exploring Esri Policy Maps and found a collection of maps I wanted to share with you that might support your policy and legislative research'
            : 'I was exploring Esri Policy Maps and found a map I wanted to share with you that might support your policy and legislative research';

        const body = myCollectionItemName 
            ? `${emailBodyText}: ${lineBreak}${myCollectionItemName}${lineBreak}${lineBreak}${shareLink}`
            : `${emailBodyText}: ${lineBreak}${shareLink}`
        const emailLink = `mailto:${encodeURIComponent('')}?subject=${emailSubjectText}&body=${body}`;

        window.location.href = emailLink;
    };

    const addToMyFavBtnOnClick = async()=>{

        if(isEmbedded){
            window.open(window.location.href, '_blank');
            return;
        }

        // open dialog to start adding items in my collections to my fav group 
        dispatch(showAddCollections2MyFavDialogToggled())

        // try {
        //     const itemIds = itemsCollection.map(d=>d.id);
        //     const myFavItems = await batchAdd(itemIds);
        //     // setMyFavItems(myFavItems);
        //     dispatch(setMyFavItems(myFavItems));
        // } catch(err){
        //     esriOAuthUtils.sigIn();
        // }
    }

    // React.useEffect(()=>{

    //     encodeSearchParams({
    //         activeWebmapId: activeWebmap ? activeWebmap.id : '',
    //         collections: itemsCollection && itemsCollection.length ? itemsCollection.map(d=>d.id) : [],
    //         location: centerLocation,
    //         // isSideBarHide: hideSidebar
    //     });
    // }, [itemsCollection, activeWebmap, centerLocation])

    React.useEffect(()=>{
        setCurrentUrl(window.location.href);
    }, [window.location.href])

    return showModal 
    ? (
        <ShareDialogModal 
            currentUrl={currentUrl}
            title='Share your collection of maps'
            onClose={onClose}
            sendEmailOnClick={sendEmail}
            shareToSocialMediaOnClick={shareToSocialMedia}
        />
    ) 
    : (
        <ShareDialog 
            currentUrl={currentUrl}
            onClose={onClose}
            shouldDisabledAddToMyFavBtn={itemsCollection.length === 0}
            addToMyFavBtnOnClick={addToMyFavBtnOnClick}
            sendEmailOnClick={sendEmail}
            shareToSocialMediaOnClick={shareToSocialMedia}
        />
    );
};

export default ShareDialogContainer;