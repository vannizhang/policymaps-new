import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { PageLayout, OverviewPageContents } from '../../components'

import SiteWrapper from '../SiteWrapper/SiteWrapper';

const OverviewPage:React.FC = ()=>{
    return (
        <SiteWrapper>
            <PageLayout>
                <OverviewPageContents />
            </PageLayout>
        </SiteWrapper>
    );
};

ReactDOM.render(
    <OverviewPage />, 
    document.getElementById('root')
);