import './style.scss';
import globalNav from 'esri-global-nav';

import menuData from './MenuData';

const config = {
    header: {
        elementClassName: 'esri-header-barrier'
    },
    footer: {
        elementClassName: 'esri-footer-barrier'
    }
}

export const initEsriGlobalNav = ()=>{

    globalNav.create({
        headerElm: `.${config.header.elementClassName}`, 
        footerElm: `.${config.footer.elementClassName}`,
        menuData
    });

};