import React, { Children, useEffect, useState, useRef } from 'react';
import '../../styles/components/Popup.css';
import useIsMobile from '../../hooks/useIsMobile';

/**
 * 
 * @param {Object} Popup
 * @param {function} Popup.toggle - Funkktion, die das Popup ein/ ausblendet
 * @param {'form' | 'display'} Popup.mode - Gibt die Popup-Art an
 * @param {function} Popup.handler - onSubmit-Funktion 
 * @param {string} Popup.title - Titel der Form 
 * @param {string} Popup.buttonTitle - Titel des onSubmit-Buttons 
 * @param {*} Popup.content -Inhalt des Popups/ der Form  
 * @param {string} Popup.width - Fixed Width
 * @param {number} Popup.zIndex - Legt den z-Index des Popups fest. 
 * @param {string} Popup.maxHeight - Maximale Höhe des Popups, bezieht sich im form-Mode auf den content (-186px)
 * @returns 
 */
const Popup = ({ toggle, mode, width, maxHeight, zIndex, handler, title, buttonTitle, content }) => {

    return (
        <>
            <div 
            className="Popup-overlay"
            onClick={toggle}
            style={{ zIndex: `${!!zIndex? zIndex : '500'}`}}
            >
                <div
                    className="General-popup"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className='Popup-container'>
                        <div className='Popup-wrapper'>
                            {mode === 'form' && (<form
                                className="Popup-form"
                                onSubmit={handler}
                                style={{ width: `${!!width ? width : ''}` }}
                            >
                                <p className="Popup-form-title">{title}</p>
                                <div
                                    className={`Popup-form-content`}
                                    style={{ maxHeight: `${!!maxHeight ? maxHeight : ''}` }}
                                >
                                    {content}
                                </div>
                                <button type="submit" className="Popup-submit">
                                    {buttonTitle}
                                </button>
                            </form>)}
                            {mode === 'display' && (
                                <div
                                    className='Popup-display-content'
                                    style={{
                                        width: `${!!width ? width : ''}`,
                                        maxHeight: `${!!maxHeight ? maxHeight : ''}`
                                    }}
                                >
                                    {!!title && (<p className='Popup-diaplay-title'>{title}</p>)}
                                    {content}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Popup;