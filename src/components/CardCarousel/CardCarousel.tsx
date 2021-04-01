import * as React from 'react';

import {
    NavBtn,
    CalciteCard
} from '../';

import {
    AgolItem
} from '../../utils/arcgis-online-item-formatter';

interface Props {
    cardsData: AgolItem[]
};

const CardCarousel:React.FC<Props> = ({
    cardsData
})=>{

    const [ startIndex, setStartIndex ] = React.useState<number>(0);

    const showNext = ()=>{
        const nextIdx = startIndex + 1;
        const lastIdx = cardsData.length - 1;

        const newStartIndex = nextIdx <= lastIdx ? nextIdx : 0 
        setStartIndex(newStartIndex);
    };

    const showPrev = ()=>{
        const prevIdx = startIndex - 1;
        const lastIdx = cardsData.length - 1;

        const newStartIndex = prevIdx >= 0 ? prevIdx : lastIdx;
        setStartIndex(newStartIndex);
    }

    const getNavBtnsAtBottom = ()=>{
        return (
            <div 
                className='tablet-show'
                style={{
                    'display': 'flex',
                    'alignItems': 'center',
                    'justifyContent': 'flex-end'
                }}
            >
                <div className='margin-right-half'>
                    <NavBtn 
                        direction={'left'}
                        onClick={showPrev}
                    />
                </div>

                <NavBtn 
                    direction={'right'}
                    onClick={showNext}
                />
            </div>
        );
    }

    const getCardsBlock = ()=>{

        if(!cardsData || !cardsData.length){
            return null;
        }

        let data: AgolItem[] = cardsData.slice(startIndex, startIndex + 3);

        if(data.length < 3){
            const num2Add = 3 - data.length;
            const dataToAdd = cardsData.slice(0, num2Add);
            data = data.concat(dataToAdd);
        }

        const cards = data
            .map((d, i)=>{
                const { 
                    thumbnailUrl, 
                    typeDisplayName,
                    url,
                    title,
                    snippet,
                    id,
                    specialItemType
                } = d;

                return (
                    <CalciteCard 
                        key={id}
                        title={title}
                        url={url}
                        descriptions={snippet}
                        imageUrl={thumbnailUrl}
                        imageCaption={specialItemType || typeDisplayName}
                    />
                );
            });

        return (
            <div
                style={{
                    position: 'relative',
                    // display: 'flex'
                }}
            >
                <div 
                    className='tablet-hide'
                    style={{
                        position: 'absolute',
                        top: `calc(50% - 18px)`,
                        left: -50
                    }}
                >
                    <NavBtn 
                        direction={'left'}
                        onClick={showPrev}
                    />
                </div>

                <div className='block-group block-group-3-up tablet-block-group-3-up phone-block-group-1-up trailer-1'>
                    {cards}
                </div>

                <div 
                    className='tablet-hide'
                    style={{
                        position: 'absolute',
                        top: `calc(50% - 18px)`,
                        right: -50
                    }}
                >
                    <NavBtn 
                        direction={'right'}
                        onClick={showNext}
                    />
                </div>
            </div>

        );
    };

    return cardsData && cardsData.length ? (
        <div>
            { getCardsBlock() }
            { getNavBtnsAtBottom() }
        </div>
    ) : null;
};

export default CardCarousel;