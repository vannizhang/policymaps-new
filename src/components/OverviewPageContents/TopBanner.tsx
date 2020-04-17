import * as React from 'react';

import TopBannerBackgroundImg from '../../statics/img/OverviewPage/banner.jpg';

const TopBanner:React.FC = ()=>{

    return (
        <div
            style={{
                'padding': '6rem 0',
                'backgroundImage': `url(${TopBannerBackgroundImg})`,
                'backgroundSize': 'cover',
                'backgroundRepeat': 'no-repeat',
                'backgroundPositionX': 'center',
                'backgroundPositionY': 'center',
            }}
        >
            <div className='grid-container'>
                <div
                    className='column-14 center-column text-center'
                    style={{
                        'padding': '35px 50px',
                        'color': '#fff',
                        'backgroundColor': 'rgba(0, 0, 0, 0.7)'
                    }}
                >
                    <h1 className="sub-nav-title trailer-1">Maps for Data-Driven Policy</h1>

                    <div
                        style={{
                            'height': '3px',
                            'width': '60px',
                            'backgroundColor': '#fff',
                            'margin': '0 auto 25px'
                        }}
                    ></div>

                    <h5 className='trailer-1'>Policy maps clearly show where there are opportunities to intervene.</h5>

                    <h5 className="avenir-light">This site is dedicated to raising the level of spatial and data literacy used in public policy. We invite you to explore curated content, training, best practices, and datasets that can provide a baseline for your research, analysis, and policy recommendations.</h5>

                </div>
            </div>

        </div>
    );
};

export default TopBanner;