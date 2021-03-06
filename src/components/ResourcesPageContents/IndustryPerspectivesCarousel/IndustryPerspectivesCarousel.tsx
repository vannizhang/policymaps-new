import './style.scss';
import * as React from 'react';
import classnames from 'classnames';

import {
    NavBtn
} from '../../';

import {
    AgolItem
} from '../../../utils/arcgis-online-item-formatter';

interface Props {
    data: AgolItem[]
}

const IndustryPerspectivesCarousel:React.FC<Props> = ({
    data
})=>{

    const [ activeIndex, setActiveIndex ] = React.useState<number>(0);

    const moveNext = ()=>{

        const nextIdx = activeIndex + 1;

        const newIdx = nextIdx < data.length 
            ? nextIdx
            : 0;

        setActiveIndex(newIdx);
    };

    const movePrev = ()=>{
        const prevIdx = activeIndex -1;

        const newIdx = prevIdx >= 0 
            ? prevIdx
            : data.length - 1;

        setActiveIndex(newIdx);
    };

    const getItemsToDisplay = ()=>{
        let itemsToDisplay = data.slice(activeIndex, 3);

        if(itemsToDisplay.length < 3){
            const numOfItemsToAdd = 3 - itemsToDisplay.length;
            const itemsToAdd = data.slice(0, numOfItemsToAdd);

            itemsToDisplay = itemsToDisplay.concat(itemsToAdd);
        }

        return itemsToDisplay;
    };

    const getCards = ()=>{

        const cardsData = getItemsToDisplay();

        const centerItem = cardsData[1];
        console.log(centerItem)

        const cards = cardsData.map((d, i)=>{
            const { id } = d;

            const classNames = classnames('industry-perspectives-card', {
                // the second item (out of 3) is always the active one 
                'is-active': i === 1
            });

            return (
                <div 
                    key={`industry-perspectives-card-${id}`}
                    className={classNames} 
                    data-item-id={id}
                >

                </div>
            );
        });

        return (
            <>            
                <div
                    style={{
                        'display': 'flex',
                        'alignItems': 'center'
                    }}
                >
                    <div>
                        <NavBtn 
                            direction={'left'}
                            onClick={movePrev}
                        />
                    </div>

                    <div
                        className='industry-perspectives-cards-container'
                        style={{
                            'flexGrow': 1
                        }}
                    >
                        { cards }
                    </div>

                    <div>
                        <NavBtn 
                            direction={'right'}
                            onClick={moveNext}
                        />
                    </div>
                </div>

                <div className='text-center leader-2'>
                    <h4 className="avenir-demi">
                        <a href={`https://www.arcgis.com/sharing/rest/content/items/${centerItem.id}/data`} target="_blank">
                            {centerItem.title}
                        </a>
                    </h4>

                    <p className="font-size--2">{centerItem.snippet}</p>
                </div>
            </>

        );

    };

    return data && data.length ? (
        <div 
            style={{
                'padding': '3rem 0',
                'backgroundColor': '#f8f8f8'
            }}
        >
            <div
                className='grid-container'
            >
                <div className="column-12 center-column text-center trailer-2">
                    <h3 className="trailer-1">Community Perspectives</h3>
                    <p className="leader-half avenir-light font-size--1">Discover insights and approaches from today’s thought leaders.</p>
                </div>

                <div className="column-14 center-column">
                    { getCards() }
                </div>
                

            </div>
        </div>

    ): null
};

export default IndustryPerspectivesCarousel;