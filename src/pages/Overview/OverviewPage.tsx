import * as React from 'react';
import { PageLayout, OverviewPageContents } from '../../components'
import SiteWrapper from '../SiteWrapper/SiteWrapper';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

const OverviewPage:React.FC = ()=>{
    return (
        <SiteWrapper>
            <PageLayout>
                <OverviewPageContents />
            </PageLayout>
        </SiteWrapper>
    );
};



root.render(
    <OverviewPage />
);