import React from 'react'
import { SiteContext } from '../../contexts/SiteContextProvider';

const WarningMessage = () => {
    const { isMobile } = React.useContext(SiteContext);
    const [isVisible, setIsVisible] = React.useState<boolean>(true);

    return isMobile && isVisible ? (
        <div className="js-modal modal-overlay is-active">
            <div className="modal-content column-6" role="dialog" aria-labelledby="modal">

                <p>Best viewed on a tablet or PC browser.</p>

                <div className="text-right">
                    <button className="btn" onClick={setIsVisible.bind(this, false)}>Close</button>
                </div>
            </div>
        </div>
    ) : null;
}

export default WarningMessage
