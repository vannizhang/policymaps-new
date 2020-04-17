import * as React from 'react';

import { 
    PageLayout, 
    IssuesPageContents
} from '../../components'

const IssuesPage:React.FC<{}> = ()=>{
    
    return (
        <PageLayout>
            <IssuesPageContents />
        </PageLayout>
    )
};

export default IssuesPage;