import * as React from 'react';

import {
    AgolItem
} from '../../utils/arcgis-online-item-formatter';

interface Props {
    data: AgolItem[]
};

const CardList:React.FC<Props> = ({
    data
})=>{
    
    const getCards = ()=>{

        return data.map((d, i)=>{

            const {
                title,
                snippet,
                owner,
                thumbnailUrl,
                agolItemUrl,
                itemIconUrl,
                typeDisplayName,
                id
            } = d;

            const ownerProfileUrl = `//www.arcgis.com/home/search.html?q=owner:${owner}`;

            return (
                <div
                    key={`list-card-${id}`}
                    className='trailer-1'
                    style={{
                        'boxShadow': '0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 16px 0 rgba(0, 0, 0, 0.05)',
                        'display': 'flex',
                        'justifyContent': 'flex-start',
                        'alignContent': 'stretch',
                        'alignItems': 'stretch'
                    }}
                >
                    <div
                        style={{
                            'width': '30%',
                            'maxWidth': '230px',
                            'backgroundImage': `url(${thumbnailUrl})`, 
                            'backgroundSize': 'cover',
                            'backgroundRepeat': 'no-repeat'
                        }}
                    ></div>

                    <div
                        style={{
                            'flexGrow': 1,
                            'flexShrink': 0,
                            'flexBasis': '200px',
                            'boxSizing': 'border-box',
                            'padding': '.5rem 1rem'
                        }}
                    >
                        <div className='trailer-half text-ellipsis'>
                            <a className='link-darkest-gray font-size-0' href={agolItemUrl} target='_blank'>{title}</a>
                        </div>

                        <div className='font-size--3 trailer-half'>
                            <img 
                                className="margin-right-half"
                                src={itemIconUrl}  
                                style={{
                                    'width': '16px',
                                    'height': '16px',
                                    'verticalAlign': '-3px'
                                }}
                            />
                            <span>{typeDisplayName} by </span>
                            <a href={ownerProfileUrl} target='_blank'>{owner}</a>
                        </div>

                        <div
                            style={{
                                'minHeight': '60px'
                            }}
                        >
                            <p className='font-size--3 text-dark-gray trailer-quarter'>{snippet}</p>
                        </div>
                        
                    </div>
                </div>
            );
        });
    };

    return data && data.length ? (
        <div>{ getCards() }</div>
    ) : null;
};

export default CardList;