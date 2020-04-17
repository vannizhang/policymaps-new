import * as React from 'react';
import axios from 'axios';

import {
    NavBtn,
    CalciteCard
} from '../';

import {
    formatAsAgolItem,
    AgolItem
} from '../../utils/arcgis-online-item-formatter';

import {
    Tier
} from '../../AppConfig';

const PolicyQuestionsCards:React.FC = ()=>{

    const [ cardsData, setCardsData ] = React.useState<AgolItem[]>([]);

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
                    snippet
                } = d;

                return (
                    <CalciteCard 
                        key={`policy-questions-card-${i}`}
                        title={title}
                        url={url}
                        descriptions={snippet}
                        imageUrl={thumbnailUrl}
                        imageCaption={typeDisplayName}
                    />
                );
            });

        return (
            <div className='block-group block-group-3-up tablet-block-group-2-up phone-block-group-1-up trailer-1'>
                {cards}
            </div>
        );
    };

    const fetchPolicyQuestions = async()=>{

        try {
            const { AGOL_GROUP_ID } = Tier.PROD
            const requestUrl = `https://www.arcgis.com/sharing/rest/content/groups/${AGOL_GROUP_ID}/search?f=json&start=1&num=10&categories=/Categories/Resources/In%20the%20News`;

            const { data } = await axios.get(requestUrl);

            if(data && data.results && data.results.length){

                const cardsData = data.results
                    .map((d:AgolItem)=>formatAsAgolItem(d , { thumbnailWidth: 800 }));

                setCardsData(cardsData);
            }

        } catch(err){
            console.error(err);
        }
        
    };

    React.useEffect(()=>{
        fetchPolicyQuestions();
    }, [])

    return (
        <div className='leader-3 trailer-3'>
            <div className='grid-container'>

                <div className='column-10 center-column text-center'>
                    <h3 className="text-blue avenir-light trailer-1">Emerging Policy Questions &amp; Solution Approaches</h3>
                    <p className="font-size--1 trailer-2">Gain inspiration from forward-thinking organizations and policy analysts tackling today’s community challenges.</p>
                </div>

                <div className='column-18 center-column text-center'>
                    { getCardsBlock() }
                    
                    <div 
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
                </div>
                
            </div>
        </div>
    );
};

export default PolicyQuestionsCards;