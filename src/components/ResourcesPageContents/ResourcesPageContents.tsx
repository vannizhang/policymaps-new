import * as React from 'react';

import {
    InfoCardsGroup
} from '../';

import {
    AgolItem
} from '../../utils/arcgis-online-item-formatter';

import {
    ResourceCategoryName,
    fetchResourcesData
} from '../../utils/policy-maps-resources-data/fetchResourcesData';

import IndustryPerspectivesCarousel from './IndustryPerspectivesCarousel/IndustryPerspectivesCarousel';

import TopBanner from './TopBanner';

interface SectionData {
    featured?: AgolItem;
    cardsData?: AgolItem[]
}

const ResourcesPageContents:React.FC = ()=>{

    const [ industryPerspectivesSectionData, setIndustryPerspectivesSectionData ] = React.useState<SectionData>();

    const [ gettingStartedSectionData, setGettingStartedSectionData ] = React.useState<SectionData>();

    const [ learnLessonsSectionData, setLearnLessonsSectionData ] = React.useState<SectionData>();

    const [ bestPracticeSectionData, setBestPracticeSectionData ] = React.useState<SectionData>();

    const fetchPageData = async()=>{
        try {
            const cardsData = await fetchResourcesData({
                categories: ['Getting Started', 'Learn Lessons', 'Best Practices', 'Industry Perspectives']
            });

            processPageData(cardsData);

        } catch(err){
            console.error(err);
        }
    };

    const processPageData = (data: AgolItem[])=>{

        const dataBySections: { 
            [key in ResourceCategoryName]?: SectionData 
        } = {
            'Getting Started': {
                featured: null,
                cardsData: []
            },
            'Learn Lessons': {
                featured: null,
                cardsData: []
            },
            'Best Practices': {
                featured: null,
                cardsData: []
            },
            'Industry Perspectives': {
                featured: null,
                cardsData: []
            }
        };

        Object.keys(dataBySections).map(key=>{

            let featured:AgolItem = null;

            let cardsData = data.filter(d=>{
                const { groupCategories } = d;
                return groupCategories.filter(categoryName=>categoryName.indexOf(key) > -1).length;
            });

            cardsData.forEach((d, i)=>{

                d.groupCategories.forEach(categoryName=>{
                    if(categoryName.indexOf('Featured') > -1){

                        if(!featured){
                            featured = d;
                            cardsData.splice(i, 1);
                        }
                    }
                });

            });

            cardsData.sort((a, b)=>{
                return b.modified - a.modified
            });

            console.log(cardsData)

            dataBySections[key] = {
                featured,
                cardsData
            };
        });
        // console.log(dataBySections)

        setGettingStartedSectionData(dataBySections['Getting Started']);

        setBestPracticeSectionData(dataBySections['Best Practices']);

        setLearnLessonsSectionData(dataBySections['Learn Lessons']);

        setIndustryPerspectivesSectionData(dataBySections['Industry Perspectives']);
    };

    React.useEffect(()=>{
        fetchPageData();
    }, []);

    return (
        <>
            <TopBanner />
            
            <InfoCardsGroup 
                title={'Start here'}
                greyBackground={true}
                description={'Learn how to find and share ready-to-use policy maps about your community.'}
                featuredCard={gettingStartedSectionData ? gettingStartedSectionData.featured : null}
                cardsData={gettingStartedSectionData ? gettingStartedSectionData.cardsData : []}
            />

            <InfoCardsGroup 
                title={'Get inspired'}
                description={'Find examples from others to kickstart your own policy maps.'}
                featuredCard={bestPracticeSectionData ? bestPracticeSectionData.featured : null}
                cardsData={bestPracticeSectionData ? bestPracticeSectionData.cardsData : []}
            />

            <InfoCardsGroup 
                title={'Apply a policy perspective'}
                greyBackground={true}
                description={'Create your own maps that show opportunities to intervene.'}
                featuredCard={learnLessonsSectionData ? learnLessonsSectionData.featured : null}
                cardsData={learnLessonsSectionData ? learnLessonsSectionData.cardsData : []}
            />

            <IndustryPerspectivesCarousel 
                data={industryPerspectivesSectionData ? industryPerspectivesSectionData.cardsData : []}
            />
        </>
    );
};

export default ResourcesPageContents;