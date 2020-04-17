import * as React from 'react';

import { loadModules, loadCss } from 'esri-loader';

import {
    NavBtn
} from '../';

import backgroundImg from '../../statics/img/OverviewPage/TopicsExplorerBackground.jpg';

// interface Props {
// };

import ISearchWidget from 'esri/widgets/Search';

const TopicsExplorer:React.FC = ({

})=>{

    const searchContainerRef = React.useRef<HTMLDivElement>();

    const [ index4ActiveTopic, setIndex4ActiveTopic ] = React.useState<number>(0);

    const initSearchWidget = async()=>{

        type Modules = [typeof ISearchWidget];

        const [ Search ] = await (loadModules([
            'esri/widgets/Search'
        ]) as Promise<Modules>);

        const searchWidget = new Search({
            container: searchContainerRef.current
        })

    };

    const getExplorer = ()=>{
        return (
            <div
                style={{
                    'display': 'flex',
                    'alignItems': 'center'
                }}
            >
                <div className='tablet-hide'>
                    <NavBtn 
                        direction='left'
                        solidBackground={true}
                    />
                </div>

                <div
                    className='padding-leader-4 padding-trailer-3 padding-left-4 padding-right-4 tablet-padding-left-1 tablet-padding-right-1'
                    style={{
                        'margin': '0 1.5rem',
                        // 'padding': '4rem 6rem',
                        'flexGrow': 1,
                        'background': '#fff',
                        'boxShadow': '1px 1px 4px 1px rgba(40, 40, 40, 0.7)',
                        'boxSizing': 'border-box'
                    }}
                >
                    <div>
                        <h3 className="avenir-demi trailer-1 text-center">
                            How is <span className="is-highlight">transit</span> helping my community with <span className="is-highlight">access to jobs</span>?
                        </h3>

                        <div 
                            className='leader-2 trailer-1' 
                            style={{
                                'width': '100%',
                                'border': '1px solid #efefef'
                            }}
                            ref={searchContainerRef}
                        ></div>

                        <div className='btn btn-large btn-fill'>
                            Explore Your Community
                        </div>
                    </div>
                </div>

                <div className='tablet-hide'>
                    <NavBtn 
                        direction='right'
                        solidBackground={true}
                    />
                </div>
            </div>
        );
    };
    
    const getNavDots = ()=>{

        return (
            <div></div>
        );
    };

    React.useEffect(()=>{
        loadCss();
        initSearchWidget();
    }, []);

    return (
        <div
            style={{
                'padding': '10rem 0',
                'backgroundImage': `url(${backgroundImg})`,
                'backgroundSize': 'cover',
                'backgroundRepeat': 'no-repeat',
                'backgroundPositionX': 'center',
                'backgroundPositionY': 'center',
            }}
        >
            <div className='grid-container'>
                <div className='column-14 tablet-column-12 center-column'>
                    { getExplorer() }
                </div>

                <div className='column-12 tablet-column-12 center-column'>
                    { getNavDots() }
                </div>
            </div>
        </div>
    );
};

export default TopicsExplorer;