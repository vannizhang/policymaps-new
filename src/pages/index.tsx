import '../styles/index.scss';

import * as React from 'react';

import {
    PageLoadingIndicator
} from '../components';

const OverviewPage = React.lazy(() => import('./Overview/OverviewPage'));
const BrowsePage = React.lazy(() => import('./Browse/BrowsePage'));
const IssuesPage = React.lazy(() => import('./Issues/IssuesPage'));
const ResourcesPage = React.lazy(() => import('./Resources/ResourcesPage'));

// import OverviewPage from './Overview/OverviewPage';
// import BrowsePage from './Browse/BrowsePage';
// import IssuesPage from './Issues/IssuesPage';
// import ResourcesPage from './Resources/ResourcesPage';

const PolicyMapsSite: React.FC = ()=>{

    const getComponentForCurrentPage = ()=>{
        const pathnames = window.location.pathname.split('/').filter(d=>d);
        const currentPath = pathnames[pathnames.length - 1];

        const componentsLookup = {
            'overview': <OverviewPage />,
            'browse': <BrowsePage />,
            'issues': <IssuesPage />,
            'resources': <ResourcesPage />
        };

        return componentsLookup[currentPath];
    };

    return (
        <React.Suspense 
            fallback={<PageLoadingIndicator />}
        >
            { getComponentForCurrentPage() }
        </React.Suspense>
    );
};

export default PolicyMapsSite;