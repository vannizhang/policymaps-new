import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { 
    PageLayout, 
    IssuesPageContents
} from '../../components'

import SiteWrapper from '../SiteWrapper/SiteWrapper';

import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

const IssuesPage:React.FC = ()=>{
    
    return (
        <SiteWrapper>
            <PageLayout>
                <IssuesPageContents />
            </PageLayout>
        </SiteWrapper>
    );
};

root.render(
    <IssuesPage />
);
