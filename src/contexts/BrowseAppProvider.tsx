import * as React from 'react';

interface BrowseAppContextProps {
    activeWebmapId: string;
    setActiveWebmapId: (itemId:string)=>void;
    // children: React.ReactNode;
};

interface BrowseAppContextProviderProps {
    // children: React.ReactNode;
    webMapId: string;
};

export const BrowseAppContext = React.createContext<BrowseAppContextProps>(null);

export const BrowseAppContextProvider:React.FC<BrowseAppContextProviderProps> = ({ 
    webMapId,
    children,
})=>{

    const [ activeWebmapId, setActiveWebmapId ]  = React.useState<string>(webMapId);

    const value = {
        activeWebmapId,
        setActiveWebmapId
    };

    return (
        <BrowseAppContext.Provider value={value}>
            { children }
        </BrowseAppContext.Provider>
    );
}