import * as React from 'react';

import { 
    SearchResponse 
} from '../../utils/arcgis-online-group-data';

import {
    NavBtn
} from '..';

interface Props {
    searchResponse: SearchResponse,
    prevBtnOnClick: ()=>void;
    nextBtnOnClick: ()=>void;
};

const PageNav:React.FC<Props> = ({
    searchResponse,
    prevBtnOnClick,
    nextBtnOnClick
})=>{

    const getPageIndicator = ()=>{
        if(!searchResponse){
            return null
        }

        const { start, total } = searchResponse;

        const totalPages = total%10 === 0 ? total/10 : Math.floor(total/10) + 1;

        const currentPage = Math.floor(start/10) + 1;

        return (
            <span className='font-size--2 margin-right-1'>{`Page ${currentPage} of ${totalPages}`}</span>
        );
    }

    return searchResponse ? (
        <div
            style={{
                'display': searchResponse ? 'flex' : 'none',
                'justifyContent': 'flex-end',
                'alignItems': 'center',
            }}
        >
            { getPageIndicator() }

            <div style={{ padding: '0 .25rem' }}>
                <NavBtn 
                    direction='left'
                    onClick={prevBtnOnClick}
                    isDisabled={ searchResponse && searchResponse.start <= 1 }
                />
            </div>

            <div style={{ padding: '0 .25rem' }}>
                <NavBtn 
                    direction='right'
                    onClick={nextBtnOnClick}
                    isDisabled={ searchResponse && searchResponse.nextStart === -1  }
                />
            </div>

        </div>
    ) : null;
};

export default PageNav;