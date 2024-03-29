import React from 'react';
import { SupportedSocialMedia } from './ShareDialogContainer';

export type ShareDialogProps = {
    currentUrl: string;
    shouldDisabledAddToMyFavBtn?: boolean;
    onClose?: ()=>void; 
    addToMyFavBtnOnClick?:()=>void;
    sendEmailOnClick?: ()=>void;
    shareToSocialMediaOnClick: (name:SupportedSocialMedia)=>void;
}

export const BACKGROUND_COLOR = '#0079c1';

const ShareDialog:React.FC<ShareDialogProps> = ({
    currentUrl,
    shouldDisabledAddToMyFavBtn=false,
    onClose,
    addToMyFavBtnOnClick,
    sendEmailOnClick,
    shareToSocialMediaOnClick
})=>{

    const textInputRef = React.useRef<HTMLInputElement>();

    const copyUrl = ()=>{
        textInputRef.current.select();
        // For mobile devices
        textInputRef.current.setSelectionRange(0, 99999); 
        document.execCommand("copy");
    };

    return (
        <div
            style={{
                'width': '350px',
                'padding': '.75rem',
                'boxSizing': 'border-box',
                'background': BACKGROUND_COLOR,
                'border': '1px solid #005e95',
                'color': '#fff',
                'boxShadow': '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
        >
            <div className="trailer-half">
                <span className="font-size--2 avenir-demi">Share this map collection</span>
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
                    <span className="icon-social-contact" aria-label="email" onClick={sendEmailOnClick}></span>
                    <span className="icon-social-twitter margin-left-quarter" aria-label="twitter" onClick={shareToSocialMediaOnClick.bind(this,'twitter', null)}></span>
                    <span className="icon-social-facebook margin-left-quarter" aria-label="facebook" onClick={shareToSocialMediaOnClick.bind(this,'facebook', null)}></span>
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
                            'cursor': shouldDisabledAddToMyFavBtn ? 'auto' :'pointer',
                            'opacity': shouldDisabledAddToMyFavBtn ? '.5' : '1'
                        }}
                        onClick={()=>{
                            if(shouldDisabledAddToMyFavBtn){
                                return;
                            }

                            addToMyFavBtnOnClick()
                        }}
                    >Add map collection to Favorites</span>
                </div>
                
            </div>
        </div>
    );
};

export default ShareDialog;