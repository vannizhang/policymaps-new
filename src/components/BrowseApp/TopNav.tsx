import * as React from 'react';
import { useSelector } from 'react-redux';

import ActiveMapSwitcher from './ActiveMapSwitcher/ActiveMapSwitcherContainer';
import ShareDialog from './ShareDialog/ShareDialogContainer';
import Menu from './Menu';

import {
    SearchWidgetContainerId
} from '../SearchWidget/SearchWidget';

import {
    hideSideBarSelectore
} from '../../store/browseApp/reducers/UI';

const Config = {
    top: 15,
    right: 20,
    left: 65,
    height: 63
};

const TopNav:React.FC = ()=>{

    const containerRef = React.useRef<HTMLDivElement>();

    const hideSideBar = useSelector(hideSideBarSelectore);

    const [ isMinimal, setIsMinimal ] = React.useState<boolean>(false);

    const [ showTitleOnly, setShowTitleOnly ] = React.useState<boolean>(false);

    const [ isShareDialogVisible, setIsShareDialogVisible ] = React.useState<boolean>(true);

    const toggleShareDialog = ()=>{
        setIsShareDialogVisible(!isShareDialogVisible);
    }

    const getToggleShareBtn = ()=>{

        return(
            <div 
                style={{
                    'display': 'flex',
                    'alignItems': 'center',
                    'height': '100%',
                    'paddingLeft': '.5rem',
                    'borderLeft': isMinimal ? 'none' : '1px solid #efefef',
                    'cursor': 'pointer'
                }}
                onClick={toggleShareDialog}
            >
                <span 
                    className='avenir-demi margin-right-half tablet-hide'
                    style={{
                        'display': !isMinimal ? 'inline-block' : 'none',
                    }}
                >
                        Share
                </span>

                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16">
                    <path d="M1 1h8v1H2v12h12V9h1v6H1zm5.02 7.521V11H7V8.521A3.54 3.54 0 0 1 10.52 5h2.752l-1.626 1.646.707.707 2.81-2.809-2.81-2.809-.706.707 1.579 1.579H10.52a4.505 4.505 0 0 0-4.5 4.5z"/><path fill="none" d="M0 0h16v16H0z"/>
                </svg>
            </div>
        )
    }

    const getTopNavContent = ()=>{

        return (
            <div
                style={{
                    'height': showTitleOnly ? 'auto' : '100%',
                    'position': 'relative',
                    'padding': showTitleOnly ? '.5rem' : '0 .75rem',
                    'display': 'flex',
                    // 'display': !isHide ? 'flex' : 'none',
                    'justifyContent': 'flex-start',
                    'alignContent': 'strech',
                    'alignItems': 'center',
                    'background': '#fff',
                    'boxShadow': '0 2px 6px rgba(0, 0, 0, 0.2)',
                    'boxSizing': 'border-box',
                    'zIndex': 5
                }}
            >
                {/* <div 
                    style={{
                        'display': 'flex',
                        'alignItems': 'center',
                        'cursor': 'pointer'
                    }}
                    onClick={toggleMenu}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16"><path d="M14 4H2V3h12zM2 9h12V8H2zm0 5h12v-1H2z"/><path fill="none" d="M0 0h16v16H0z"/></svg>
                </div> */}

                <div
                    id={SearchWidgetContainerId}
                    className='tablet-hide'
                    style={{
                        'display': !isMinimal ? 'flex' : 'none',
                        'width': '220px',
                        'height': '100%',
                        'padding': '0 .75rem 0 .5rem',
                        'boxSizing': 'border-box',
                        'borderRight': '1px solid #efefef'
                    }}
                ></div>

                <ActiveMapSwitcher
                    isMinimal={isMinimal}
                    showTitleOnly={showTitleOnly}
                />

                { getToggleShareBtn() }

            </div>
        );
    };

    const getShareDialog = ()=>{
        if(!isShareDialogVisible){
            return null;
        }

        return (
            <div
                style={{
                    'position': 'absolute',
                    'top': Config.height,
                    'right': 0,
                    'zIndex': 5
                }}
            >
                <ShareDialog 
                    onClose={toggleShareDialog}
                    showModal={showTitleOnly}
                />
            </div>
        )
    }

    const resizeHandler = ()=>{

        if(containerRef.current){
            const width = containerRef.current.offsetWidth;
            // console.log(width);

            setIsMinimal(width < 690);
            setShowTitleOnly(width < 480);
        }
    };

    React.useEffect(()=>{
        
        if(showTitleOnly){
            setIsShareDialogVisible(false);
        }
        
    }, [showTitleOnly]);

    React.useEffect(()=>{
        window.addEventListener('resize', resizeHandler);
    }, []);

    React.useEffect(()=>{
        resizeHandler();
    }, [ hideSideBar ])

    return (
        <div
            ref={containerRef}
            style={{
                'position': 'absolute',
                'top': Config.top,
                'right': Config.right,
                'left': Config.left,
                'height': Config.height,
            }}
        >        
            {
                getTopNavContent()
            }

            {
                getShareDialog()
            }

        </div>
    );
};

export default TopNav;