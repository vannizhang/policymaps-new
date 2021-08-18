import * as React from 'react';

import { 
    CategorySchemaDataItem
} from '../../utils/category-schema-manager';

interface Props {
    categorySchema: CategorySchemaDataItem;
    activeMainCategoryTitle: string;
    defaultSubCategory? :string;
    onSelect?: (activeMainCategoryTitle:string, activeSubCategories:string[])=>void
}

const CategoryFilter:React.FC<Props> = ({
    categorySchema,
    activeMainCategoryTitle,
    defaultSubCategory,
    onSelect
})=>{

    const [ activeSubCategories, setActiveSubcategories ] = React.useState<string[]>([]);

    const selectAllSubcategories = ()=>{

        const activeCategory = categorySchema.categories
            .filter(category=>category.title === activeMainCategoryTitle)[0];

        const activeSubCategories = activeCategory.categories.map(d=>d.title);

        setActiveSubcategories(activeSubCategories);
    }

    const getOptions = ()=>{

        const activeCategory = categorySchema.categories
            .filter(category=>category.title === activeMainCategoryTitle)[0];

        if(!activeCategory){
            return null;
        }

        const optionBtnStyle = {
            'padding': '.5rem 1rem',
            'borderBottom': '1px solid #efefef',
            'cursor': 'pointer',
        } as React.CSSProperties;

        const borderLeftForActiveOption = '5px solid #0079c1';
        const borderLeftForDefaultOption = '5px solid #fff';

        const options = activeCategory.categories.map((subcategory, index)=>{

            const { title } = subcategory;

            return (
                <div
                    key={`catgeory-filter-option-${title}`}
                    style={{
                        ...optionBtnStyle,
                        'borderLeft': activeSubCategories.length === 1 && activeSubCategories[0] === title
                            ? borderLeftForActiveOption
                            : borderLeftForDefaultOption
                    }}
                    onClick={setActiveSubcategories.bind(this, [title])}
                >
                    <span>{title}</span>
                </div>
            );
        });

        return (
            <div 
                className='font-size--2'
                style={{
                    'border': '1px solid #efefef',
                    'borderBottom': '0 solid #efefef'
                }}
            >
                <div 
                    style={{
                        ...optionBtnStyle,
                        'borderLeft': activeCategory.categories.length === activeSubCategories.length 
                            ? borderLeftForActiveOption
                            : borderLeftForDefaultOption
                    }}
                    onClick={selectAllSubcategories}
                >
                    <span>All</span>
                </div>

                { options }
            </div>
        )
    }

    React.useEffect(()=>{

        if(categorySchema && activeMainCategoryTitle){

            if(defaultSubCategory && activeSubCategories.length === 0){
                setActiveSubcategories([defaultSubCategory])
            } else {
                selectAllSubcategories();
            }
            
        }

    }, [ categorySchema, activeMainCategoryTitle]);


    React.useEffect(()=>{

        if(activeSubCategories.length){
            onSelect(activeMainCategoryTitle, activeSubCategories);
        }

    }, [ activeSubCategories ]);

    return categorySchema && activeMainCategoryTitle ? (
        <div>{ getOptions() }</div>
    ) : null;
};

export default CategoryFilter;