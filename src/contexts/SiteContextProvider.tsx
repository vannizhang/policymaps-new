import * as React from 'react';

import {  miscFns } from 'helper-toolkit-ts';
import EsriOAuth from '../utils/Esri-OAuth';

interface SiteContextProps {
    esriOAuthUtils: EsriOAuth;
    // this site can be embedded in COVID19 hub site and we need to hide both top navs if the "embed" hash param is true
    isEmbedded?: boolean;
    // this site can also be embbeded in an iframe with search and search results hide if the "disableSearch" hash param is true
    // if true, disable search related components on Browse page
    isSearchDisabled?: boolean;
    isMobile?: boolean;
}

interface SiteContextProviderProps {
    isEmbedded: boolean;
    isSearchDisabled: boolean;
    esriOAuthUtils: EsriOAuth;
    children: React.ReactNode;
};

export const SiteContext = React.createContext<SiteContextProps>(null);

export const SiteContextProvider:React.FC<SiteContextProviderProps> = ({ 
    esriOAuthUtils,
    isEmbedded,
    isSearchDisabled,
    children,
})=>{

    const value:SiteContextProps = {
        esriOAuthUtils,
        isEmbedded,
        isSearchDisabled,
        isMobile: miscFns.isMobileDevice()
    };

    return (
        <SiteContext.Provider value={value}>
            { children }
        </SiteContext.Provider>
    );
}