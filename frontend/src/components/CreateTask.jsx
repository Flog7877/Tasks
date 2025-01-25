import React, { useEffect, useState } from 'react';
import { todosAPI, categoriesAPI } from '../api';
import '../styles/components/CreateTask.css'

const CreateTask = ({ toggle }) => {

    const handleCreateTask = () => {
        console.log('Submit wurde gedrückt.')
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
                                    Das ist ein Test
                                </p>
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