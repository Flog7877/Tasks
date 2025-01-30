import React, { useEffect, useState } from 'react';

import '../../styles/components/Popup.css';

const PopupInputfield = ({ type, placeholder, value, onChange }) => {


    return (
        <>
            <div className="Popup-input-container">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required
                />
                <span>
                </span>
            </div>

        </>
    );
};

export default PopupInputfield;