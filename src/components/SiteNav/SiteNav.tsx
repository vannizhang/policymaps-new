import './style.scss';
import React from 'react';
// import Drawer, { SiteNavDrawerID } from './Drawer';
// import * as calcite from 'calcite-web/dist/js/calcite-web.min.js'

export interface NavLinkData {
    label: string;
    path: string;
    isActive?: boolean;
};

interface Props {
    siteName: string;
    links: NavLinkData[]
}

export const getNavLinksData = (links:NavLinkData[]):NavLinkData[]=>{

    const pathnames = window.location.pathname
        .split('/')
        .filter(d=>d);
    // pathname of the current page
    const currentPath = pathnames[pathnames.length - 1];

    return links.map((d, i)=>{

        const targetPathnames = d.path
            .split('/')
            .filter(d=>d);

        const isActive = currentPath === targetPathnames[targetPathnames.length - 1];

        return {
            ...d,
            isActive
        };
    });
}

const SiteNav: React.FC<Props> = ({
    siteName = '',
    links = []
}: Props)=>{

    const navLinksData = React.useMemo(()=>getNavLinksData(links), [links]);

    const getMenuToggleBtn4MobileDevice = ()=>{
        return (
            <div className='tablet-show text-white cursor-pointer' 
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onClick={()=>{
                    // calcite.bus.emit('drawer:open', { id: SiteNavDrawerID })
                }}
            >
                <svg viewBox="0 0 32 32" height="32" width="32" fill="#fff">
                    <path d="M28 7H4V6h24zm0 9H4v1h24zm0 10H4v1h24z"/>
                    <path fill="none" d="M0 0h32v32H0z"/>
                </svg>
            </div>
        )
    }

    return (
        <>
            <div className='esri-sub-nav-wrapper'>
                <nav className='esri-sub-nav'>
                    <div className="grid-container">
                        <div className="column-24">
                            <div className='esri-sub-nav-items-container'>

                                <div className='esri-sub-nav-title'>
                                    <a className='link-white' href='../'> { siteName } </a>
                                </div>

                                <div className='esri-sub-nav-link-list tablet-hide'>
                                    { 
                                        navLinksData.map((d)=>{
                                            return (
                                                <div className='esri-sub-nav-link-item' key={d.label}>
                                                    <a 
                                                        className='esri-sub-nav-link' 
                                                        href={d.path}
                                                        data-is-current={d.isActive}
                                                    > 
                                                        { d.label } 
                                                    </a>
                                                </div>
                                            );
                                        })
                                    }
                                </div>

                                { getMenuToggleBtn4MobileDevice() }
                            </div>
                        </div>
                    </div>
                </nav>
            </div>

            {/* <Drawer links={navLinksData} /> */}
        </>
    )
};

export default SiteNav;