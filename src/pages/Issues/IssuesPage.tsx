import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { 
    PageLayout, 
    IssuesPageContents
} from '../../components'

import SiteWrapper from '../SiteWrapper/SiteWrapper';

const IssuesPage:React.FC = ()=>{
    
    return (
        <SiteWrapper>
            <PageLayout>
                <IssuesPageContents />
            </PageLayout>
        </SiteWrapper>
    );
};

ReactDOM.render(
    <IssuesPage />, 
    document.getElementById('root')
);
