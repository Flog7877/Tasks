import React, { useEffect, useRef } from 'react';

import '../../styles/components/Popup.css';

const PopupTextArea = ({ placeholder, value, onChange }) => {

    const textAreaRef = useRef(null);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [value]);


    return (
        <>
            <div className="Popup-input-container">
                <textarea
                    ref={textAreaRef}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required
                    style={{ overflow: "hidden", resize: "none" }}
                />
                <span>
                </span>
            </div>

        </>
    );
};

export default PopupTextArea;