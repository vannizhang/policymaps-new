import * as React from 'react';
import shortid from 'shortid';

import { 
    CategorySchemaDataItem
} from '../../utils/category-schema-manager';

import {
    CategoryDescriptions
} from '../../AppConfig';

import classnames from 'classnames';

interface Props {
    categorySchema: CategorySchemaDataItem;
    onSelect: (activeMainCategoryTitle:string)=>void
}

const HeroBanner:React.FC<Props> = ({
    categorySchema,
    onSelect
})=>{

    // active main catgeory that displays the all subcategory options
    const [ activeMainCategoryTitle, setActiveMainCategoryTitle ] = React.useState<string>();

    const getContent = ()=>{
        const activeCategory = categorySchema.categories
            .filter(category=>category.title === activeMainCategoryTitle)[0];

        const descriptionData = CategoryDescriptions
            .filter(data=>data.title === activeMainCategoryTitle)[0];

        return (
            <div 
                className='leader-5 trailer-3'
                style={{
                    'minHeight': '160px'
                }}
            >
                <h1 className="sub-nav-title text-white text-shadow-black">{ activeCategory.title }</h1>
                <p className="text-white text-shadow-black">{descriptionData.description}</p>
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
                    key={`sub-nav-link-${shortid.generate()}`}
                    className={classNames}
                    onClick={setActiveMainCategoryTitle.bind(this, title)}
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
        if(categorySchema){
            const activeCategory = categorySchema.categories[0];
            setActiveMainCategoryTitle(activeCategory.title);
        }
    }, [categorySchema]);

    React.useEffect(()=>{
        if(activeMainCategoryTitle){
            onSelect(activeMainCategoryTitle);
        }
    }, [activeMainCategoryTitle])

    return categorySchema && activeMainCategoryTitle ? (
        <div
            className='hero-banner-nav'
            style={{
                'position': 'relative',
            }}
            data-active-category={activeMainCategoryTitle}
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