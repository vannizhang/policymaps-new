import './style.scss';
import * as React from 'react';

import { urlFns } from 'helper-toolkit-ts';

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

    const hashParams = urlFns.parseHash();

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
                <BrowseApp 
                    disableSearch={hashParams.disableSearch ? true : false}
                />
            </BrowseAppContextProvider>
        </PageLayout>
    );
};

export default BrowsePage;
