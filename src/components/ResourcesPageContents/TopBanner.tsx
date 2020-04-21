import * as React from 'react';

const TopBanner:React.FC = ()=>{

    return (
        <div
            style={{
                'padding': '4rem',
                'background': 'linear-gradient(to right bottom, #004874 0%, #572561 100%)'
            }}
        >
            <div className='grid-container'>
                <div className='column-12 center-column text-center text-white'>
                    <h2 className="trailer-1">Get the Most Out of the Policy Maps</h2>
                    <div 
                        style={{
                            'height': '3px',
                            'width': '60px',
                            'backgroundColor': '#56a5d8',
                            'margin': '0 auto 20px'
                        }}
                    ></div>
                    <p className="leader-2">To maximize your experience with the Policy Maps, we’ve assembled education, training, best practices, and industry perspectives that help raise your data literacy, provide you with models, and connect you with the work of your peers.</p>
                </div>
            </div>
        </div>
    )
};

export default React.memo(TopBanner);