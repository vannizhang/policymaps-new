import * as React from 'react';

import { getCategorySchema } from '../../utils/category-schema-manager';

import AgolGroupData from '../../utils/AGOL-Group-Data';

import { Tier } from '../../AppConfig';

const BrowseApp:React.FC<{}>= ()=>{

    let agolGroupData:AgolGroupData;

    React.useEffect(()=>{

        (async function fetch(){

            const categorySchemaRes = await getCategorySchema({ 
                agolGroupId: Tier.PROD.AGOL_GROUP_ID 
            });
            // console.log(categorySchemaRes);

            agolGroupData = new AgolGroupData({
                groupId: Tier.PROD.AGOL_GROUP_ID,
                categorySchema: categorySchemaRes[0]
            });

            const searchRes = await agolGroupData.search(30);
            // console.log(searchRes);

        })();

    }, []);

    return (
        <></>
    );
};

export default BrowseApp;