import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { 
    PageLayout,
    ResourcesPageContents
} from '../../components'

import SiteWrapper from '../SiteWrapper/SiteWrapper';

const ResourcesPage:React.FC = ()=>{
    return (
        <SiteWrapper>
            <PageLayout>
                <ResourcesPageContents />
            </PageLayout>
        </SiteWrapper>
    );
};

ReactDOM.render(
    <ResourcesPage />, 
    document.getElementById('root')
);