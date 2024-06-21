import './style.scss';
import * as React from 'react';
// import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { 
    PageLayout,
    BrowseApp
} from '../../components'

import SiteWrapper from '../SiteWrapper/SiteWrapper';

import configureStore, { getPreloadedState, PartialRootState } from '../../store/browseApp/configureStore';

import {
    setDefaultOptions,
    loadGroupCategorySchema,
} from '@vannizhang/arcgis-rest-helper';
import { Tier } from '../../AppConfig';
import { IGroupCategory } from '@esri/arcgis-rest-portal';
import { decodeSearchParams } from '../../utils/url-manager/BrowseAppUrlManager';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

const urlParamsData = decodeSearchParams()

const BrowsePage:React.FC = ()=>{

    const [preloadedState, setPreloadedState] = React.useState<PartialRootState>()

    const [categorySchema, setCategorySchema] = React.useState<IGroupCategory>()

    const init = async()=>{
        setDefaultOptions({
            groupId: Tier.PROD.AGOL_GROUP_ID,
        });
    
        const preloadedState = await getPreloadedState(urlParamsData)
    
        const categorySchemaJSON = await loadGroupCategorySchema();
    
        const categorySchema:IGroupCategory = categorySchemaJSON.categorySchema[0];
    
        // filter out 'Resources' category
        categorySchema.categories = categorySchema.categories.filter(item=>{
            return item.title !== 'Resources';
        });

        setPreloadedState(preloadedState)

        setCategorySchema(categorySchema)
    }

    React.useEffect(()=>{
        init()
    }, [])

    if(!preloadedState || !categorySchema){
        return null
    }

    return (
        <PageLayout
            shouldHideEsriFooter={true}
        >
            <Provider
                store={configureStore(preloadedState)}
            >
                <BrowseApp 
                    categorySchema={categorySchema}
                />
            </Provider>

        </PageLayout>
    )
}

const initBrowsePage = async () => {
    root.render(
        <SiteWrapper
            isEmbedded={urlParamsData.isEmbedded}
            isSearchDisabled={urlParamsData.isSearchDisabled}
        >
            <BrowsePage />
        </SiteWrapper>
    );
}

initBrowsePage();
