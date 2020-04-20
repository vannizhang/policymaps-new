import * as React from 'react';

import { 
    PageLayout,
    ResourcesPageContents
} from '../../components'

export default class ResourcesPage extends React.PureComponent {

    render(){
        return (
            <PageLayout>
                <ResourcesPageContents />
            </PageLayout>
        )
    }
};
