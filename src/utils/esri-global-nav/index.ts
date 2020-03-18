import './style.scss';
import globalNav from 'esri-global-nav';
import placeHolderUserThumbnail from './img/placeholder-user-thumb.jpg';

import menuData from './MenuData';

interface UserData {
    name: string;
    id: string;
    group: string;
    image: string;
}

interface initEsriGlobalNavOptions {
    userData?: UserData;
    signIn?: ()=>void;
    signOut?: ()=>void;
}

const config = {
    header: {
        elementClassName: 'esri-header-barrier'
    },
    footer: {
        elementClassName: 'esri-footer-barrier'
    }
}

export const initEsriGlobalNav = ({
    userData = null,
    signIn = null,
    signOut = null
}: initEsriGlobalNavOptions)=>{

    if(userData && !userData.image){
        userData.image = placeHolderUserThumbnail;
    }

    menuData.header.account.user = userData || null;

    globalNav.create({
        headerElm: `.${config.header.elementClassName}`, 
        footerElm: `.${config.footer.elementClassName}`,
        menuData
    });

    const esriHeader = document.querySelector('.esri-header-barrier');

    if( signIn && signOut ){
        // init event handlers
        esriHeader.addEventListener("header:click:signin", ()=>{ 
            // console.log('sign out btn on click');
            signIn();
        });

        esriHeader.addEventListener("header:click:signout", ()=>{ 
            signOut();
        });
    }


};