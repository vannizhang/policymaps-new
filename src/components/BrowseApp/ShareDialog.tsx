import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
    BrowseAppContext 
} from '../../contexts/BrowseAppProvider';

import { 
    SiteContext 
} from '../../contexts/SiteContextProvider';

import {
    batchAdd
} from '../../utils/my-favorites/myFav';

import {
    itemCollectionSelector
} from '../../store/browseApp/reducers/itemCollections';

interface Props {
    onClose?: ()=>void; 
}

const ShareDialog:React.FC<Props> = ({
    onClose
})=>{

    const itemsCollection = useSelector(itemCollectionSelector);

    const textInputRef = React.useRef<HTMLInputElement>();

    const { currentUrl, setMyFavItems } = React.useContext(BrowseAppContext);

    const { esriOAuthUtils, isEmbedded } = React.useContext(SiteContext);

    const shareToSocialMedia = (name='')=>{
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

    const copyUrl = ()=>{
        textInputRef.current.select();
        // For mobile devices
        textInputRef.current.setSelectionRange(0, 99999); 
        document.execCommand("copy");
    };

    const addToMyFavBtnOnClick = async()=>{

        if(isEmbedded){
            window.open(window.location.href, '_blank');
            return;
        }

        try {
            const itemIds = itemsCollection.map(d=>d.id);
            const myFavItems = await batchAdd(itemIds);
            setMyFavItems(myFavItems);
        } catch(err){
            esriOAuthUtils.sigIn();
        }
    }

    return (
        <div
            style={{
                'width': '350px',
                'padding': '.75rem',
                'boxSizing': 'border-box',
                'background': '#0079c1',
                'border': '1px solid #005e95',
                'color': '#fff',
                'boxShadow': '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
        >
            <div className="trailer-half">
                <span className="font-size--2 avenir-demi">Share this collection</span>
                <span 
                    className="font-size--2 icon-ui-close right" 
                    style={{ 'cursor': 'pointer' }}
                    onClick={ onClose }
                ></span>
            </div>

            <div className="input-group">

                <input 
                    ref={textInputRef}
                    readOnly={true}
                    className="input-group-input" 
                    type="text" 
                    placeholder=""
                    value={currentUrl}
                    style={{
                        height: '2rem',
                        border: '1px solid transparent'
                    }}
                />

                <span className="input-group-button">
                    <button 
                        className="btn btn-small" 
                        style={{
                            height: '2rem',
                            background: '#005e95',
                            border: '1px solid #005e95'
                        }}
                        onClick={copyUrl}
                    >Copy</button>
                </span>

            </div>

            <div className='leader-half' style={{
                'display': 'flex',
                'alignItems': 'center'
            }}>
                <div>
                    <span className="icon-social-contact" aria-label="email" onClick={sendEmail}></span>
                    <span className="icon-social-twitter margin-left-quarter" aria-label="twitter" onClick={shareToSocialMedia.bind(this,'twitter')}></span>
                    <span className="icon-social-facebook margin-left-quarter" aria-label="facebook" onClick={shareToSocialMedia.bind(this,'facebook')}></span>
                </div>


                <div style={{
                    'flexGrow': 1,
                    'flexShrink': 0,
                    'textAlign': 'right',
                    'paddingRight': '.5rem'
                }}>
                    <span 
                        className="font-size--2 text-white" 
                        style={{ 
                            'cursor': 'pointer' 
                        }}
                        onClick={addToMyFavBtnOnClick}
                    >Add collections to Favorites</span>
                </div>
                
            </div>
        </div>
    );
};

export default ShareDialog;