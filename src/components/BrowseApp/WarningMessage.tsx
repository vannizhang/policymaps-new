import React from 'react'
import { SiteContext } from '../../contexts/SiteContextProvider';

const itemLey4HasSeenWarningMessage = 'policymaps.explore.seen_warning_message';

const hasSeenWarningMessage = localStorage.getItem(itemLey4HasSeenWarningMessage) !== null;

const WarningMessage:React.FC = () => {
    const { isMobile } = React.useContext(SiteContext);
    const [isVisible, setIsVisible] = React.useState<boolean>(isMobile);

    React.useEffect(()=>{
        // set has seen warning message to '1' to only show the warning message once
        if(isVisible){
            localStorage.setItem(itemLey4HasSeenWarningMessage, '1')
        }
    }, [])

    return isVisible ? (
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
