import * as React from 'react';

import { getCategorySchema } from '../../utils/category-schema-manager';

import ArcGISOnlineGroupData, { SearchResponse, AgolItem } from '../../utils/arcgis-online-group-data';

import { Tier } from '../../AppConfig';

import CardList from './CardList';

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
            ? searchResponse.start
            : 1; 

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

            const items = ( searchResponse.start === 1 )
                ? searchResponse.results 
                : [ ...webMapItems, ...searchResponse.results ];

            setWebMapItems(items);

            // console.log(items);
        };

    }, [ searchResponse ]);

    return (
        <>
            <div className='side-nav'>
                <CardList 
                    data={webMapItems}
                />
            </div>
        </>
    );
};

export default BrowseApp;