import * as React from 'react';

import { 
    CategorySchemaDataItem,
    CategorySchemaMainCategory,
    CategorySchemaSubCategory
} from '../../utils/category-schema-manager';

interface Props {
    categorySchema: CategorySchemaDataItem;
};

interface SelectedCategory {
    title: string;
    subcategories: string[];
}

const CategoryFilter:React.FC<Props> = ({
    categorySchema
})=>{

    // active main catgeory that displays the all subcategory options
    const [ activeMainCategoryTitle, setActiveMainCategoryTitle ] = React.useState<string>();

    const [ selectedCategory, setSelectedCategory ] = React.useState<SelectedCategory>({
        title: '',
        subcategories: []
    });

    const toggleMainCategory = (mainCategoryTitle:string)=>{
        const newVal = mainCategoryTitle !== activeMainCategoryTitle 
            ? mainCategoryTitle 
            : '';

        setActiveMainCategoryTitle(newVal);
    };

    const toggleSubcategory = (mainCategory:CategorySchemaMainCategory, subcategoryTitle?:string)=>{

        if(mainCategory.title !== selectedCategory.title){

            setSelectedCategory({
                title: mainCategory.title,
                subcategories: [subcategoryTitle]
            });

            return;
        }

        const index = selectedCategory.subcategories.indexOf(subcategoryTitle);

        const newValues:string[] = [...selectedCategory.subcategories];
        
        if(index === -1){
            newValues.push(subcategoryTitle)
        } else {
            newValues.splice(index, 1);
        }

        setSelectedCategory({
            title: mainCategory.title,
            subcategories: newValues
        });
    };

    const getSubCategoryFilters = (mainCategory:CategorySchemaMainCategory)=>{

        const style = {
            'padding': '.1rem 0'
        } as React.CSSProperties;

        const filters = mainCategory.categories.map((subcategory, index)=>{

            const selected = (
                selectedCategory &&
                selectedCategory.title === mainCategory.title && 
                selectedCategory.subcategories.indexOf(subcategory.title) > -1 
            );

            const checkboxClass = selected ? 'icon-ui-checkbox-checked' : 'icon-ui-checkbox-unchecked'

            return (
                <div 
                    key={`subcategory-filter-${index}`}
                    style={style}
                >
                    <span 
                        className={`${checkboxClass} font-size--2`}
                        onClick={toggleSubcategory.bind(this, mainCategory, subcategory.title)}
                    ></span>
                    <span className='font-size--2'>{ subcategory.title }</span>
                </div>
            );
        });

        return (
            <div style={{
                'padding': '.25rem 0'
            }}>
                <div style={style} >
                    <span 
                        className={`${'icon-ui-checkbox-unchecked'} font-size--2`}
                        onClick={toggleSubcategory.bind(this, mainCategory, 'all')}
                    ></span>
                    <span className='font-size--2'>All</span>
                </div>

                { filters }
            </div>
        );
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
                        ? getSubCategoryFilters(mainCategory) 
                        : null
                    }
                </div>
            )
        });
    }

    React.useEffect(()=>{
        console.log('selectedCategory', selectedCategory);
    }, [selectedCategory])

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