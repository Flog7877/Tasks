import React, { Children, useEffect, useState } from 'react';
import '../../styles/components/Popup.css';

const Popup = ({ toggle, handler, title, buttonTitle, children }) => {
    return (
        <>
            <div className="Popup-overlay" onClick={toggle}>
                <div
                    className="General-popup"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className='Popup-container'>
                        <div className='Popup-wrapper'>
                            <form className="Popup-form" onSubmit={handler} >
                                <p className="Popup-form-title">{title}</p>
                                {children}
                                <button type="submit" className="Popup-submit">
                                    {buttonTitle}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Popup;