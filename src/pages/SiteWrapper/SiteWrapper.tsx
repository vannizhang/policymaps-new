import '../../styles/index.scss';
import * as React from 'react';

import { setDefaultOptions } from 'esri-loader';

import {
    setPortalData4MyFavItems
} from '../../utils/my-favorites/myFav';

import { SiteContextProvider } from '../../contexts/SiteContextProvider';
import EsriOAuth from '../../utils/Esri-OAuth';
import { Tier } from '../../AppConfig';

const SiteWrapper:React.FC = ({
    children
})=>{

    const [ esriOAuthUtils, setEsriOAuthUtils ] = React.useState<EsriOAuth>();

    const init = async()=>{

        try {
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
    
            console.log(esriOAuthUtils);
    
            setEsriOAuthUtils(esriOAuthUtils);

        } catch(err){
            console.error(err);
        }

    }

    React.useEffect(()=>{
        init();
    }, []);

    return (
        <SiteContextProvider 
            esriOAuthUtils={esriOAuthUtils}
        >
            { esriOAuthUtils ? children : null }
        </SiteContextProvider>
    );
};

export default SiteWrapper;