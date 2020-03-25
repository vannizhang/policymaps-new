import * as React from 'react';

interface Props {
}

const TopNav:React.FC<Props> = ({
    children
})=>{

    const getStyle = ():React.CSSProperties=>{

        return {
            'position': 'absolute',
            'top': '15px',
            'right': '20px',
            'left': '65px',
            'height': '63px',
            'display': 'flex',
            'justifyContent': 'flex-start',
            'alignContent': 'strech',
            'alignItems': 'center',
            'background': '#fff',
            'boxShadow': '0 2px 6px rgba(0, 0, 0, 0.2)',
            'zIndex': 5
        };
    };

    return (
        <div
            style={getStyle()}
        >
            { children }
        </div>
    );
};

export default TopNav;