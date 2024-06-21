import * as React from 'react';
// import * as ReactDOM from 'react-dom';

import { 
    PageLayout,
    ResourcesPageContents
} from '../../components'

import SiteWrapper from '../SiteWrapper/SiteWrapper';

import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

const ResourcesPage:React.FC = ()=>{
    return (
        <SiteWrapper>
            <PageLayout>
                <ResourcesPageContents />
            </PageLayout>
        </SiteWrapper>
    );
};

root.render(
    <ResourcesPage />
);