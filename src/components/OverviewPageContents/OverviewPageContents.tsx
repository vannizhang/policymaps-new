import * as React from 'react';

import TopBanner from './TopBanner';
import PolicyQuestionsCards from './PolicyQuestionsCards'

const OverviewPageContents:React.FC = ()=>{


    return (
        <>
            <TopBanner />
            <PolicyQuestionsCards />
        </>
    );
};

export default OverviewPageContents;