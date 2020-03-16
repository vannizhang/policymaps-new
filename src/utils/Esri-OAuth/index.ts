import { loadModules } from 'esri-loader';

import IOAuthInfo from 'esri/identity/OAuthInfo';
import IIdentityManager from 'esri/identity/IdentityManager';
import IPortal from 'esri/portal/Portal';
import ICredential from 'esri/identity/Credential';

interface Props {
    appId: string;
    portalUrl?: string;
};

interface OAuthResponse {
    credential: ICredential;
    portal: IPortal;
}

export default class OAuthUtils {

    private appId: string;
    private portalUrl: string;

    private oauthInfo: IOAuthInfo;
    private esriId: any;
    private userPortal: IPortal;

    constructor(props: Props) {
        this.appId = props.appId;
        this.portalUrl = props.portalUrl || 'https://www.arcgis.com';
    }

    async init(): Promise<OAuthResponse> {
        try {
            type Modules = [
                typeof IOAuthInfo,
                typeof IIdentityManager,
                typeof IPortal
            ];

            const [ OAuthInfo, IdentityManager, Portal ] = await (loadModules([
                'esri/identity/OAuthInfo',
                'esri/identity/IdentityManager',
                'esri/portal/Portal',
            ]) as Promise<Modules>);

            this.oauthInfo = new OAuthInfo({
                appId: this.appId,
                portalUrl: this.portalUrl,
                popup: false,
            });

            IdentityManager.useSignInPage = false;

            IdentityManager.registerOAuthInfos([this.oauthInfo]);

            this.esriId = IdentityManager;

            const credential: ICredential = await this.esriId.checkSignInStatus(
                this.oauthInfo.portalUrl + '/sharing'
            );

            // init paortal
            this.userPortal = new Portal({ url: this.portalUrl });
            // Setting authMode to immediate signs the user in once loaded
            this.userPortal.authMode = 'immediate';

            // Once loaded, user is signed in
            await this.userPortal.load();

            console.log('credential', credential);
            console.log('portal', this.userPortal);

            return {
                credential,
                portal: this.userPortal
            };

        } catch (err) {
            console.log('anomynous user');
        }

        return null;
    }

    sigIn() {
        console.log(this);
        this.esriId
            .getCredential(this.oauthInfo.portalUrl + '/sharing')
            .then((res: ICredential) => {
                console.log('signed in as', res.userId);
            });
    };

    signOut() {
        this.esriId.destroyCredentials();
        window.location.reload();
    };

    // get the user data object to populate Esri Global Nav
    getUserData(){
        if(!this.userPortal){
            return null;
        }

        const { user, name } = this.userPortal;
        
        const { 
            fullName,
            username,
            thumbnailUrl
        } = user;

        return {
            // 	name: 'Cassidy Bishop',
            name: fullName,
            // 	id: 'iamoktatester@gmail.com',
            id: username,
            // 	group: 'Riverside City Mgmt.',
            group: name,
            // 	image: '//placehold.it/300x300'
            image: thumbnailUrl
        }
    }
}