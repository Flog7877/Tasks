import React, { useEffect, useState } from 'react';

import '../../styles/components/Popup.css';

const PopupNumberInput = ({ legend, placeholder, value, onChange }) => {


    return (
        <>
            <div className='Popup-fieldset-wrapper'>
                <fieldset className='Popup-fieldset-container'>
                    <legend className='Popup-fieldset-legend'>{legend}</legend>
                    <input
                        type='number'
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        required
                    />
                </fieldset>
            </div>
        </>
    );
};

export default PopupNumberInput;