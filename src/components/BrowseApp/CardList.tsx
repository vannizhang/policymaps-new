import * as React from 'react';

import { AgolItem } from '../../utils/arcgis-online-group-data';

interface Props {
    data: AgolItem[]
};

const CardList: React.FC<Props> = ({
    data = []
}:Props)=>{

    const getList = ()=>{
        return data.map((item, index)=>{
            return ( 
                <div key={`list-item-${index}`}>{item.title}</div> 
            );
        });
    };

    return (
        <div>{getList()}</div>
    );
};

export default CardList;