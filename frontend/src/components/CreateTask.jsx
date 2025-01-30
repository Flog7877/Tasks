import React, { useEffect, useState } from 'react';
import { todosAPI, categoriesAPI } from '../api';
import '../styles/components/CreateTask.css'

import SimpleToggle from './SimpleToggle';
import MuiDateTimePicker from './DateTimePicker';

const CreateTask = ({ toggle }) => {

    const handleCreateTask = () => {
        console.log('Submit wurde gedrückt.')
    }

    const [toggleState, setToggleState] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleToggle = () => {
        setToggleState(!toggleState);
    }

    const handleDatePicker = (e) => {
        setSelectedDate(e);
        console.log(selectedDate);
        console.log(new Date(selectedDate.$d))
    }

    return (
        <>
            <div className="CreateTask-popup-overlay" onClick={toggle}>
                <div
                    className="CreataTask-popup"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className='CreateTask-container'>
                        <div className='CreateTask-wrapper'>
                            <form className="CreateTask-form" onSubmit={handleCreateTask} >
                                <p className="CreateTask-form-title">Aufgabe hinzufügen</p>
                                <p>
                                    Das ist ein Toggle: <SimpleToggle initial={toggleState} handler={handleToggle} />
                                </p>
                                {toggleState && (<div>
                                    <MuiDateTimePicker
                                        label="Deadline"
                                        value={selectedDate}
                                        onChange={(newValue) => handleDatePicker(newValue)}
                                    />
                                </div>)}
                                {/*<div className="-input-container">
                                    <input
                                        type="text"
                                        placeholder="Benutzername oder Email"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                    />
                                    <span>
                                    </span>
                                </div>
                                <div className="login-input-container">
                                    <input
                                        type="password"
                                        placeholder="Passwort"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>*/}
                                <button type="submit" className="CreateTask-submit">
                                    Hinzufügen
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default CreateTask;