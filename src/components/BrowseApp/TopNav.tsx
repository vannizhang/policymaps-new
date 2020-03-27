import * as React from 'react';

import ActiveMapSwitcher from './ActiveMapSwitcher';
import ShareDialog from './ShareDialog';

import {
    SearchWidgetContainerId
} from '../SearchWidget/SearchWidget';

interface Props {
}

const Config = {
    top: 15,
    right: 20,
    left: 65,
    height: 63
};

const TopNav:React.FC<Props> = ({
    children
})=>{

    const [ isShareDialogVisible, setIsShareDialogVisible ] = React.useState<boolean>(true);

    const toggleShareDialog = ()=>{
        setIsShareDialogVisible(!isShareDialogVisible);
    }

    return (
        <>        
            <div
                style={{
                    'position': 'absolute',
                    'top': Config.top,
                    'right': Config.right,
                    'left': Config.left,
                    'height': Config.height,
                    'padding': '0 .75rem',
                    'display': 'flex',
                    'justifyContent': 'flex-start',
                    'alignContent': 'strech',
                    'alignItems': 'center',
                    'background': '#fff',
                    'boxShadow': '0 2px 6px rgba(0, 0, 0, 0.2)',
                    'boxSizing': 'border-box',
                    'zIndex': 5
                }}
            >
                <div 
                    style={{
                        'display': 'flex',
                        'alignItems': 'center',
                        'cursor': 'pointer'
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16"><path d="M14 4H2V3h12zM2 9h12V8H2zm0 5h12v-1H2z"/><path fill="none" d="M0 0h16v16H0z"/></svg>
                </div>

                <div
                    id={SearchWidgetContainerId}
                    style={{
                        'width': '220px',
                        'height': '100%',
                        'padding': '0 .75rem 0 .5rem',
                        'boxSizing': 'border-box',
                        'borderRight': '1px solid #efefef'
                    }}
                ></div>

                <ActiveMapSwitcher/>

                {/* // toggle share dialog */}
                <div 
                    style={{
                        'display': 'flex',
                        'alignItems': 'center',
                        'height': '100%',
                        'paddingLeft': '.75rem',
                        'borderLeft': '1px solid #efefef',
                        'cursor': 'pointer'
                    }}
                    onClick={toggleShareDialog}
                >
                    <span className='avenir-demi margin-right-half'>Share</span>
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16">
                        <path d="M1 1h8v1H2v12h12V9h1v6H1zm5.02 7.521V11H7V8.521A3.54 3.54 0 0 1 10.52 5h2.752l-1.626 1.646.707.707 2.81-2.809-2.81-2.809-.706.707 1.579 1.579H10.52a4.505 4.505 0 0 0-4.5 4.5z"/><path fill="none" d="M0 0h16v16H0z"/>
                    </svg>
                </div>
            </div>
            
            {
                isShareDialogVisible ? (
                    <div
                        style={{
                            'position': 'absolute',
                            'top': Config.top + Config.height,
                            'right': Config.right,
                            'zIndex': 5
                        }}
                    >
                        <ShareDialog 
                            onClose={toggleShareDialog}
                        />
                    </div>
                ) : null
            }

        </>
    );
};

export default TopNav;