import './style.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

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

import SiteWrapper from '../SiteWrapper/SiteWrapper';

import store from '../../store/browseApp/configureStore';

const BrowsePage:React.FC = ()=> {

    const searchParams = decodeSearchParams();

    const hashParams = urlFns.parseHash();

    return (
        <SiteWrapper>
            <PageLayout
                shouldHideEsriFooter={true}
            >
                <Provider
                    store={store}
                >
                    <BrowseAppContextProvider
                        webmapId={ searchParams.activeWebmapId || MapConfig.DEFAULT_WEBMAP_ID }
                        collections={ searchParams.collections }
                        defaultLocation = { searchParams.location }
                        hideSideBarByDefault={ searchParams.isSideBarHide }
                    >
                        <BrowseApp />
                    </BrowseAppContextProvider>

                </Provider>

            </PageLayout>
        </SiteWrapper>
    );
};

ReactDOM.render(
    <BrowsePage />, 
    document.getElementById('root')
);
