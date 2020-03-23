import * as React from 'react';

import { 
    BrowseAppContext 
} from '../../contexts/BrowseAppProvider';

import {
    RegularCard
} from '../';

import { AgolItem } from '../../utils/arcgis-online-group-data';

interface Props {
    title: string;
    data: AgolItem[];
    itemCount: number;
};

const CardList: React.FC<Props> = ({
    title = '',
    data = [],
    itemCount = 0
}:Props)=>{

    const { activeWebmapItem, setActiveWebmapItem } = React.useContext(BrowseAppContext);

    const [ isHide, setIsHide ] = React.useState<boolean>(false);

    const toggleList = ()=>{
        setIsHide(!isHide);
    };

    const getList = ()=>{
        const cards = data.map((item, index)=>{
            return ( 
                <div 
                    key={`list-item-${index}`}
                    className='block trailer-half'
                >
                    <RegularCard 
                        title={item.title}
                        description={item.snippet}
                        link={item.agolItemUrl}
                        itemId={item.id}
                        imageUrl={item.thumbnailUrl}
                        item={item}

                        viewOnMap={ item.id === activeWebmapItem.id }

                        viewBtnOnClick={(setActiveWebmapItem)}
                    />
                </div>
            );
        });

        return (
            <div className='card-list block-group block-group-2-up tablet-block-group-2-up phone-block-group-1-up'>
                { cards }
            </div>
        );
    };

    return (
        <>
            <div 
                className='trailer-half'
                style={{
                    'display': 'flex',
                    'alignItems': 'center',
                    'cursor': 'pointer'
                }}
                onClick={toggleList}
            > 
                <div className='font-size--3' >
                    {
                        !isHide 
                        ? <span className="icon-ui-minus"></span> 
                        : <span className="icon-ui-plus"></span>
                    }
                </div>
                
                <span className="avenir-demi font-size--2">{title} ({itemCount})</span>
            </div>
            { !isHide ? getList() : null }
        </>
        
    );
};

export default CardList;