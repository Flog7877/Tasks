import React, { useEffect, useState } from 'react';
import { todosAPI, categoriesAPI } from '../api';
import '../styles/components/SimpleToggle.css'

const SimpleToggle = ({ initial, handler }) => {

    return (
        <div className='toggler-wrapper'>
            <div className="toggler">
                <input
                    id="toggler-notifications"
                    name="notification-toggle"
                    type="checkbox"
                    checked={initial}
                    onChange={handler}
                />
                <label htmlFor="toggler-notifications">
                    <svg className="toggler-on" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                        <polyline className="path check" points="100.2,40.2 51.5,88.8 29.8,67.5"></polyline>
                    </svg>
                    <svg className="toggler-off" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                        <line className="path line" x1="34.4" y1="34.4" x2="95.8" y2="95.8"></line>
                        <line className="path line" x1="95.8" y1="34.4" x2="34.4" y2="95.8"></line>
                    </svg>
                </label>
            </div>
        </div>
    );
};

export default SimpleToggle;