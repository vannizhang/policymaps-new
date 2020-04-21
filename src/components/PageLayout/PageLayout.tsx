import * as React from 'react';

import {
    SiteContext
} from '../../contexts/SiteContextProvider';

import {
    SiteNav
} from '../../components';

import { initEsriGlobalNav } from '../../utils/esri-global-nav';

interface Props {
    shouldHideEsriFooter?: boolean;
    children?: React.ReactNode;
}

const PageLayout: React.FC<Props> = ({
    shouldHideEsriFooter,
    children
}: Props)=>{

    const { esriOAuthUtils, hideTopNavs } = React.useContext(SiteContext);

    React.useEffect(()=>{

        initEsriGlobalNav({
            userData: esriOAuthUtils.getUserData(),
            signIn: ()=>{
                esriOAuthUtils.sigIn();
            },
            signOut: ()=>{
                esriOAuthUtils.signOut();
            }
        });
    }, []);

    const getNavLinksData = ()=>{
        const links = [
            {
                label: 'Overview',
                path: '../overview/',
            },
            {
                label: 'Explore',
                path: '../browse/',
            },
            {
                label: 'Issues',
                path: '../issues/',
            },
            {
                label: 'Resources',
                path: '../resources/',
            }
        ];

        return links;
    };

    return (
        <>
            <div 
                className="esri-header-barrier" 
                style={{
                    "display": hideTopNavs ? "none" : "block"
                }}
            ></div>
            
            {
                !hideTopNavs ? (
                    <SiteNav 
                        siteName={'Esri Maps for Public Policy'}
                        links={getNavLinksData()}
                    /> 
                ): null
            }

            { children }

            <div className="esri-footer-barrier" style={{
                "display": shouldHideEsriFooter ? "none" : "block"
            }}></div>
            
        </>
    )
};

export default PageLayout;