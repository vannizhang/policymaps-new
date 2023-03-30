import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { itemCollectionSelector } from '../../../store/browseApp/reducers/itemCollections';
import { SiteContext } from '../../../contexts/SiteContextProvider';
import { batchAdd } from '../../../utils/my-favorites/myFav';
import { setMyFavItems } from '../../../store/browseApp/reducers/myFavItems';
import { showAddCollections2MyFavDialogToggled } from '../../../store/browseApp/reducers/UI';

const AddCollectionToMyFav = () => {

    const dispatch = useDispatch();

    const itemsCollection = useSelector(itemCollectionSelector);

    const { esriOAuthUtils } = useContext(SiteContext);

    // when true, the async task of adding items to my fav group is finished
    const [isFinished, setIsFinished] = useState(false);

    const closeDialog = ()=>{
        dispatch(showAddCollections2MyFavDialogToggled())
    }

    /**
     * open my favorites content page on ArcGIS Online
     * @returns 
     */
    const openMyFavoritesContentPage = ()=>{
        const portalBaseURL = esriOAuthUtils.getPortalBaseUrl()

        if(!portalBaseURL){
            return;
        }

        const targetURL = `${portalBaseURL}/home/content.html?view=list&sortOrder=desc&sortField=modified#favorites`

        window.open(targetURL, '_blank');

        closeDialog();
    }

    useEffect(()=>{
        (async()=>{
            if(!itemsCollection.length){
                closeDialog();
                return;
            }

            try {
                const itemIds = itemsCollection.map(d=>d.id);
                const myFavItems = await batchAdd(itemIds);
                // setMyFavItems(myFavItems);
                dispatch(setMyFavItems(myFavItems));
                setIsFinished(true)
            } catch(err){
                esriOAuthUtils.sigIn();
            }
        })()
    }, [])

    return (
        <calcite-modal close-button-disabled outside-close-disabled open scale="s">
            <div
                slot="header"
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <h4 style={{ marginBottom: 0 }}>Add map collection to Favorites</h4>
                </div>
                {
                    isFinished === true && (
                        <calcite-button
                            appearance="transparent"
                            color="neutral"
                            icon-start="x"
                            onClick={closeDialog}
                        />
                    )
                }
            </div>

            <div slot="content">
                { isFinished === false ?  (
                    <calcite-loader label="Saving Changes" text="Adding items to My Favorites"/>
                ) : (
                    <div>
                        <p className='trailer-0'>Maps in this collection were added to your Favorites.</p>
                    </div>
                )}
            </div>

            { isFinished === true && (
                <>
                    <calcite-button slot="secondary" width="full" appearance="outline" onClick={closeDialog}>
                        Close
                    </calcite-button>

                    <calcite-button slot="primary" width="full"
                        onClick={openMyFavoritesContentPage}
                        icon-end={'launch'}
                    >
                        Go To My Favorites
                    </calcite-button>
                </>
            )}
        </calcite-modal>
    )
}

export default AddCollectionToMyFav