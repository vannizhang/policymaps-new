import * as React from 'react';

import {
    CardCarousel
} from '../';

import {
    AgolItem
} from '../../utils/arcgis-online-item-formatter';

import { 
    fetchResourcesData 
} from '../../utils/policy-maps-resources-data/fetchResourcesData';

const PolicyQuestionsCards:React.FC = ()=>{

    const [ cardsData, setCardsData ] = React.useState<AgolItem[]>([]);

    const fetchPolicyQuestions = async()=>{

        try {
            const cardsData = await fetchResourcesData({
                categories: ['In the News']
            });

            setCardsData(cardsData);

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