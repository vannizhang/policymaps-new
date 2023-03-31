import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { activeAlertUpdated, selectActiveAlert } from '../../../store/browseApp/reducers/UI'
import Alert from './Alert'

const AlertContainer = () => {
    const dispatch = useDispatch()

    const activeAlert = useSelector(selectActiveAlert)

    if(!activeAlert){
        return null;
    }

    return (
        <Alert 
            type={activeAlert}
            onClose={()=>{
                dispatch(activeAlertUpdated(null))
            }}
        />
    )
}

export default AlertContainer