import './styles/index.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { SiteContextProvider } from './contexts/SiteContextProvider';
import PolicyMapsSite from './pages';
import EsriOAuth from './utils/Esri-OAuth';

import { Tier } from './AppConfig';

const init = async()=>{

    const esriOAuthUtils = new EsriOAuth({
        appId: Tier.PROD.OAUTH_APPID
    });
    
    await esriOAuthUtils.init();

    ReactDOM.render(
        <SiteContextProvider 
            esriOAuthUtils={esriOAuthUtils}
        >
            <PolicyMapsSite />
        </SiteContextProvider>, 
        document.getElementById('root')
    );
};

init();

