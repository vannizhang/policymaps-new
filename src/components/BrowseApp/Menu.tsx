import * as React from 'react';

interface Props {
    toggleLegend?: ()=>void;
    isLegendVisible?: boolean;
}

const Menu:React.FC<Props> = ({
    toggleLegend,
    isLegendVisible
})=>{

    return (
        <div
            style={{
                'background': '#fff',
                'boxShadow': '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
        >
            <div
                style={{
                    'padding': '.5rem 1rem',
                    'borderTop': '1px solid #efefef',
                    'cursor': 'pointer'
                }}
                onClick={toggleLegend}
            >
                <span className={isLegendVisible ? "icon-ui-checkbox-checked" : "icon-ui-checkbox-unchecked"}></span>
                <span className='font-size--2'>Legend Widget</span>
            </div>
        </div>
    );
};

export default Menu;