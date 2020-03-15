import * as React from 'react';

import {
    SiteNav
} from '../../components';

import { initEsriGlobalNav } from '../../utils/esri-global-nav';

interface Props {
    children?: React.ReactNode;
}

const PageLayout: React.FC<Props> = ({
    children
}: Props)=>{

    React.useEffect(()=>{
        initEsriGlobalNav();
    }, []);

    const getNavLinksData = ()=>{

        const currentPathName = window.location.pathname.substring(1);

        const links = [
            {
                label: 'Overview',
                path: 'overview',
                isActive: false
            },
            {
                label: 'Explore',
                path: 'browse',
                isActive: false
            },
            {
                label: 'Issues',
                path: 'issues',
                isActive: false
            },
            {
                label: 'Resources',
                path: 'resources',
                isActive: false
            }
        ];

        return links.map(link=>{
            const { path } = link;
            link.isActive = path === currentPathName;
            link.path = '../' + path;
            return link;
        })
    };

    return (
        <>
            <div className="esri-header-barrier"></div>

            <SiteNav 
                siteName={'Esri Maps for Public Policy'}
                links={getNavLinksData()}
            />

            { children }

            <div className="esri-footer-barrier"></div>
        </>
    )
};

export default PageLayout;