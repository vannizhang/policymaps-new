import * as React from 'react';

import TopBanner from './TopBanner';
import PolicyQuestionsCards from './PolicyQuestionsCards';
import TopicsExplorer from './TopicsExplorer';

const OverviewPageContents:React.FC = ()=>{


    return (
        <>
            <TopBanner />
            <PolicyQuestionsCards />
            <TopicsExplorer />
        </>
    );
};

export default OverviewPageContents;