import React, { useEffect, useRef } from 'react';
import CancleIcon from '../../icons/CancelIcon';

import '../../styles/components/Popup.css';

const PopupDelField = ({ placeholder, value, onChange, id, legend, onClick }) => {

    const delFieldRef = useRef(null);

    useEffect(() => {
        if (delFieldRef.current) {
            delFieldRef.current.style.height = "auto";
            delFieldRef.current.style.height = `${delFieldRef.current.scrollHeight}px`;
        }
    }, [value]);


    return (
        <>
            <div className="Popup-del-container">
                <div className='Popup-del-wrapper'>
                    <fieldset className='Popup-del-fieldset-container'>
                        <legend className='Popup-fieldset-legend'>{legend}</legend>
                        <textarea
                            id={id}
                            rows={1}
                            ref={delFieldRef}
                            placeholder={placeholder}
                            value={value}
                            onChange={onChange}
                            style={{ overflow: "hidden", resize: "none" }}
                        />
                        <button
                            className='Popup-del-cancel'
                            type='button'
                            onClick={onClick}
                        >
                            <CancleIcon width='24px' />
                        </button>
                        <span>
                        </span>
                    </fieldset>
                </div>
            </div>
        </>
    );
};

export default PopupDelField;