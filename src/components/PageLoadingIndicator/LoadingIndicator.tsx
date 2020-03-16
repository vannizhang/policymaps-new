import './style.scss';
import * as React from 'react';

const LoadingIndicator: React.FC = ()=>{
    return (
        <div className='loading-indicator-container'>
            <div className="loader is-active">
                <div className="loader-bars"></div>
                <div className="loader-text">Loading...</div>
            </div>
        </div>
    )
};

export default LoadingIndicator;