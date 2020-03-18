import * as React from 'react';

import {
    getCategorySchema
} from '../../utils/category-schema-manager';

import { Tier } from '../../AppConfig';

const BrowseApp:React.FC<{}>= ()=>{

    React.useEffect(()=>{

        (async function fetch(){
            const categorySchema = await getCategorySchema({ agolGroupId: Tier.PROD.AGOL_GROUP_ID });
            console.log(categorySchema)
        })();

    }, []);

    return (
        <></>
    );
};

export default BrowseApp;