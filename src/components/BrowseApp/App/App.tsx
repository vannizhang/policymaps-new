import * as React from 'react';

import {
    SiteContext
} from '../../../contexts/SiteContextProvider';

import CardList from '../CardList/CardListContainer';
import SideBar from '../SideBar';
import TopNav from '../TopNav';
import CategoryFilter, { SelectedCategory } from '../CategoryFilter';
import MyCollection from '../MyCollection/MyCollection';
import MapView from '../MapView/MapViewContainer';

import { 
    SearchWidget,
    LegendWidget,
    SearchAutoComplete
} from '../../index';

import { 
    Tier
} from '../../../AppConfig';

import {
    UIConfig
} from '../Config';

import {
    AgolItem
} from '../../../utils/arcgis-online-item-formatter';

import { 
    CategorySchemaDataItem
} from '../../../utils/category-schema-manager';

interface Props {
    // this site can also be embbeded in an iframe with search and search results hide if the "disableSearch" hash param is true
    disableSearch?: boolean
    searchResults: AgolItem[];
    searchResultsCount: number;
    categorySchema: CategorySchemaDataItem;

    sidebarScrolledToEnd?: ()=>void
    categoryFilterOnChange?: (data:SelectedCategory)=>void;
    searchAutoCompleteOnChange?: (searchTerm:string)=>void
}

const BrowseApp:React.FC<Props>= ({
    disableSearch,
    searchResults,
    searchResultsCount,
    categorySchema,

    sidebarScrolledToEnd,
    categoryFilterOnChange,
    searchAutoCompleteOnChange
})=>{

    console.log('render browse app')

    const { isEmbedded } = React.useContext(SiteContext);
    const [ isCategoryFilterVisible, setIsCategoryFilterVisible ] = React.useState<boolean>(true);
    const [ isLegendVisible, setIsLegendVisible ] = React.useState<boolean>(true);

    const toggleCategoryFilter = ()=>{
        setIsCategoryFilterVisible(!isCategoryFilterVisible);
    };

    const toggleLegend = ()=>{
        setIsLegendVisible(!isLegendVisible);
    };

    const getFilters = ()=>{
        if(disableSearch){
            return null;
        }

        const searchAutoComplete = (
            <div
                style={{
                    'display': 'flex',
                    'alignContent': 'strech',
                    'alignItems': 'strech',
                    'border': '2px solid #efefef',
                    'boxSizing': 'border-box'
                }}    
            >
                <div
                    style={{
                        'flexGrow': 1,
                        'flexShrink': 0,
                        'paddingLeft': '0.5rem'
                    }}
                >
                    <SearchAutoComplete 
                        groupId={Tier.PROD.AGOL_GROUP_ID }
                        onSelect={searchAutoCompleteOnChange}
                        placeholder={'Search and Filter Datasets'}
                        filters={'type:"web map"'}
                    />
                </div>

                <div
                    className='icon-right-padding-0'
                    style={{
                        'width': '50px',
                        'borderLeft': '1px solid #efefef',
                        'display': 'flex',
                        'alignItems': 'center',
                        'justifyContent': 'center',
                        'cursor': 'pointer'
                    }}    
                    onClick={toggleCategoryFilter}
                >
                    {
                        <span className={`text-blue font-size-1 ${ isCategoryFilterVisible ? 'icon-ui-up': 'icon-ui-down'}`}></span>
                    }
                </div>
            </div>
        );

        const categoryFilter = (
            <div
                style={{
                    'display': isCategoryFilterVisible ? 'block' : 'none'
                }}
            >
                <CategoryFilter 
                    categorySchema={categorySchema}
                    onChange={categoryFilterOnChange}
                />
            </div>
        );

        return (
            <div className='trailer-half'>
                { searchAutoComplete }
                { categoryFilter }
            </div>
        );
    };

    const getSearchResultsList = ()=>{

        if(disableSearch){
            return null;
        }

        return (
            <CardList 
                title={'Search Results'}
                data={searchResults}
                itemCount={searchResultsCount}
            />
        )
    }

    return (
        <div style={{
            "position": "absolute",
            "top": isEmbedded ? '0': "117px",
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
                scrollToBottomHandler={sidebarScrolledToEnd}
            >
                { getFilters() }

                <MyCollection />

                { getSearchResultsList() }

            </SideBar>

            <div style={{
                "position": "relative",
                "flexGrow": 1
            }}>
                <TopNav
                    isLegendVisible={isLegendVisible}
                    toggleLegend={toggleLegend}
                />

                <MapView>
                    <SearchWidget/>
                    <LegendWidget 
                        isVisible={isLegendVisible}
                    />
                </MapView>
            </div>

        </div>

    );
};

export default BrowseApp;