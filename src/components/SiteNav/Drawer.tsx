import React from 'react'
import{ drawer } from 'calcite-web/dist/js/calcite-web.min.js'
import { NavLinkData } from './SiteNav'

export const SiteNavDrawerID = 'site-nav'

type Props = {
    links: NavLinkData[];
}

const Drawer:React.FC<Props> = ({
    links
}) => {

    React.useEffect(()=>{
        drawer();
    }, [])

    return (
        <div className="drawer drawer-right js-drawer" data-drawer={SiteNavDrawerID}>
            <nav className="drawer-nav" role="navigation">
            <aside className="side-nav">
                {
                    links.map((d)=>{
                        return (
                            <a 
                                className='side-nav-link' 
                                href={d.path}
                                data-is-current={d.isActive}
                            > 
                                { d.label } 
                            </a>
                        );
                    })
                }
            </aside>
            </nav>
        </div>
    )
}

export default Drawer
