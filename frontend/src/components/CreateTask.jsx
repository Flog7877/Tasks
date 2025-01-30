import React, { useEffect, useState } from 'react';
import { todosAPI, categoriesAPI } from '../api';
//import '../styles/components/CreateTask.css'

import Popup from './Popup/Popup';
import PopupInputfield from './Popup/PopupInputfield';

import SimpleToggle from './SimpleToggle';
import MuiDateTimePicker from './DateTimePicker';
import PopupTextArea from './Popup/PopupTextArea';

const CreateTask = ({ toggle }) => {

    const handleCreateTask = () => {
        return;
    }

    const [toggleState, setToggleState] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDetails, setTaskDetails] = useState('')

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
            {/*<div className="CreateTask-popup-overlay" onClick={toggle}>
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
                                </div>*}
                                <button type="submit" className="CreateTask-submit">
                                    Hinzufügen
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>*/}
            <Popup
                toggle={toggle}
                handler={handleCreateTask}
                title={'Aufgabe hinzufügen'}
                buttonTitle={'Hinzufügen'}
                children={
                    <>
                        <PopupInputfield
                            type={'text'}
                            placeholder={'Titel'}
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                        />
                        <PopupTextArea 
                        rows={1}
                        placeholder={'Details...'}
                        value={taskDetails}
                        onChange={(e) => setTaskDetails(e.target.value)}
                        />
                        <p>
                            Das ist ein Test
                        </p>
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
                        <p>
                            Test
                        </p>

                    </>
                }
            />
        </>
    );
};

export default CreateTask;