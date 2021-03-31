import React from 'react';
import styled from 'styled-components';

import {
    CardCarousel
} from '../';

import {
    AgolItem
} from '../../utils/arcgis-online-item-formatter';

const FEATURED_CARD_HEIGHT = 320;
const TABLET_BREAK_POINT = 768;

const FearuredCardContainer = styled.div`
    display: flex;
    align-content: stretch;
    align-items: stretch;
    min-height: ${FEATURED_CARD_HEIGHT}px;
    margin-Bottom: 1rem;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 16px 0 rgba(0, 0, 0, 0.05);

    @media (max-width: ${TABLET_BREAK_POINT}px) {
        display: block;
    }
`;

type FearuredCardImageProps = {
    thumbnailImage: string;
};

const FearuredCardImage = styled.div<FearuredCardImageProps>`
    width: 50%;
    background-image: ${(props) => `url(${props.thumbnailImage})`};
    background-size: cover;
    background-repeat: no-repeat;

    @media (max-width: ${TABLET_BREAK_POINT}px) {
        width: 100%;
        height: ${FEATURED_CARD_HEIGHT}px;
    }
`;

const FearuredCardContent = styled.div`
    width: 50%;
    box-sizing: border-box;
    padding: 1rem;
    background-color: #efefef;

    @media (max-width: ${TABLET_BREAK_POINT}px) {
        width: 100%;
    }
`;

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
            <FearuredCardContainer>   

                <FearuredCardImage 
                    thumbnailImage={thumbnailUrl}
                />

                <FearuredCardContent>
                    <p className="font-size-2 trailer-half">
                        <a target="_blank" href={url}>{title}</a>
                    </p>

                    <p className="font-size--1">
                        { snippet }
                    </p>
                </FearuredCardContent>
            </FearuredCardContainer>
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
