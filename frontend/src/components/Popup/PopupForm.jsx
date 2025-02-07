import React, { Children, useEffect, useState, useRef } from 'react';
import '../../styles/components/Popup.css';
import useIsMobile from '../../hooks/useIsMobile';

/**
 * 
 * @param {*} PopupForm
 * @param {function} PopupForm.handler - handleSubmit-Funktion 
 * @param {string} PopupForm.title - Überschrift der Form 
 * @param {string} PopupForm.buttonTitle - Schrift auf dem Submit-Button 
 * @param {*} PopupForm.children - die Elemente der Form
 */
const PopupForm = ({ handler, title, buttonTitle, children }) => {

    const isMobile = useIsMobile();
    const contentRef = useRef(null);
    const [isScrollableTop, setIsScrollableTop] = useState(false);
    const [isScrollableBottom, setIsScrollableBottom] = useState(false);

    const popupStyle = isMobile ? {
        width: '90%'
    } : {
        width: '448px'
    };

    useEffect(() => {
        const el = contentRef.current;

        const checkScroll = () => {
            if (el) {
                setIsScrollableTop(el.scrollTop > 0);
                setIsScrollableBottom(el.scrollTop + el.clientHeight < el.scrollHeight);
            }
        };

        checkScroll();

        el.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);

        return () => {
            if (el) {
                el.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, [children]);

    return (
        <>
            <form
                className="Popup-form"
                onSubmit={handler}
                style={popupStyle}
            >
                <p className="Popup-form-title">{title}</p>
                <div
                    className={`Popup-content ${isScrollableTop ? 'top-border' : ''} ${isScrollableBottom ? 'bottom-border' : ''}`}
                    ref={contentRef}
                >
                    {children}
                </div>
                <button type="submit" className="Popup-submit">
                    {buttonTitle}
                </button>
            </form>
        </>
    );
};

export default PopupForm;