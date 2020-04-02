import * as React from 'react';

import { 
    BrowseAppContext 
} from '../../contexts/BrowseAppProvider';

interface Props {
    onClose?: ()=>void; 
}

const ShareDialog:React.FC<Props> = ({
    onClose
})=>{

    const { currentUrl } = React.useContext(BrowseAppContext);

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
                    <button className="btn btn-small" style={{
                        height: '2rem',
                        background: '#005e95',
                        border: '1px solid #005e95'
                    }}>Copy</button>
                </span>

            </div>

            <div className='leader-half' style={{
                'display': 'flex',
                'alignItems': 'center'
            }}>
                <div>
                    <span className="icon-social-contact" aria-label="email"></span>
                    <span className="icon-social-twitter margin-left-quarter" aria-label="twitter"></span>
                    <span className="icon-social-facebook margin-left-quarter" aria-label="facebook"></span>
                </div>


                <div style={{
                    'flexGrow': 1,
                    'flexShrink': 0,
                    'textAlign': 'right',
                    'paddingRight': '.5rem'
                }}>
                    <span className="font-size--2 text-white" style={{ 'cursor': 'pointer' }}>Add collections to Favorites</span>
                </div>
                
            </div>
        </div>
    );
};

export default ShareDialog;