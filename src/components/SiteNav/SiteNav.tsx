import './style.scss';
import * as React from 'react';

export interface NavLinkData {
    label: string;
    path: string;
    isActive?: boolean;
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

        return links.map((d, i)=>{

            return (
                <div className='esri-sub-nav-link-item' key={`sub-nav-link-${i}`}>
                    <a 
                        className='esri-sub-nav-link' 
                        href={d.path}
                        data-is-current={d.isActive}
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
                                <a className='link-white' href='/'> { siteName } </a>
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