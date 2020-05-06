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
    activeWebmapSelector,
    centerLocationSelector
} from '../../../store/browseApp/reducers/map';

import {
    hideSideBarSelectore
} from '../../../store/browseApp/reducers/UI';

import {
    setMyFavItems
} from '../../../store/browseApp/reducers/myFavItems';

import {
    encodeSearchParams
} from '../../../utils/url-manager/BrowseAppUrlManager';

import ShareDialog from './ShareDialog';

export type SupportedSocialMedia = 'twitter' | 'facebook'

interface Props {
    onClose?: ()=>void; 
}

const ShareDialogContainer:React.FC<Props> = ({
    onClose
})=>{

    const dispatch = useDispatch();

    const itemsCollection = useSelector(itemCollectionSelector);

    const activeWebmap = useSelector(activeWebmapSelector);

    const centerLocation = useSelector(centerLocationSelector);

    const hideSidebar = useSelector(hideSideBarSelectore);

    const { esriOAuthUtils, isEmbedded } = React.useContext(SiteContext);

    const [ currentUrl, setCurrentUrl ] = React.useState<string>(window.location.href);

    const shareToSocialMedia = (name:SupportedSocialMedia)=>{
        const socialmediaLookUp = {
            'twitter': 'tw',
            'facebook': 'fb',
        };

        const socialMedia = socialmediaLookUp[name];

        const text = 'Policy maps for your consideration from esri policymaps site';

        const urlToOpen = `https://www.arcgis.com/home/socialnetwork.html?t=${text}&n=${socialMedia}&u=${currentUrl}&h=policymaps`;

        window.open(urlToOpen);
    };

    const sendEmail = ()=>{

        const emailSubjectText = 'Policy maps for your consideration';
        const emailBodyText = 'I was exploring Esri Policy Maps and found a collection of maps I wanted to share with you that might support your policy and legislative research';

        const shareLink = encodeURIComponent(currentUrl);
        const lineBreak = '%0D%0A';
        const myCollectionItemName = itemsCollection && itemsCollection.length ? itemsCollection.map(d=>d.title).join(lineBreak) : ''
        const body = `${emailBodyText}: ${lineBreak}${lineBreak}${myCollectionItemName}${lineBreak}${lineBreak}${shareLink}`;
        const emailLink = `mailto:${encodeURIComponent('')}?subject=${emailSubjectText}&body=${body}`;

        window.location.href = emailLink;
    };

    const addToMyFavBtnOnClick = async()=>{

        if(isEmbedded){
            window.open(window.location.href, '_blank');
            return;
        }

        try {
            const itemIds = itemsCollection.map(d=>d.id);
            const myFavItems = await batchAdd(itemIds);
            // setMyFavItems(myFavItems);
            dispatch(setMyFavItems(myFavItems));
        } catch(err){
            esriOAuthUtils.sigIn();
        }
    }

    React.useEffect(()=>{

        encodeSearchParams({
            activeWebmapId: activeWebmap ? activeWebmap.id : '',
            collections: itemsCollection && itemsCollection.length ? itemsCollection.map(d=>d.id) : [],
            location: centerLocation,
            isSideBarHide: hideSidebar
        });

        setCurrentUrl(window.location.href);
        
    }, [itemsCollection, activeWebmap, centerLocation, hideSidebar])

    return (
        <ShareDialog 
            currentUrl={currentUrl}
            onClose={onClose}
            addToMyFavBtnOnClick={addToMyFavBtnOnClick}
            sendEmailOnClick={sendEmail}
            shareToSocialMediaOnClick={shareToSocialMedia}
        />
    );
};

export default ShareDialogContainer;