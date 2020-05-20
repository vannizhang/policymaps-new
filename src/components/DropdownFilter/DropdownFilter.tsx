import * as React from 'react';
import classnames from 'classnames';
import shortid from 'shortid';

interface DataItem {
    label: string;
    value: string;
}

interface Props {
    title: string;
    data: DataItem[];
    expandedByDefault?: boolean;
    activeValueByDefault?: string;
    onChange: (value:string)=>void;
};

const DropdownFilter:React.FC<Props> = ({
    data,
    title,
    expandedByDefault,
    activeValueByDefault,
    onChange
})=>{

    const [ isExpanded, setIsExpanded ] = React.useState<boolean>(expandedByDefault || false);

    const [ activeValue, setActiveValue ]  = React.useState<string>(activeValueByDefault || '');

    const onClickHandler = (val:string)=>{
        const newVal = val !== activeValue ? val : '';
        setActiveValue(newVal);
        onChange(newVal);
    };

    const getHeader = ()=>{
        return (
            <div 
                className='cursor-pointer'
                style={{
                    'display': 'flex',
                    'alignItems': 'center',
                    'backgroundColor': '#f8f8f8',
                    'padding': '0.5rem 0.75rem'
                }}
                onClick={setIsExpanded.bind(this, !isExpanded)}
            >
                <div
                    style={{
                        'flexGrow': 1
                    }}
                >
                    <span className='font-size--1'>{title}</span>
                </div>
                
                {
                    isExpanded 
                    ? <span className='font-size--2 icon-ui-up'></span>
                    : <span className='font-size--2 icon-ui-down'></span>
                }
                
            </div>
        )
    };

    const getOptions = ()=>{

        if(!data || !data.length || !isExpanded){
            return null;
        }

        const options = data.map((d, i)=>{

            const { label, value } = d;

            const classNames = classnames('font-size--2', {
                'avenir-demi': value === activeValue
            });

            return (
                <div
                    key={`dropdown-filter-option-${shortid.generate()}`}
                    className='cursor-pointer'
                    onClick={onClickHandler.bind(this, value)}
                >
                    <span className={classNames}>{label}</span>
                </div>
            );

        });

        return (
            <div
                style={{
                    'padding': '0.5rem 0.75rem'
                }}
            >
                { options }
            </div>
        );
    };

    return (
        <div
            style={{
                'border': '1px solid #efefef',
                'boxSizing': 'border-box',
                'backgroundColor': '#fff'
            }}
        >
            { getHeader() }
            { getOptions() }
        </div>
    );
};

export default DropdownFilter;