import * as React from 'react';

import { 
    CategorySchemaDataItem
} from '../../utils/category-schema-manager';

// import {
//     CategoryDescriptions
// } from '../../AppConfig';

import classnames from 'classnames';

interface Props {
    categorySchema: CategorySchemaDataItem;
    activeMainCategoryTitle: string;
    onSelect: (activeMainCategoryTitle:string)=>void
}

const HeroBanner:React.FC<Props> = ({
    categorySchema,
    activeMainCategoryTitle,
    onSelect
})=>{

    // active main catgeory that displays the all subcategory options
    // const [ activeMainCategoryTitle, setActiveMainCategoryTitle ] = React.useState<string>();

    const getContent = ()=>{
        // const activeCategory = categorySchema.categories
        //     .filter(category=>category.title === activeMainCategoryTitle)[0];

        // const descriptionData = CategoryDescriptions
        //     .filter(data=>data.title === activeMainCategoryTitle)[0];

        const title = `How do you view your community?`

        const description = `
        The categories below contain some of the more useful maps, layers and data about your community. It starts with understanding the people in your community, their opportunities, local environment and resources, and the infrastructure available. Browse what's available below to see what other communities are doing, what data exists for a topic and share what you find with your colleagues and your GIS community.
        `

        return (
            <div 
                className='leader-5 trailer-3'
                style={{
                    'minHeight': '160px'
                }}
            >
                <h1 className="sub-nav-title text-white text-shadow-black">{ title }</h1>
                <p className="text-white text-shadow-black">{description}</p>
            </div>
        );
    };

    const getNavBtns = ()=>{

        const navBtns = categorySchema.categories.map((category, index)=>{

            const { title } = category;

            const classNames = classnames('sub-nav-link cursor-pointer', {
                'is-active': category.title === activeMainCategoryTitle
            });

            return (
                <span 
                    key={`sub-nav-link-${title}`}
                    className={classNames}
                    onClick={onSelect.bind(this, title)}
                >
                    {title}
                </span>
            )
        });

        return (
            <nav className="sub-nav-list" role="navigation" aria-labelledby="subnav">
                { navBtns }
            </nav>
        )
    };

    React.useEffect(()=>{
        if(categorySchema && !activeMainCategoryTitle){
            const activeCategory = categorySchema.categories[0];
            onSelect(activeCategory.title);
        }
    }, [categorySchema]);

    // React.useEffect(()=>{
    //     if(activeMainCategoryTitle){
    //         onSelect(activeMainCategoryTitle);
    //     }
    // }, [activeMainCategoryTitle])

    return categorySchema && activeMainCategoryTitle ? (
        <div
            className='hero-banner-nav'
            style={{
                'position': 'relative',
            }}
            // data-active-category={activeMainCategoryTitle}
        >
            <div
                style={{
                    'position': 'absolute',
                    'top': 0,
                    'left': 0,
                    'bottom': 0,
                    'right': 0,
                    'background': 'rgba(0, 0, 0, 0.5)'
                }}
            ></div>

            <div 
                className='grid-container'
                style={{
                    position: 'relative'
                }}
            >
                <div className='column-16 first-column'>
                    { getContent() }
                </div>
                <div className='column-24'>
                    { getNavBtns() }
                </div>
            </div>
        </div>
    ) : null;
};

export default HeroBanner;