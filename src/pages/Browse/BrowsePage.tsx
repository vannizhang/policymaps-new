import './style.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { 
    PageLayout,
    BrowseApp
} from '../../components'

import SiteWrapper from '../SiteWrapper/SiteWrapper';

import store from '../../store/browseApp/configureStore';

const BrowsePage:React.FC = ()=> {

    return (
        <SiteWrapper>
            <PageLayout
                shouldHideEsriFooter={true}
            >
                <Provider
                    store={store}
                >
                    <BrowseApp />

                </Provider>

            </PageLayout>
        </SiteWrapper>
    );
};

ReactDOM.render(
    <BrowsePage />, 
    document.getElementById('root')
);
