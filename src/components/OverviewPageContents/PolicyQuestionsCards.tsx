import * as React from 'react';
import axios from 'axios';

import {
    CardCarousel
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
                    <CardCarousel 
                        cardsData={cardsData}
                    />
                </div>
                
            </div>
        </div>
    );
};

export default PolicyQuestionsCards;