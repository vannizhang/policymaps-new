import './style.scss';
import * as React from 'react';

import { 
    PageLayout,
    BrowseApp
} from '../../components'

import { 
    BrowseAppContextProvider
} from '../../contexts/BrowseAppProvider';

import {
    decodeSearchParams
} from '../../utils/url-manager/BrowseAppUrlManager';

import { 
    MapConfig 
} from '../../components/BrowseApp/Config';

const BrowsePage:React.FC = ()=> {

    const searchParams = decodeSearchParams();

    return (
        <PageLayout
            shouldHideEsriFooter={true}
        >
            <BrowseAppContextProvider
                webmapId={ searchParams.activeWebmapId || MapConfig.DEFAULT_WEBMAP_ID }
                collections={ searchParams.collections }
                defaultLocation = { searchParams.location }
                hideSideBarByDefault={ searchParams.isSideBarHide }
            >
                <BrowseApp />
            </BrowseAppContextProvider>
        </PageLayout>
    );
};

export default BrowsePage;
