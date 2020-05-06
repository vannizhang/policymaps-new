import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    toggleSidebar,
    hideSideBarSelectore
} from '../../store/browseApp/reducers/UI';

interface Props {
    width?: number;
    scrollToBottomHandler?:()=>void;
}

const SideBar:React.FC<Props> = ({
    width=400,
    scrollToBottomHandler,
    children
})=>{

    const dispatch = useDispatch();

    const hideSideBar = useSelector(hideSideBarSelectore);

    const sidebarRef = React.createRef<HTMLDivElement>();

    const onScrollHandler = ()=>{

        if(!scrollToBottomHandler){
            return;
        }

        const sidebarDiv = sidebarRef.current;

        if( (sidebarDiv.scrollHeight - sidebarDiv.scrollTop) <= sidebarDiv.clientHeight ){
            // console.log('hit to bottom');
            scrollToBottomHandler();
        }
    };

    return (
        <>
            {
                !hideSideBar ? (
                    <div
                        ref={sidebarRef}
                        onScroll={onScrollHandler}
                        className='fancy-scrollbar'
                        style={{
                            "width": width,
                            "boxSizing": "border-box",
                            "padding": "1rem",
                            "overflowY": "auto",
                            "boxShadow": "0 2px 6px rgba(0,0,0,.24)"
                        }}
                    >
                        { children }
                    </div> 
                ) : null
            }
            <div 
                style={{
                    position: 'absolute',
                    top: '95px',
                    left: hideSideBar ? 0 : width,
                    width: '25px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.6)',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.24)',
                    zIndex: 5,
                    cursor: 'pointer',
                    color: '#fff'
                }}
                onClick={()=>{
                    dispatch(toggleSidebar())
                }}
            >
                {
                    hideSideBar 
                    ? <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="svg-icon"><path d="M7 4h5l12 12-12 12H7l12-12L7 4z"/></svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="svg-icon"><path d="M25 28h-5L8 16 20 4h5L13 16l12 12z"/></svg>
                }
            </div>
        </>
    );
};

export default SideBar;