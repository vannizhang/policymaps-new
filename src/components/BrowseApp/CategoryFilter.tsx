import { IGroupCategory } from '@esri/arcgis-rest-portal';
import * as React from 'react';

interface Props {
    categorySchema: IGroupCategory;
    onChange: (data:SelectedCategory)=>void;
};

export interface SelectedCategory {
    title: string;
    subcategories: string[];
}

const CategoryFilter:React.FC<Props> = ({
    categorySchema,
    onChange
})=>{

    // active main catgeory that displays the all subcategory options
    const [ activeMainCategoryTitle, setActiveMainCategoryTitle ] = React.useState<string>();

    const [ selectedCategory, setSelectedCategory ] = React.useState<SelectedCategory>();

    const toggleMainCategory = (mainCategoryTitle:string)=>{
        const newVal = mainCategoryTitle !== activeMainCategoryTitle 
            ? mainCategoryTitle 
            : '';

        setActiveMainCategoryTitle(newVal);
    };

    const toggleAllSubcategories = (mainCategory:IGroupCategory)=>{

        const allSubcategories = mainCategory.categories.map(d=>d.title);

        if(!selectedCategory || mainCategory.title !== selectedCategory.title){

            setSelectedCategory({
                title: mainCategory.title,
                subcategories: allSubcategories
            });

            return;
        }

        const subcategories = (
            selectedCategory &&
            selectedCategory.subcategories.length !== mainCategory.categories.length
        ) ? allSubcategories : [];

        setSelectedCategory({
            title: subcategories.length ? mainCategory.title : '',
            subcategories
        });
    }

    const toggleSubcategory = (mainCategory?:IGroupCategory, subcategoryTitle?:string)=>{

        if( !selectedCategory ||
            selectedCategory.title !== mainCategory.title 
        ){

            setSelectedCategory({
                title: mainCategory.title,
                subcategories: [subcategoryTitle]
            });

            return;
        }

        const subcategories = toggleFromSelectedSubcategories(subcategoryTitle);

        setSelectedCategory({
            title: subcategories.length ? mainCategory.title : '',
            subcategories
        });
    };

    const toggleFromSelectedSubcategories = (subcategoryTitle:string)=>{
        const index = selectedCategory.subcategories.indexOf(subcategoryTitle);

        const newValues:string[] = [...selectedCategory.subcategories];
        
        if(index === -1){
            newValues.push(subcategoryTitle)
        } else {
            newValues.splice(index, 1);
        }

        return newValues;
    };

    const removeFromSubcategories = (subcategoryTitle:string)=>{

        const subcategories = toggleFromSelectedSubcategories(subcategoryTitle);

        setSelectedCategory({
            title: subcategories.length ? selectedCategory.title : '',
            subcategories
        });
    };

    const resetSelectedCategory = ()=>{
        setSelectedCategory({
            title: '',
            subcategories: []
        });
    }

    const getToggleSelectAllOption = (mainCategory:IGroupCategory)=>{

        const selected = (
            selectedCategory &&
            selectedCategory.title === mainCategory.title && 
            selectedCategory.subcategories.length === mainCategory.categories.length
        );

        const checkboxClass = selected ? 'icon-ui-checkbox-checked' : 'icon-ui-checkbox-unchecked';

        return (
            <div>
                <span 
                    className={`${checkboxClass} font-size--2`}
                    onClick={toggleAllSubcategories.bind(this, mainCategory)}
                ></span>
                <span className='font-size--2'>All</span>
            </div>
        );

    };

    const getSubCategoryFilters = (mainCategory:IGroupCategory)=>{

        const filters = mainCategory.categories.map((subcategory, index)=>{

            const selected = (
                selectedCategory &&
                selectedCategory.title === mainCategory.title && 
                selectedCategory.subcategories.indexOf(subcategory.title) > -1 
            );

            const checkboxClass = selected ? 'icon-ui-checkbox-checked' : 'icon-ui-checkbox-unchecked';

            return (
                <div key={`subcategory-filter-${subcategory.title}`}>
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
                { getToggleSelectAllOption(mainCategory) }
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
                    key={`category-filter-${mainCategory.title}`}
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

    const getChipsForSelectedCategories = ()=>{

        if(!selectedCategory || !selectedCategory.subcategories.length){
            return null;
        }

        const chipStyle = {
            'display': 'flex',
            'alignItems': 'center',
            'padding': '.25rem .5rem',
            'margin': '.25rem .35rem',
            'background': '#ccc',
            'borderRadius': '10px',
            'border': '1px solid rgba(149, 149, 149, 0.5)'
        } as React.CSSProperties;

        const chips = selectedCategory.subcategories.map((subcategory, index)=>{

            return (
                <div 
                    key={`subcategory-chip-${subcategory}`}
                    style={chipStyle}
                >
                    <span className='font-size--3'>{subcategory}</span>
                    <span className='icon-ui-close margin-left-half font-size--3'
                        style={{
                            'cursor': 'pointer'
                        }}
                        onClick={removeFromSubcategories.bind(this, subcategory)}
                    ></span>
                </div>
            );
        });

        return (
            <div className='leader-half'
                style={{
                    'display': 'flex',
                    'flexWrap': 'wrap'
                }}
            >
                { chips }

                <div className='btn btn-transparent' 
                    onClick={resetSelectedCategory}
                >
                    <span className='font-size--3'>Clear All</span>
                </div>
            </div>
        )

    };

    React.useEffect(()=>{
        // console.log('selectedCategory', selectedCategory);

        if(selectedCategory){
            onChange(selectedCategory);
        }

    }, [selectedCategory])

    return categorySchema ? (
        <>
            <div
                style={{
                    'border': '1px solid #efefef',
                    'borderBottom': '0 solid #efefef',
                    'marginBottom': '.5rem'
                }}
            >
                { getCategoryFiltes() }
            </div>

            { getChipsForSelectedCategories() }
        </>
    ): null;
};

export default CategoryFilter;