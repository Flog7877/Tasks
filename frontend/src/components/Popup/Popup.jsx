import React, { Children, useEffect, useState, useRef } from 'react';
import '../../styles/components/Popup.css';
import useIsMobile from '../../hooks/useIsMobile';

const Popup = ({ toggle, handler, title, buttonTitle, children }) => {

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
            <div className="Popup-overlay" onClick={toggle}>
                <div
                    className="General-popup"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className='Popup-container'>
                        <div className='Popup-wrapper'>
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
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Popup;