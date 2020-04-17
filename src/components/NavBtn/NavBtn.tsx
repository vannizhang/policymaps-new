import './style.scss';
import * as React from 'react';
import classnames from 'classnames';

type NavBtnDirection = 'left' | 'right';

interface Props {
    direction: NavBtnDirection;
    isDisabled?: boolean;
    solidBackground?: boolean;
    onClick?: ()=>void;
};

const NavBtn:React.FC<Props> = ({
    direction,
    isDisabled,
    solidBackground,
    onClick
})=>{

    const classNames = classnames('nav-btn', {
        'disabled': isDisabled,
        'solid-background': solidBackground
    })

    const getIcon = ()=>{
        return direction === 'left'
        ? <svg xmlns="http://www.w3.org/2000/svg" height='24' width='24' viewBox="0 0 24 24">
            <path d="M6.793 12l7-7h1.414l-7 7 7 7h-1.414z"/><path fill="none" d="M0 0h24v24H0z"/>
        </svg>
        : <svg xmlns="http://www.w3.org/2000/svg" height='24' width='24' viewBox="0 0 24 24">
            <path d="M8.793 5h1.414l7 7-7 7H8.793l7-7z"/><path fill="none" d="M0 0h24v24H0z"/>
        </svg>;
    };

    return (
        <div className={classNames}
            onClick={onClick}
        >
            { getIcon() }
        </div>
    );
};

export default NavBtn;