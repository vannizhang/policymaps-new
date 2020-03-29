import * as React from 'react';

import { 
    BrowseAppContext 
} from '../../contexts/BrowseAppProvider';

import CardList from './CardList';
import SideBar from './SideBar';
import TopNav from './TopNav';
import CategoryFilter, { SelectedCategory } from './CategoryFilter';

import { 
    MapView,
    SearchWidget,
    LegendWidget
} from '../index';

import { 
    Tier
} from '../../AppConfig';

import {
    UIConfig
} from './Config';

import {
    formatAsAgolItem,
    AgolItem
} from '../../utils/arcgis-online-item-formatter';

import { 
    getCategorySchema, 
    CategorySchemaDataItem
} from '../../utils/category-schema-manager';

import ArcGISOnlineGroupData, { 
    SearchResponse 
} from '../../utils/arcgis-online-group-data';

const BrowseApp:React.FC<{}>= ()=>{

    const { itemsCollection } = React.useContext(BrowseAppContext);

    const [ categorySchema, setCategorySchema ] = React.useState<CategorySchemaDataItem>();
    const [ agolGroupData, setAgolGroupData ] = React.useState<ArcGISOnlineGroupData>();
    const [ searchResponse, setSearchReponse ] = React.useState<SearchResponse>();
    const [ webMapItems, setWebMapItems ] = React.useState<AgolItem[]>([]);

    const initCategorySchema = async () =>{

        const categorySchemaRes = await getCategorySchema({ 
            agolGroupId: Tier.PROD.AGOL_GROUP_ID 
        });
        // console.log(categorySchemaRes);

        const categorySchema:CategorySchemaDataItem = categorySchemaRes[0];

        // filter out 'Resources' category
        categorySchema.categories = categorySchema.categories.filter(item=>{
            return item.title !== 'Resources';
        });

        setCategorySchema(categorySchema);
    }

    // init the module that will be used to query items from the Policy Maps group on ArcGIS online
    const initAgolGroupData = async ()=>{

        const arcGISOnlineGroupData = new ArcGISOnlineGroupData({
            groupId: Tier.PROD.AGOL_GROUP_ID,
            categorySchema,
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

    const categoryFilterOnChange = (data:SelectedCategory)=>{
        agolGroupData.updateSelectedCategory(data.title, data.subcategories);
        searchItems();
    };

    // fetch the category schema first
    React.useEffect(()=>{
        initCategorySchema();
    }, [])

    // once category schema is ready, init the AGOL Group Data module
    React.useEffect(()=>{
        if(categorySchema){
            initAgolGroupData();
        }
    }, [ categorySchema ]);

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
        <div style={{
            "position": "absolute",
            "top": "117px",
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
            <SideBar
                width={UIConfig["side-bar-width"]}
                scrollToBottomHandler={()=>{
                    searchItems({
                        searchNextSet: true
                    });
                }}
            >
                
                <CategoryFilter 
                    categorySchema={categorySchema}
                    onChange={categoryFilterOnChange}
                />

                <CardList 
                    title={'My collection of maps'}
                    data={itemsCollection}
                    itemCount={ itemsCollection ? itemsCollection.length : 0 }
                />

                <CardList 
                    title={'Search Results'}
                    data={webMapItems}
                    itemCount={ searchResponse ? searchResponse.total : 0 }
                />
            </SideBar>

            <div style={{
                "position": "relative",
                "flexGrow": 1,
                "flexShrink": 0,
                "flexBasis": "200px"
            }}>
                <TopNav />

                <MapView>
                    <SearchWidget/>
                    <LegendWidget/>
                </MapView>
            </div>

        </div>

    );
};

export default BrowseApp;