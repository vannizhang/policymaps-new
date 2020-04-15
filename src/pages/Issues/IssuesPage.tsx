import * as React from 'react';

import { 
    PageLayout, 
    IssuesApp
} from '../../components'

const IssuesPage:React.FC<{}> = ()=>{
    
    return (
        <PageLayout>
            <IssuesApp />
        </PageLayout>
    )
};

export default IssuesPage;