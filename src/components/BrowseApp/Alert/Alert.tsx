import React, { FC, useEffect, useRef } from 'react'
import { AlertType } from '../../../store/browseApp/reducers/UI'

type Props = {
    type: AlertType;
    onClose: ()=>void;
}

const data:Record<AlertType, {
    title: string, 
    message: string
}> = {
    'hitMaxNumOfItemsInMyCollection': {
        title: 'Maximum Limit Reached',
        message: 'You have reached the maximum limit of items that can be added to your collection. You will not be able to add any further items until you remove some of the existing ones.'
    }
}

const Alert:FC<Props> = ({
    type,
    onClose
}) => {

    const alertRef = useRef<any>()

    const { title, message } = data[type] || {}

    useEffect(()=>{
        alertRef.current.addEventListener('calciteAlertClose', ()=>{
            // console.log('closed')
            onClose()
        })
    }, [])

    return (
        <calcite-alert 
            ref={alertRef} 
            icon="maximum" 
            kind="danger" 
            open 
            auto-close  
            auto-close-duration="slow" 
            label="A report alert"
        >
            <div slot="title">{title}</div>
            <div slot="message">{message}</div>
        </calcite-alert>
    )
}

export default Alert