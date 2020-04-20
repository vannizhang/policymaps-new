import * as React from 'react';

import {
    CardCarousel
} from '../';

import {
    AgolItem
} from '../../utils/arcgis-online-item-formatter';

interface Props {
    title: string;
    description: string;
    cardsData: AgolItem[];
    featuredCard?: AgolItem;
    greyBackground?: boolean;
}

const InfoCardsGroup:React.FC<Props> = ({
    title,
    description,
    cardsData,
    featuredCard,
    greyBackground
})=>{

    return cardsData && cardsData.length ? (
        <div
            style={{
                'padding': '5rem 0',
                'backgroundColor': greyBackground ? '#f8f8f8' : '#fff'
            }}
        >
            <div
                className='grid-container'
            >
                <div className='column-16 center-column'>
                    <h3 className="trailer-quarter">{title}</h3>
                    <p className="trailer-0 avenir-light font-size--1">{description}</p>

                    <div className='leader-1'>
                        <CardCarousel 
                            cardsData={cardsData}
                        />
                    </div>
                </div>
            </div>
        </div>

    ) : null;
};

export default InfoCardsGroup;
