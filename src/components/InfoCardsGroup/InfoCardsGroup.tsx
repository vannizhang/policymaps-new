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

    const getFeaturedCard = ()=>{
        if(!featuredCard){
            return null;
        }

        const {
            title, 
            snippet, 
            url,
            thumbnailUrl
        } = featuredCard;

        return (
            <div 
                style={{
                    'display': 'flex',
                    'alignContent': 'strech',
                    'alignItems': 'strech',
                    'minHeight': '320px',
                    'marginBottom': '1rem',
                    'boxShadow': '0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 16px 0 rgba(0, 0, 0, 0.05)'
                }}
            >   
                <div
                    style={{
                        'flexGrow': 1,
                        'flexBasis': '250px',
                        'flexShrink': 0,
                        'backgroundImage': `url(${thumbnailUrl})`,
                        'backgroundSize': 'cover',
                        'backgroundRepeat': 'no-repeat'
                    }}
                >
                </div>

                <div
                    style={{
                        'flexGrow': 1,
                        'flexBasis': '250px',
                        'flexShrink': 0,
                        'boxSizing': 'border-box',
                        'padding': '1rem',
                        'backgroundColor': '#efefef'
                    }}
                >
                    <p className="font-size-2 trailer-half">
                        <a target="_blank" href={url}>{title}</a>
                    </p>

                    <p className="font-size--1">
                        { snippet }
                    </p>
                </div>
            </div>
        );
    }

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
                        { getFeaturedCard() }
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
