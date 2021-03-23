import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SiteContext } from '../../contexts/SiteContextProvider';

import {
    toggleSidebar,
    hideSideBarSelectore
} from '../../store/browseApp/reducers/UI';
import { UIConfig } from './Config';

interface Props {
    width?: number;
    scrollToBottomHandler?:()=>void;
}

const SideBar:React.FC<Props> = ({
    width=UIConfig['side-bar-width'],
    scrollToBottomHandler,
    children
})=>{

    const dispatch = useDispatch();

    const { isMobile } = React.useContext(SiteContext);

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

    const getToogleBtnOnSide = ()=>{
        if(isMobile){
            return null;
        }

        const ExpandIcon = (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="svg-icon">
                <path d="M7 4h5l12 12-12 12H7l12-12L7 4z"/>
            </svg>
        );

        const CloseBtn = (
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" className="svg-icon">
                <path d="M25 28h-5L8 16 20 4h5L13 16l12 12z"/>
            </svg>
        );

        return (
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
                { hideSideBar ? ExpandIcon : CloseBtn }
            </div>
        )
    }

    const getCloseBtn4MobileView = ()=>{

        if(!isMobile){
            return null;
        }
        
        return(
            <div
                className='text-center'
                onClick={()=>{
                    dispatch(toggleSidebar())
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height="32" width="32">
                    <path d="M16 22.207l-9-9v-1.414l9 9 9-9v1.414z"/><path fill="none" d="M0 0h32v32H0z"/>
                </svg>
            </div>
        )
    }

    const getOpenBtn4MobileView = ()=>{

        if(!isMobile || !hideSideBar){
            return null;
        }

        return(
            <div
                className='text-center'
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    background: '#595959',
                    color: '#fff',
                    zIndex: 5,
                    padding: '.5rem 0',
                    boxShadow: 'rgb(0 0 0 / 10%) 0px 0px 0px 1px, rgb(0 0 0 / 5%) 0px 0px 16px 0px'
                }}
                onClick={()=>{
                    dispatch(toggleSidebar())
                }}
            >
                
                <span className='icon-ui-up'></span>
                <span>Show list of Items</span>
            </div>
        )
    }

    return (
        <>
            {
                !hideSideBar ? (
                    <div
                        ref={sidebarRef}
                        onScroll={onScrollHandler}
                        className='fancy-scrollbar'
                        style={{
                            "width": isMobile ? '100%' : width,
                            "boxSizing": "border-box",
                            "padding": "1rem",
                            "overflowY": "auto",
                            "boxShadow": "0 2px 6px rgba(0,0,0,.24)"
                        }}
                    >
                        { getCloseBtn4MobileView() }
                        { children }
                    </div> 
                ) : null
            }
            { getToogleBtnOnSide() }
            { getOpenBtn4MobileView() }
        </>
    );
};

export default SideBar;