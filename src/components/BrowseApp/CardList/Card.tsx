import * as React from 'react';
import classnames from 'classnames';
import { stringFns } from 'helper-toolkit-ts';
import { AgolItem } from '../../../utils/arcgis-online-group-data';

interface Props {
    title: string;
    link: string;
    description: string;
    itemId: string;
    imageUrl: string;
    item?: AgolItem;

    viewOnMap?: boolean;
    isInCollection?: boolean;
    isMyFav?:boolean;

    viewBtnOnClick: (item:AgolItem)=>void;
    toggleCollectBtnOnClick: (item:AgolItem)=>void;
    toggleAsMyFavBtnOnClick: (item:AgolItem)=>void;
}

const RegularCard:React.FC<Props> = ({
    title,
    link,
    description,
    itemId,
    imageUrl,
    item,

    viewOnMap=false,
    isInCollection=false,
    isMyFav=false,

    viewBtnOnClick,
    toggleCollectBtnOnClick,
    toggleAsMyFavBtnOnClick
}: Props)=>{

    const getMyFavIcon = ()=>{
        return (
            <div
                style={{
                    'position': 'absolute',
                    'display': 'flex',
                    'justifyContent': 'center',
                    'alignItems': 'center',
                    'top': '.3rem',
                    'right': '.3rem',
                    // 'padding': '.25rem',
                    'height': '20px',
                    'width': '20px',
                    'backgroundColor': 'rgba(0, 0, 0, 0.4)',
                    'borderRadius': '50%',
                    'fill': isMyFav ? '#ffee33' : 'rgba(255, 255, 255, 0.9)',
                    'zIndex': 5,
                    'boxSizing': 'border-box'
                }}
                className='cursor-pointer'
                title={ isMyFav ? 'Remove from Favorites' : 'Add to Favorites'}
                onClick={toggleAsMyFavBtnOnClick.bind(this, item)}
            >
                <svg 
                    height="16" 
                    width="16" 
                    viewBox="0 0 16 16">
                    <path d="M7.998.2l1.885 5.816h6.094l-4.93 3.586 1.894 5.813-4.943-3.597-4.944 3.597 1.893-5.813-4.97-3.586h6.135z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className='card' style={{
            position: 'relative',
            height: '100%'
        }}>
            { getMyFavIcon() }

            <figure 
                className="card-image-wrap" 
                style={{
                    cursor: "pointer"
                }}
                onClick={viewBtnOnClick.bind(this, item)}
            >
                <img className="card-image" src={imageUrl} />
            </figure>

            <div className='card-content'>
                <div>
                    <p className="font-size--1 trailer-quarter">
                        <a href={link} target="_blank">{stringFns.trunc(title, 50, true)}</a>
                    </p>

                    <p className="font-size--3 trailer-half">
                        { description ? stringFns.trunc(description, 75, true) : '' }
                    </p>
                </div>

                <div style={{
                    "marginTop": "auto",
                    "display": "flex",
                    "flexDirection": "row",
                    "flexWrap": "nowrap",
                    "justifyContent": "flex-start",
                    "alignContent": "stretch",
                    "alignItems": "stretch"
                }}>
                    <div 
                        className={classnames('btn btn-small text-center', {
                            'btn-clear': !viewOnMap
                        })}
                        style={{
                            "width": "48%",
                            "margin": "0 .1rem",
                        }}
                        onClick={viewBtnOnClick.bind(this, item)}
                    >View</div>

                    <div 
                        className={classnames('btn btn-small text-center', {
                            'btn-clear': !isInCollection
                        })}
                        style={{
                            "width": "48%",
                            "margin": "0 .1rem"
                        }}
                        onClick={toggleCollectBtnOnClick.bind(this, item)}
                    >
                        { 
                            isInCollection 
                            ? 'Remove' 
                            : 'Collect' 
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegularCard;