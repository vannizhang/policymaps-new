import * as React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { 
    BrowseAppContext
} from '../../contexts/BrowseAppProvider';

import {
    AgolItem
} from '../../utils/arcgis-online-item-formatter'

import {
    NavBtn
} from '../';

import {
    itemCollectionSelector
} from '../../store/browseApp/reducers/itemCollections';

import {
    setActiveWebmap,
	activeWebmapSelector
} from '../../store/browseApp/reducers/map';

interface Props {
    isMinimal: boolean;
}

const ActiveMapSwitcher:React.FC<Props> = ({
    isMinimal
})=>{

    const dispatch = useDispatch();

    const itemsCollection = useSelector(itemCollectionSelector);

    const activeWebmapItem = useSelector(activeWebmapSelector);

    const getIndexForActiveWebmap = ()=>{
        const itemIds = itemsCollection.map(item=>item.id);
        return itemIds.indexOf(activeWebmapItem.id);
    }

    const showNext = ()=>{
        const index = getIndexForActiveWebmap();

        const nextItem:AgolItem = (index + 1 < itemsCollection.length) 
            ? itemsCollection[index + 1]
            : itemsCollection[0];

        dispatch(setActiveWebmap(nextItem));
    };

    const showPrev = ()=>{
        const index = getIndexForActiveWebmap();

        const prevItem:AgolItem = (index - 1 >=0 ) 
        ? itemsCollection[index - 1]
        : itemsCollection[itemsCollection.length - 1];

        // setActiveWebmapItem(prevItem);
        dispatch(setActiveWebmap(prevItem));
    };

    // get message that indicate the position of active webmap in the item collections (e.g. Map 2 of 5)
    const getActiveItemIndicator = ():string=>{

        const index = getIndexForActiveWebmap();

        if(index === -1){
            return '';
        }

        return `Map ${ index + 1 } of ${itemsCollection.length}`;
    };

    return activeWebmapItem ? (
        <div
            className={'active-map-switcher'}
            style={{
                'flexGrow': 1,
                'flexShrink': 1,
                'flexBasis': '10px',
    
                'display': 'flex',
                'flexDirection': 'row',
                'flexWrap': 'wrap',
                'justifyContent': 'flex-start',
                'alignContent': 'center',
                'alignItems': 'center',
                'padding': '0 .75rem',
                'boxSizing': 'border-box',
            }}
        >
            <div 
                className='active-map-title text-ellipsis avenir-demi font-size--0' 
                style={{
                    'flexGrow': 1,
                    'flexShrink': 1,
                    'flexBasis': '1px',
                }}
            >
                { activeWebmapItem.title }
                {/* <span className='avenir-demi font-size--0'> { activeWebmapItem.title }</span> */}
            </div>

            <div
                style={{
                    // 'flexGrow': 1,
                    // 'flexShrink': 0,
                    // 'flexBasis': '50px',
                    'display': 'flex',
                    'justifyContent': 'flex-end',
                    'alignItems': 'center',
                    // 'flexBasis': '200px',
                }}
            >

                <div 
                    className='tablet-hide'
                    style={{ 
                        'padding': '0 .5rem',
                        'display': !isMinimal ? 'block' : 'none'
                    }}
                >
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
    ) : null;
};

export default ActiveMapSwitcher;