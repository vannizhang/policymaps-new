import './style.scss';
import * as React from 'react';

export interface NavLinkData {
    label: string;
    path: string;
};

interface Props {
    siteName: string;
    links: NavLinkData[]
}

const SiteNav: React.FC<Props> = ({
    siteName = '',
    links = []
}: Props)=>{

    const getNavLinks = ()=>{

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

            return (
                <div className='esri-sub-nav-link-item' key={`sub-nav-link-${d.path}`}>
                    <a 
                        className='esri-sub-nav-link' 
                        href={d.path}
                        data-is-current={isActive}
                    > 
                        { d.label } 
                    </a>
                </div>
            );
        });
    };

    return (
        <div className='esri-sub-nav-wrapper'>
            <nav className='esri-sub-nav'>
                <div className="grid-container">
                    <div className="column-24">
                        <div className='esri-sub-nav-items-container'>

                            <div className='esri-sub-nav-title'>
                                <a className='link-white' href='../'> { siteName } </a>
                            </div>

                            <div className='esri-sub-nav-link-list'>
                                { getNavLinks() }
                            </div>

                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
};

export default SiteNav;