import React, { useState, useEffect, useRef } from 'react';

import DateTimeInput from '../components/DateTimeInput';
import Popup from '../components/Popup/Popup';
import '../styles/components/NotificationModal.css';

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
    const [recurrence, setRecurrence] = useState('none');
    const [endDate, setEndDate] = useState('');
    const [notificationList, setCurrentNotificationList] = useState([]);

    //

    const [modalOpen, setModalOpen] = useState(false);
    const [isCreateTask, setIsCreateTask] = useState(false);

    const toggleCreatTask = () => {
        setIsCreateTask(!isCreateTask);
        setModalOpen(!modalOpen);
    }

    //

    const handleCancleNotification = (e) => {
        e.preventDefault(e);
        setShowNotificationModal(false);
        setCurrentNotificationDatetime('');
    }

    const handleChangeRecurrence = (e) => {
        e.preventDefault
        const mode = e.target.value;
        setRecurrence(mode);
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
                className='CreateTask-button'
                onClick={toggleCreatTask}
            >
                Benachrichtigung hinzufügen
            </div>
            {isCreateTask && (
                <Popup
                    toggle={toggleCreatTask}
                    mode='display'
                    title='Benachrichtigung'
                    width='300px'
                    zIndex={900}
                    content={
                        <>
                            <div>
                                <DateTimeInput
                                    enablePast={false}
                                    width='calc(100% - 35px)'
                                    onChange={(d) => setCurrentNotificationDatetime(d)}
                                />
                            </div>
                            <div className='ct-notif-rec'>
                                <strong>Recurrence</strong>&nbsp;&nbsp;
                                <select
                                    value={recurrence}
                                    onChange={(e) => handleChangeRecurrence(e)}
                                >
                                    <option value='none'>Einmalig</option>
                                    <option value='daily'>Täglich</option>
                                    <option value='weekly'>Wöchentlich</option>
                                    <option value='monthly'>Monatlich</option>
                                </select>
                            </div>
                            {recurrence !== 'none' && (
                                <div className='ct-notif-enddate'>
                                    <strong>Enddatum</strong>&nbsp;&nbsp;
                                    <DateTimeInput
                                        enablePast={false}
                                        timeInput={false}
                                        width='fit-content'
                                        customClass='notificationModal rec'
                                        onChange={(e) => setEndDate(e)}
                                    />
                                </div>
                            )}
                            <div className='ct-notif-buttons'>
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
                    }
                />
            )}
        </>
    );
};

export default Test;