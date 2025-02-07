import React, { useState, useEffect, useRef } from 'react';

import DateTimeInput from '../components/DateTimeInput';

import {
    CancleIcon,
    PlusIcon,
    UpArrowIcon,
    DownArrowIcon
} from '../icons/icons';

function isValidDate(date) {
    if (Object.prototype.toString.call(date) === "[object Date]") {
        if (isNaN(date.getTime())) {
            return false;
        }
        else {
            return true;
        }
    }
}

function Test() {

    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [currentNotificationDatetime, setCurrentNotificationDatetime] = useState('');
    const [notificationList, setCurrentNotificationList] = useState([]);

    const handleCancleNotification = (e) => {
        e.preventDefault(e);
        setShowNotificationModal(false);
        setCurrentNotificationDatetime('');
    }

    const handleAddNotification = (e) => {
        e.preventDefault();
        if (!isValidDate(currentNotificationDatetime)) {
            console.log('Datum ist nicht valide (angeblich)');
            return;
        }
        console.log('Datum ist gültig!');
    }



    return (
        <>
            <div
                style={{ width: '400px' }}
            >
                Benachrichtigung hinzufügen
                <DateTimeInput
                    width='calc(100% - 37px)'
                    onChange={(d) => setCurrentNotificationDatetime(d)}
                />
                <button
                    id='ct-add-notification'
                    className='addNotification-button'
                    type='button'
                    onClick={(e) => handleCancleNotification(e)}
                >
                    Abbrechen
                </button>
                <button
                    id='ct-cancle-notification'
                    className='cancleNotification-button'
                    type='button'
                    onClick={(e) => handleAddNotification(e)}
                >
                    Fertig
                </button>
            </div>
        </>
    );
};

export default Test;