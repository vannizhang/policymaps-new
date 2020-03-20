import * as React from 'react';

import { AgolItem } from '../../utils/arcgis-online-group-data';

interface Props {
    title: string;
    data: AgolItem[];
    itemCount: number;
};

const CardList: React.FC<Props> = ({
    title = '',
    data = [],
    itemCount = 0
}:Props)=>{

    const [ isHide, setIsHide ] = React.useState<boolean>(false);

    const toggleList = ()=>{
        setIsHide(!isHide);
    };

    const getList = ()=>{
        const cards = data.map((item, index)=>{
            return ( 
                <div key={`list-item-${index}`}>{item.title}</div> 
            );
        });

        return (
            <div className='card-list'>{ cards }</div>
        );
    };

    return (
        <>
            <div style={{
                'display': 'flex',
                'alignItems': 'center'
            }}> 
                <div className='font-size--3' onClick={toggleList}>
                    {
                        !isHide 
                        ? <span className="icon-ui-minus"></span> 
                        : <span className="icon-ui-plus"></span>
                    }
                </div>
                
                <span className="avenir-demi font-size--2">{title} ({itemCount})</span>
            </div>
            { !isHide ? getList() : null }
        </>
        
    );
};

export default CardList;