import './styles/index.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { setDefaultOptions } from 'esri-loader';

import {
    setPortalData4MyFavItems
} from './utils/my-favorites/myFav';

import { SiteContextProvider } from './contexts/SiteContextProvider';
import PolicyMapsSite from './pages';
import EsriOAuth from './utils/Esri-OAuth';

import { Tier } from './AppConfig';

const init = async()=>{

    setDefaultOptions({
        version: '4.15'
    });

    const esriOAuthUtils = new EsriOAuth({
        appId: Tier.PROD.OAUTH_APPID
    });
    
    const { credential, portal } = await esriOAuthUtils.init();

    if( credential && portal ){
        const { token } = credential;
        const { favGroupId } = esriOAuthUtils.getUserData();

        setPortalData4MyFavItems({
            token,
            favGroupId
        });
    }

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

