import './style.scss';
import * as React from 'react';

import { 
    PageLayout,
    BrowseApp
} from '../../components'

import { 
    BrowseAppContextProvider
} from '../../contexts/BrowseAppProvider';

export default class BrowsePage extends React.PureComponent {

    render(){
        return (
            <PageLayout
                shouldHideEsriFooter={true}
            >
                <BrowseAppContextProvider
                    webmapId={'23a52f75191c4fc8b642945023511c11'}//{MapConfig.DEFAULT_WEBMAP_ID}
                    collections={[
                        '23a52f75191c4fc8b642945023511c11', 
                        '88f17b4580e846609f92c9f75a9d9eee',
                        '4f18bc402faa44f6a94dfff113b59d38'
                    ]}
                >
                    <BrowseApp />
                </BrowseAppContextProvider>
            </PageLayout>
        )
    }
};
