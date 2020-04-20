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

interface SectionData {
    featured?: AgolItem;
    cardsData?: AgolItem[]
}

const ResourcesPageContents:React.FC = ()=>{

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

            let idxForFeaturedItem = -1;

            const cardsData = data.filter(d=>{
                const { groupCategories } = d;
                return groupCategories.filter(categoryName=>categoryName.indexOf(key) > -1).length;
            });

            cardsData.forEach((d, i)=>{

                if(idxForFeaturedItem === -1){
                    
                    let isFeatured = false;

                    d.groupCategories.forEach(categoryName=>{
                        if(categoryName.indexOf('Featured') > -1){
                            isFeatured = true;
                        }
                    });
    
                    if(isFeatured){
                        idxForFeaturedItem = i;
                    }
                }

            });

            if(idxForFeaturedItem > -1){
                cardsData.splice(idxForFeaturedItem, 1);
            }

            dataBySections[key] = {
                featured: cardsData[idxForFeaturedItem],
                cardsData
            };
        });
        // console.log(dataBySections)

        setGettingStartedSectionData(dataBySections['Getting Started']);

        setBestPracticeSectionData(dataBySections['Best Practices']);

        setLearnLessonsSectionData(dataBySections['Learn Lessons']);
    };

    React.useEffect(()=>{
        fetchPageData();
    }, []);

    return (
        <>
            <InfoCardsGroup 
                title={'Getting Started'}
                description={'Explore resources to help you begin planning your policy framework.'}
                featuredCard={gettingStartedSectionData ? gettingStartedSectionData.featured : null}
                cardsData={gettingStartedSectionData ? gettingStartedSectionData.cardsData : []}
            />

            <InfoCardsGroup 
                title={'Learn Lessons'}
                description={'Guided lessons based on real-world problems.'}
                greyBackground={true}
                featuredCard={learnLessonsSectionData ? learnLessonsSectionData.featured : null}
                cardsData={learnLessonsSectionData ? learnLessonsSectionData.cardsData : []}
            />

            <InfoCardsGroup 
                title={'Best Practices in Public Policy'}
                description={'Be inspired by the work of your peers who are leading the charge to tackle today’s issues.'}
                featuredCard={bestPracticeSectionData ? bestPracticeSectionData.featured : null}
                cardsData={bestPracticeSectionData ? bestPracticeSectionData.cardsData : []}
            />
        </>
    );
};

export default ResourcesPageContents;