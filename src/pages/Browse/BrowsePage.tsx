import * as React from 'react';

import { 
    PageLayout,
    BrowseApp
} from '../../components'

export default class BrowsePage extends React.PureComponent {

    render(){
        return (
            <PageLayout>
                <BrowseApp />
            </PageLayout>
        )
    }
};
