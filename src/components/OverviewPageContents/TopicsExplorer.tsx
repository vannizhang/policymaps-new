import './TopicsExplorer.scss';
import * as React from 'react';
import axios from 'axios';

import { loadModules, loadCss } from 'esri-loader';

import { urlFns } from 'helper-toolkit-ts';

import {
    NavBtn
} from '../';

import backgroundImg from '../../statics/img/OverviewPage/TopicsExplorerBackground.jpg';

import ISearchWidget from 'esri/widgets/Search';
import { SiteContext } from '../../contexts/SiteContextProvider';

interface HighlightedTopic {
    title: string;
    tooltip: string;
    value: string;
};

interface HighlightedTopicsJSON {
    topics: HighlightedTopic[]
};

interface CustomLocation {
    latitude: number;
    longitude: number;
}

const TopicsExplorer:React.FC = ()=>{

    const { isMobile } = React.useContext(SiteContext)

    // let autoRotateInterval:NodeJS.Timeout = null;

    const searchContainerRef = React.useRef<HTMLDivElement>();

    const [ index4ActiveTopic, setIndex4ActiveTopic ] = React.useState<number>(0);

    const [ highlightedTopics, setHighlightedTopics ] = React.useState<HighlightedTopic[]>([]);

    const [ customLocation, setCustomLocation ] = React.useState<CustomLocation>();

    const loadHighlightedTopicsJSON = async()=>{

        try {
            const now = new Date().getTime()
            const res = await axios.get(`/media/policymaps/HighlightedTopics.json?${now}`) ;
            const data:HighlightedTopicsJSON = res.data;
            setHighlightedTopics(data.topics);
        } catch(err){
            console.error(err);
        }
    };

    const initSearchWidget = async()=>{

        type Modules = [typeof ISearchWidget];

        const [ Search ] = await (loadModules([
            'esri/widgets/Search'
        ]) as Promise<Modules>);

        const searchWidget = new Search({
            container: searchContainerRef.current,
            maxSuggestions: 5
        });

        searchWidget.on('search-complete', (evt)=>{
            const { results } = evt;
            // console.log(evt);
            // console.log(results[0], results[0].results[0])

            if(results[0] && results[0].results[0]){
                const geometry = results[0].results[0].feature.geometry.toJSON();
                const { x, y } = geometry;
                setCustomLocation({
                    longitude: x, 
                    latitude: y
                });
            }
        });
    };

    const explorerBtnOnClick = ()=>{
        const activeTopic = highlightedTopics[index4ActiveTopic];
        let searchParams = activeTopic.value;

        // console.log(customLocation)

        if(customLocation){
            searchParams = urlFns.updateKeyValuePairInQueryString({
                queryString: searchParams,
                key: 'loc',
                value: `${customLocation.longitude},${customLocation.latitude},10`,
            });


        }

        const targetUrl = `../browse/?${searchParams}`;
        window.open(targetUrl);
    };

    const showNextTopic = ()=>{
        const newIdx = index4ActiveTopic + 1 < highlightedTopics.length ? index4ActiveTopic + 1 : 0;
        setIndex4ActiveTopic(newIdx);
    };

    const showPrevTopic = ()=>{
        const newIdx = index4ActiveTopic - 1 >= 0 ? index4ActiveTopic - 1 : highlightedTopics.length - 1;
        setIndex4ActiveTopic(newIdx);
    };

    const getExplorer = ()=>{

        const activeTopicData = highlightedTopics[index4ActiveTopic];

        return (
            <div
                style={{
                    'display': 'flex',
                    'alignItems': 'center',
                    'justifyContent': 'center'
                }}
            >
                <div className='tablet-hide'>
                    <NavBtn 
                        direction='left'
                        solidBackground={true}
                        onClick={showPrevTopic}
                    />
                </div>

                <div
                    className=''
                    style={{
                        'margin': isMobile ? 0 : '0 2rem',
                        'padding': isMobile ? '2rem .5rem' : '4rem',
                        'flexGrow': 1,
                        'background': '#fff',
                        'boxShadow': '1px 1px 4px 1px rgba(40, 40, 40, 0.7)',
                        'boxSizing': 'border-box',
                        'maxWidth': '650px'
                    }}
                >
                    <div
                        className='padding-left-1 padding-right-1 tablet-padding-left-0 tablet-padding-right-0'
                    >
                        <h3 className="avenir-demi trailer-1 text-center">
                            <span dangerouslySetInnerHTML={{
                                __html: activeTopicData.title
                            }}></span>
                        </h3>

                        <div 
                            style={{
                                'width': '100%',
                                'border': '1px solid #ccc',
                                'marginTop': '2rem',
                                'marginBottom': '2rem'
                            }}
                            ref={searchContainerRef}
                        ></div>

                        <div className='btn btn-large btn-fill'
                            onClick={explorerBtnOnClick}
                        >
                            Explore Your Community
                        </div>
                    </div>
                </div>

                <div className='tablet-hide'>
                    <NavBtn 
                        direction='right'
                        solidBackground={true}
                        onClick={showNextTopic}
                    />
                </div>
            </div>
        );
    };
    
    const getNavDots = ()=>{

        const dots = highlightedTopics.map((d, i)=>{

            const { tooltip } = d;

            return (
                <div
                    key={`nav-dot-${i}`}
                    className='tooltip tooltip-top'
                    aria-label={tooltip}
                    style={{
                        'width': '12px',
                        'height': '12px',
                        'margin': '.35rem',
                        'borderRadius': '50%',
                        'cursor': 'pointer',
                        'backgroundColor': i === index4ActiveTopic 
                            ? '#56a5d8'
                            : 'rgba(255, 255, 255, 0.8)' 
                    }}
                    onClick={setIndex4ActiveTopic.bind(this, i)}
                ></div>
            )
        })

        return (
            <div
                style={{
                    'display': 'flex',
                    'justifyContent': 'center',
                    'alignContent': 'center',
                    'padding': '1rem 0'
                }}
            >
                { dots }
            </div>
        );
    };

    React.useEffect(()=>{
        loadCss();
        loadHighlightedTopicsJSON();
    }, []);

    React.useEffect(()=>{
        if(highlightedTopics.length){
            initSearchWidget();
        }
    }, [ highlightedTopics ]);

    return highlightedTopics.length ? (
        <div
            style={{
                'padding': '8rem 0',
                'backgroundImage': `url(${backgroundImg})`,
                'backgroundSize': 'cover',
                'backgroundRepeat': 'no-repeat',
                'backgroundPositionX': 'center',
                'backgroundPositionY': 'center',
            }}
        >
            <div className='grid-container'>
                <div className='column-24 tablet-column-12 center-column'>
                    { getExplorer() }
                </div>

                <div className='column-12 tablet-column-12 center-column leader-1'>
                    { getNavDots() }
                </div>
            </div>
        </div>
    ) : null;
};

export default TopicsExplorer;