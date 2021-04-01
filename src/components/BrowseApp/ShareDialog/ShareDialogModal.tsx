import React from 'react'
import { BACKGROUND_COLOR, ShareDialogProps } from './ShareDialog';
import {
    CopyIcon, EmailIcon, TwitterIcon, FacebookIcon
} from './icons'

type ShareBtnContainerProps = {
    color?: string;
    icon: JSX.Element;
    onClick: ()=>void;
}

const ShareBtnContainer:React.FC<ShareBtnContainerProps> = ({
    color,
    icon,
    onClick
})=>{
    return(
        <div
            onClick={onClick}
            style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: color || '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '.5rem'
            }}
        >
            { icon }
        </div>
    )
}

const ShareDialogModal:React.FC<ShareDialogProps> = ({
    currentUrl,
    onClose,
    sendEmailOnClick,
    shareToSocialMediaOnClick
}) => {
    const copyUrl = React.useCallback(()=>{
        const copyText = document.createElement('textarea')
        copyText.value = currentUrl;
        document.body.appendChild(copyText);
        copyText.select();
        document.execCommand("copy");
        document.body.removeChild(copyText);
    }, [currentUrl]);

    return (
        <div className="js-modal modal-overlay is-active">
            <div 
                className="modal-content column-12" 
                role="dialog" 
                aria-labelledby="modal"
                style={{
                    background: BACKGROUND_COLOR,
                    color: '#fff'
                }}
            >
                <div
                    className='text-right'
                    onClick={onClose}
                >
                    <svg height="32" width="32" viewBox="0 0 32 32" fill='#fff'>
                        <path d="M23.985 8.722L16.707 16l7.278 7.278-.707.707L16 16.707l-7.278 7.278-.707-.707L15.293 16 8.015 8.722l.707-.707L16 15.293l7.278-7.278z"/><path fill="none" d="M0 0h32v32H0z"/>
                    </svg>
                </div>

                {/* <div>
                    <p>Share this map</p>
                </div> */}

                <div

                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '1rem'
                    }}
                >

                    <ShareBtnContainer 
                        onClick={copyUrl}
                        icon={CopyIcon}
                    />

                    <ShareBtnContainer 
                        onClick={sendEmailOnClick}
                        icon={EmailIcon}
                    />

                    <ShareBtnContainer 
                        onClick={shareToSocialMediaOnClick.bind(this,'twitter')}
                        icon={TwitterIcon}
                    />

                    <ShareBtnContainer 
                        onClick={shareToSocialMediaOnClick.bind(this,'facebook')}
                        icon={FacebookIcon}
                    />
                    {/* <div></div>

                    <span className="icon-social-contact" onClick={copyUrl}></span>
                    <span className="icon-social-contact" aria-label="email" onClick={sendEmailOnClick}></span>
                    <span className="icon-social-twitter margin-left-quarter" aria-label="twitter" onClick={shareToSocialMediaOnClick.bind(this,'twitter')}></span>
                    <span className="icon-social-facebook margin-left-quarter" aria-label="facebook" onClick={shareToSocialMediaOnClick.bind(this,'facebook')}></span> */}
                </div>

            </div>
        </div>
    )
}

export default ShareDialogModal
