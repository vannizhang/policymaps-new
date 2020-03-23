import * as React from 'react';

import { 
    AgolItem,
    queryItemsByIds
} from '../utils/arcgis-online-group-data';

import { Tier } from '../AppConfig';

interface BrowseAppContextProps {
    activeWebmapItem: AgolItem;
    setActiveWebmapItem: (item:AgolItem)=>void;

    itemCollections: AgolItem[],
    toggleFromItemCollections: (item:AgolItem)=>void;
    // children: React.ReactNode;
};

interface BrowseAppContextProviderProps {
    // children: React.ReactNode;
    defaultWebmapId: string;
};

export const BrowseAppContext = React.createContext<BrowseAppContextProps>(null);

export const BrowseAppContextProvider:React.FC<BrowseAppContextProviderProps> = ({ 
    defaultWebmapId,
    children,
})=>{

    const [ activeWebmapItem, setActiveWebmapItem ] = React.useState<AgolItem>(null);

    const [ itemCollections, setItemCollections ] = React.useState<AgolItem[]>(null);

    const toggleFromItemCollections = (item:AgolItem)=>{

    };

    const value = {
        activeWebmapItem,
        setActiveWebmapItem,
        itemCollections,
        toggleFromItemCollections
    };

    // fetch items required to init the browse app (active web map, items in collection)
    const fetchData = async()=>{
        const results = await queryItemsByIds({
            itemIds: [defaultWebmapId],
            groupId: Tier.PROD.AGOL_GROUP_ID
        });
        // console.log(results)

        const defaultWebmap = results.filter(d=>d.id === defaultWebmapId)[0];
        
        setActiveWebmapItem(defaultWebmap);
    };

    React.useEffect(()=>{
        fetchData();
    }, []);

    return (
        <BrowseAppContext.Provider value={value}>
            { activeWebmapItem ? children : null }
        </BrowseAppContext.Provider>
    );
}