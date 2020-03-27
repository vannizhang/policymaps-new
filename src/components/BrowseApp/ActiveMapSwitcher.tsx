import * as React from 'react';

import { 
    BrowseAppContext
} from '../../contexts/BrowseAppProvider';

import {
    AgolItem
} from '../../utils/arcgis-online-item-formatter'

import {
    NavBtn
} from '../';

interface Props {
}

const ActiveMapSwitcher:React.FC<Props> = ({
    children
})=>{

    const { itemsCollection, activeWebmapItem, setActiveWebmapItem } = React.useContext(BrowseAppContext);

    const getIndexForActiveWebmap = ()=>{
        const itemIds = itemsCollection.map(item=>item.id);
        return itemIds.indexOf(activeWebmapItem.id);
    }

    const showNext = ()=>{
        const index = getIndexForActiveWebmap();

        const nextItem:AgolItem = (index + 1 < itemsCollection.length) 
            ? itemsCollection[index + 1]
            : itemsCollection[0];

        setActiveWebmapItem(nextItem);
    };

    const showPrev = ()=>{
        const index = getIndexForActiveWebmap();

        const prevItem:AgolItem = (index - 1 >=0 ) 
        ? itemsCollection[index - 1]
        : itemsCollection[itemsCollection.length - 1];

    setActiveWebmapItem(prevItem);
    };

    // get message that indicate the position of active webmap in the item collections (e.g. Map 2 of 5)
    const getActiveItemIndicator = ():string=>{

        const index = getIndexForActiveWebmap();

        if(index === -1){
            return '';
        }

        return `Map ${ index + 1 } of ${itemsCollection.length}`;
    };

    const getContainerStyle = ():React.CSSProperties=>{

        return {
            'flexGrow': 1,
            'flexShrink': 0,
            // 'flexBasis': '200px',
            'display': 'flex',
            'flexWrap': 'wrap',
            'justifyContent': 'flex-start',
            'alignContent': 'strech',
            'alignItems': 'center',
            'padding': '0 .75rem',
            'boxSizing': 'border-box',
        };
    };

    return (
        <div
            className={'active-map-switcher'}
            style={getContainerStyle()}
        >
            <div className='active-map-title' style={{
                'flexGrow': 1,
                'flexShrink': 0,
                // 'flexBasis': '100px',
                // 'whiteSpace': 'nowrap',
                // 'overflow': 'hidden',
                // 'textOverflow': 'ellipsis'
            }}>
                <span className='avenir-demi font-size--0'> { activeWebmapItem.title }</span>
            </div>

            <div
                style={{
                    'display': 'flex',
                    // 'justifyContent': 'flex-start',
                    'alignItems': 'center',
                }}
            >

                <div style={{ 'padding': '0 .5rem' }}>
                    <span>
                        { getActiveItemIndicator() }
                    </span>
                </div>

                <div style={{ padding: '0 .25rem' }}>
                    <NavBtn 
                        direction='left'
                        onClick={showPrev}
                        isDisabled={ getIndexForActiveWebmap() === -1 }
                    />
                </div>

                <div style={{ padding: '0 .25rem' }}>
                    <NavBtn 
                        direction='right'
                        onClick={showNext}
                        isDisabled={ getIndexForActiveWebmap() === -1 }
                    />
                </div>

            </div>


        </div>
    );
};

export default ActiveMapSwitcher;