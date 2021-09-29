import './style.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { 
    PageLayout,
    BrowseApp
} from '../../components'

import SiteWrapper from '../SiteWrapper/SiteWrapper';

import configureStore, { getPreloadedState, PartialRootState } from '../../store/browseApp/configureStore';

type Props = {
    preloadedState: PartialRootState
}

const BrowsePage:React.FC<Props> = ({
    preloadedState
}: Props)=> {

    return (
        <SiteWrapper>
            <PageLayout
                shouldHideEsriFooter={true}
            >
                <Provider
                    store={configureStore(preloadedState)}
                >
                    <BrowseApp />

                </Provider>

            </PageLayout>
        </SiteWrapper>
    );
};

const initPage = async () => {

    const preloadedState = await getPreloadedState()

    ReactDOM.render(
        <BrowsePage 
            preloadedState={preloadedState}
        />, 
        document.getElementById('root')
    );
}

initPage();
