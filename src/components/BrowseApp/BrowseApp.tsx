import * as React from 'react';

import { getCategorySchema } from '../../utils/category-schema-manager';

import ArcGISOnlineGroupData from '../../utils/arcgis-online-group-data';

import { Tier } from '../../AppConfig';

const BrowseApp:React.FC<{}>= ()=>{

    let agolGroupData:ArcGISOnlineGroupData;

    React.useEffect(()=>{

        (async function fetch(){

            const categorySchemaRes = await getCategorySchema({ 
                agolGroupId: Tier.PROD.AGOL_GROUP_ID 
            });
            // console.log(categorySchemaRes);

            agolGroupData = new ArcGISOnlineGroupData({
                groupId: Tier.PROD.AGOL_GROUP_ID,
                categorySchema: categorySchemaRes[0]
            });

            const searchRes = await agolGroupData.search();
            // console.log(searchRes);

        })();

    }, []);

    return (
        <></>
    );
};

export default BrowseApp;