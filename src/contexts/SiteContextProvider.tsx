import * as React from 'react';

import { urlFns } from 'helper-toolkit-ts';
import EsriOAuth from '../utils/Esri-OAuth';

interface SiteContextProps {
    esriOAuthUtils: EsriOAuth;
    // this site can be embedded in COVID19 hub site and we need to hide both top navs if the "embed" hash param is true
    hideTopNavs?: boolean;
}

interface SiteContextProviderProps {
    esriOAuthUtils: EsriOAuth;
    children: React.ReactNode;
};

export const SiteContext = React.createContext<SiteContextProps>(null);

export const SiteContextProvider:React.FC<SiteContextProviderProps> = ({ 
    esriOAuthUtils,
    children,
})=>{

    const hashParams = urlFns.parseHash();

    const value = {
        esriOAuthUtils,
        hideTopNavs: hashParams.embed ? true : false
    };

    return (
        <SiteContext.Provider value={value}>
            { children }
        </SiteContext.Provider>
    );
}