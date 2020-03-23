import * as React from 'react';

import { 
    BrowseAppContextProvider, 
    // BrowseAppContext 
} from '../../contexts/BrowseAppProvider';

import CardList from './CardList';

import { 
    MapView
} from '../index';

import { 
    Tier
} from '../../AppConfig';

import {
    MapConfig,
    UIConfig
} from './Config';

import {
    formatAsAgolItem,
    AgolItem
} from '../../utils/arcgis-online-item';

import { 
    getCategorySchema 
} from '../../utils/category-schema-manager';

import ArcGISOnlineGroupData, { 
    SearchResponse 
} from '../../utils/arcgis-online-group-data';

const BrowseApp:React.FC<{}>= ()=>{

    // let agolGroupData:ArcGISOnlineGroupData;

    const [ agolGroupData, setAgolGroupData ] = React.useState<ArcGISOnlineGroupData>();
    const [ searchResponse, setSearchReponse ] = React.useState<SearchResponse>();
    const [ webMapItems, setWebMapItems ] = React.useState<AgolItem[]>([]);

    const [ isSidebarHide, toggleSideBar ] = React.useState<boolean>();

    // init the module that will be used to query items from the Policy Maps group on ArcGIS online
    const initAgolGroupData = async ()=>{

        const categorySchemaRes = await getCategorySchema({ 
            agolGroupId: Tier.PROD.AGOL_GROUP_ID 
        });
        // console.log(categorySchemaRes);

        const arcGISOnlineGroupData = new ArcGISOnlineGroupData({
            groupId: Tier.PROD.AGOL_GROUP_ID,
            categorySchema: categorySchemaRes[0],
            queryParams: {
                contentType: 'webmap',
                sortField: 'modified'
            }
        });

        setAgolGroupData(arcGISOnlineGroupData);
    };

    // search items from the policy maps group
    const searchItems = async({
        num = 10,
        searchNextSet = false
    }={})=>{

        const start = ( searchNextSet && searchResponse ) 
            ? searchResponse.nextStart
            : 1; 
        
        if(searchNextSet && start === -1){
            console.error('no more items to load');
            return;
        }

        const response = await agolGroupData.search({
            start,
            num
        });
        console.log('search response', response);

        setSearchReponse(response);
    };

    React.useEffect(()=>{
        initAgolGroupData();
    }, []);

    // start searching policy maps items once agolGroupData is ready
    React.useEffect(()=>{
        if(agolGroupData){
            searchItems();
        }
    }, [ agolGroupData ]);

    // update webmap items after search response is updated
    React.useEffect(()=>{
    
        if(searchResponse){

            const { results } = searchResponse;

            results.forEach(item=>{
                item = formatAsAgolItem(item);
            });

            const items = ( searchResponse.start === 1 )
                ? results 
                : [ ...webMapItems, ...results ];

            setWebMapItems(items);

            // console.log(items);
        };

    }, [ searchResponse ]);

    return (
        <BrowseAppContextProvider
            webMapId={MapConfig.DEFAULT_WEBMAP_ID}
        >
            <div style={{
                "position": "absolute",
                "top": "118px",
                "left": "0",
                "bottom": "0",
                "width": "100%",
                "display": "flex",
                "flexDirection": "row",
                "flexWrap": "nowrap",
                "justifyContent": "flex-start",
                "alignContent": "stretch",
                "alignItems": "stretch"
            }}>
                <div className='side-bar' style={{
                    "display": !isSidebarHide ? "block" : "none",
                    "width": UIConfig["side-bar-width"],
                    "boxSizing": "border-box",
                    "padding": "1rem",
                    "overflowY": "auto",
                    "boxShadow": "0 2px 6px rgba(0,0,0,.24)"
                }}>
                    <div 
                        onClick={()=>{
                            searchItems({
                                searchNextSet: true
                            });
                        }}
                    >click to load more</div>

                    <CardList 
                        title={'Search Results'}
                        data={webMapItems}
                        itemCount={ searchResponse ? searchResponse.total : 0 }
                    />

                </div>

                <div style={{
                    "position": "relative",
                    "flexGrow": 1,
                    "flexShrink": 0,
                    "flexBasis": "200px"
                }}>
                    <MapView 
                        // webmapId={MapConfig.DEFAULT_WEBMAP_ID}
                    />
                </div>

            </div>
    
        </BrowseAppContextProvider>

    );
};

export default BrowseApp;