import React from 'react'
import { BACKGROUND_COLOR, ShareDialogProps } from './ShareDialog';
import {
    CopyIcon, EmailIcon, TwitterIcon, FacebookIcon
} from './icons'

type Props = ShareDialogProps & {
    title?: string;
}

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
            className='btn'
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

const ShareDialogModal:React.FC<Props> = ({
    currentUrl,
    title,
    onClose,
    sendEmailOnClick,
    shareToSocialMediaOnClick
}) => {

    const [ showCopiedMessage, setShowCopiedMessage ] = React.useState<boolean>(false);

    const copyUrl = React.useCallback(()=>{
        const copyText = document.createElement('textarea')
        copyText.value = currentUrl;
        document.body.appendChild(copyText);
        copyText.select();
        document.execCommand("copy");
        document.body.removeChild(copyText);

        setShowCopiedMessage(true);
    }, [currentUrl]);

    React.useEffect(()=>{
        if(showCopiedMessage){
            setTimeout(()=>{
                setShowCopiedMessage(false);
            }, 2000)
        }
    }, [showCopiedMessage])

    return (
        <div className="js-modal modal-overlay is-active">
            <div 
                className="modal-content column-6" 
                role="dialog" 
                aria-labelledby="modal"
                style={{
                    background: BACKGROUND_COLOR,
                    color: '#fff'
                }}
            >
                <div
                    className='text-right cursor-pointer'
                    onClick={onClose}
                >
                    <svg height="32" width="32" viewBox="0 0 32 32" fill='#fff'>
                        <path d="M23.985 8.722L16.707 16l7.278 7.278-.707.707L16 16.707l-7.278 7.278-.707-.707L15.293 16 8.015 8.722l.707-.707L16 15.293l7.278-7.278z"/><path fill="none" d="M0 0h32v32H0z"/>
                    </svg>
                </div>

                <div className='text-center'>
                    <p className='trailer-half font-size-1 avenir-light'>{showCopiedMessage ? 'Link copied!' : title}</p>
                </div>

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

                    {
                        sendEmailOnClick && (
                            <ShareBtnContainer 
                                onClick={sendEmailOnClick}
                                icon={EmailIcon}
                            />
                        )
                    }

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

                {/* {
                    showCopiedMessage ? (
                        <div className='text-center'>
                            <p className='font-size--1'>link copied!</p>
                        </div>
                    ) : null
                } */}

            </div>
        </div>
    )
}

export default ShareDialogModal
