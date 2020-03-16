import * as React from 'react';

import EsriOAuth from '../utils/Esri-OAuth';

interface SiteContextProps {
    esriOAuthUtils: EsriOAuth;
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

    const value = {
        esriOAuthUtils
    };

    return (
        <SiteContext.Provider value={value}>
            { children }
        </SiteContext.Provider>
    );
}