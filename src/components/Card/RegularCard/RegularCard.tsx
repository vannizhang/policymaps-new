import * as React from 'react';

import classnames from 'classnames';
import { stringFns } from 'helper-toolkit-ts';

import { AgolItem } from '../../../utils/arcgis-online-group-data';

import { 
    BrowseAppContext 
} from '../../../contexts/BrowseAppProvider';

interface Props {
    title: string;
    link: string;
    description: string;
    itemId: string;
    imageUrl: string;
    item?: AgolItem;

    viewOnMap?: boolean;
    isInCollection?: boolean;
}

const RegularCard:React.FC<Props> = ({
    title,
    link,
    description,
    itemId,
    imageUrl,
    item,

    viewOnMap=false,
    isInCollection=false
}: Props)=>{

    const { setActiveWebmapItem, toggleFromItemCollections } = React.useContext(BrowseAppContext);

    const viewBtnOnClickHandler = ()=>{
        setActiveWebmapItem(item);
    };

    const selectBtnOnClickHandler = ()=>{
        toggleFromItemCollections(item);
    };

    return (
        <div className='card' style={{
            height: '100%'
        }}>
            <figure 
                className="card-image-wrap" 
                style={{
                    cursor: "pointer"
                }}
                onClick={viewBtnOnClickHandler}
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
                        onClick={viewBtnOnClickHandler}
                    >View</div>

                    <div 
                        className={classnames('btn btn-small text-center', {
                            'btn-clear': !isInCollection
                        })}
                        style={{
                            "width": "48%",
                            "margin": "0 .1rem"
                        }}
                        onClick={selectBtnOnClickHandler}
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