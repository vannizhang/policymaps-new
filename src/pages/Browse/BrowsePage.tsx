import './style.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { 
    PageLayout,
    BrowseApp
} from '../../components'

import SiteWrapper from '../SiteWrapper/SiteWrapper';

import configureStore, { getPreloadedState } from '../../store/browseApp/configureStore';

import {
    setDefaultGroupOptions,
    loadGroupCategorySchema,
} from '@vannizhang/arcgis-rest-helper';
import { Tier } from '../../AppConfig';
import { IGroupCategory } from '@esri/arcgis-rest-portal';
import { decodeSearchParams } from '../../utils/url-manager/BrowseAppUrlManager';

const initPage = async () => {

    const urlParamsData = decodeSearchParams()

    const preloadedState = await getPreloadedState(urlParamsData)

    setDefaultGroupOptions({
        groupId: Tier.PROD.AGOL_GROUP_ID,
    });

    const categorySchemaJSON = await loadGroupCategorySchema();

    const categorySchema:IGroupCategory = categorySchemaJSON.categorySchema[0];

    // filter out 'Resources' category
    categorySchema.categories = categorySchema.categories.filter(item=>{
        return item.title !== 'Resources';
    });

    ReactDOM.render(
        <SiteWrapper
            isEmbedded={urlParamsData.isEmbedded}
            isSearchDisabled={urlParamsData.isSearchDisabled}
        >
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
        </SiteWrapper>, 
        document.getElementById('root')
    );
}

initPage();
