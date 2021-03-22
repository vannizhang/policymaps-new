import React from 'react';
import TopBannerBackgroundImage from '../../statics/img/ResourcesPage/TopBanner.png';

const TopBanner:React.FC = ()=>{

    return (
        <div
            style={{
                'position': 'relative',
                'padding': '4rem',
                'background': `url(${TopBannerBackgroundImage})` //'linear-gradient(to right bottom, #004874 0%, #572561 100%)'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,.25)'
                }}
            ></div>

            <div 
                className='grid-container'
                style={{
                    position: 'relative',
                    textShadow: '0px 0px 3px #000'
                }}
            >
                <div className='column-12 tablet-column-12 center-column text-center text-white'>
                    <h2 className="trailer-1">Get the Most Out of the Policy Maps</h2>
                    <div 
                        style={{
                            'height': '3px',
                            'width': '60px',
                            'backgroundColor': '#fff',
                            'margin': '0 auto 10px'
                        }}
                    ></div>
                    <p className="leader-2">To maximize your experience with the Policy Maps, we’ve assembled education, training, best practices, and industry perspectives that help raise your data literacy, provide you with models, and connect you with the work of your peers.</p>
                </div>
            </div>
        </div>
    )
};

export default React.memo(TopBanner);