import * as React from 'react';

import { 
    CategorySchemaDataItem,
    CategorySchemaMainCategory,
    CategorySchemaSubCategory
} from '../../utils/category-schema-manager';

interface Props {
    categorySchema: CategorySchemaDataItem;
};

const CategoryFilter:React.FC<Props> = ({
    categorySchema
})=>{

    const [ activeMainCategoryTitle, setActiveMainCategoryTitle ] = React.useState<string>();

    const toggleMainCategory = (mainCategoryTitle:string)=>{
        const newVal = mainCategoryTitle !== activeMainCategoryTitle 
            ? mainCategoryTitle 
            : '';

        setActiveMainCategoryTitle(newVal);
    }

    const getSubCategoryFilters = (subcategories:CategorySchemaSubCategory[] )=>{

        const filters = subcategories.map(subcategory=>{
            return (
                <div style={{
                    'padding': '.1rem 0'
                }}>
                    <span className='font-size--2'>{ subcategory.title }</span>
                </div>
            );
        });

        return (
            <div style={{
                'padding': '.25rem 0'
            }}>
                { filters }
            </div>
        )
    }

    const getCategoryFiltes = ()=>{

        return categorySchema.categories.map((mainCategory, index)=>{
            
            const isActive  = mainCategory.title === activeMainCategoryTitle;

            const toggleIcon =  isActive ? 'icon-ui-up' : 'icon-ui-down'

            return (
                <div 
                    key={`category-filter-${index}`}
                    style={{
                        'padding': '.5rem 1rem',
                        'borderBottom': '1px solid #efefef',
                    }}
                >
                    <div 
                        style={{
                            'cursor': 'pointer'
                        }}
                        onClick={toggleMainCategory.bind(this, mainCategory.title)}
                    >
                        <span className="avenir-demi font-size--1">{ mainCategory.title } </span>
                        <span className={`right ${ toggleIcon }`}></span>
                    </div>

                    {
                        isActive 
                        ? getSubCategoryFilters(mainCategory.categories) 
                        : null
                    }
                </div>
            )
        });
    }

    return categorySchema ? (
        <div
            style={{
                'border': '1px solid #efefef',
                'borderBottom': '0 solid #efefef',
                'marginBottom': '1.5rem'
            }}
        >
            { getCategoryFiltes() }
        </div>
    ): null;
};

export default CategoryFilter;