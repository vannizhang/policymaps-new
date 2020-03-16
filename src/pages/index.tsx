import '../styles/index.scss';

import * as React from 'react';

import {
    PageLoadingIndicator
} from '../components';

const OverviewPage = React.lazy(() => import('./Overview'));
const BrowsePage = React.lazy(() => import('./Browse'));
const IssuesPage = React.lazy(() => import('./Issues'));
const ResourcesPage = React.lazy(() => import('./Resources'));

const PolicyMapsSite: React.FC = ()=>{

    const getComponentForCurrentPage = ()=>{

        const pathnames = window.location.pathname.split('/');
        const currentPath = pathnames[1];

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