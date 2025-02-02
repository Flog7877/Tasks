import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/DateTimeInput.css'

/*
 * Vorzunehmende Änderungen:
 * - Redundanz entfernen, 
 * - Die Validierungslogik vereinfachen 
*/

function currDate() {
    const currentDate = new Date();
    return [currentDate.getDate(), currentDate.getMonth() + 1, currentDate.getFullYear(), currentDate];
}

const isLeapYear = (givenYear) => {
    const divByFour = givenYear % 4 === 0;
    const divByHundret = givenYear % 100 === 0;
    const divByFourhundret = givenYear % 400 === 0;
    const leapYearConfirmed = divByFour && (!divByHundret || divByFourhundret);
    return leapYearConfirmed;

}

const DateTimeInput = ({ enableTimeInput, customClass, dtiTitle, dtiId, enablePast, onValidInput }) => {

    const [dayInput, setDayInput] = useState('');
    const [monthInput, setMonthInput] = useState('');
    const [yearInput, setYearsInput] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [dateValidated, setDateValidated] = useState(false);
    const [hourInput, setHourInput] = useState('');
    const [minuteInput, setMinuteInput] = useState('');

    const [isTimeEditing, setIsTimeEditing] = useState(false);
    const [timeValidated, setTimeValidated] = useState(false);

    const [finalDate, setFinalDate] = useState('');

    const dayInputRef = useRef(null);
    const monthInputRef = useRef(null);
    const yearInputRef = useRef(null);
    const hourInputRef = useRef(null);
    const minuteInputRef = useRef(null);

    const pastEnabled = (enablePast === undefined || typeof enablePast !== "boolean") ? false : enablePast;

    const validateInput = () => {
        const [currentDay, currentMonth, currentYear, currentDate] = currDate();
        const isShortMonth = [4, 6, 9, 11].includes(parseInt(monthInput));
        const isFeb = parseInt(monthInput) === 2;
        const leapCase = isLeapYear(parseInt(yearInput));
        const prevDayInput = parseInt(dayInput);
        const prevMonthInput = parseInt(monthInput);
        const prevYearInput = parseInt(yearInput);
        const thisDate = new Date(`${prevYearInput}-${String(prevMonthInput).padStart(2, "0")}-${String(prevDayInput).padStart(2, "0")}`);

        if (!isEditing && dayInput !== '' && monthInput !== '' && yearInput.length === 4) {
            console.log('Date-Validierung angefordert.')
            if (isShortMonth && dayInput === '31') setDayInput('30')
            else if (leapCase && isFeb && parseInt(dayInput) > 29) setDayInput('29')
            else if (!leapCase && isFeb && parseInt(dayInput) > 28) setDayInput('28');
            if (prevDayInput < 10) setDayInput(`0${prevDayInput}`);
            if (prevMonthInput < 10) setMonthInput(`0${prevMonthInput}`);

            if (prevDayInput === 0) setDayInput('01');
            if (prevMonthInput === 0) setMonthInput('01');

            if (!pastEnabled && thisDate < currentDate) {
                setDayInput(String(currentDay).padStart(2, "0"));
                setMonthInput(String(currentMonth).padStart(2, "0"));
            }

            if (!isNaN(dayInput) && dayInput.length === 2
                && !isNaN(monthInput) && monthInput.length === 2
                && !isNaN(yearInput) && yearInput.length === 4) {
                setDateValidated(true);
                console.log('Datum validiert.')
            }
        }
    }

    const validateTimeInput = () => {
        if (!isTimeEditing && minuteInput !== '' && hourInput !== '') {
            setHourInput(hourInput.padStart(2, '0'));
            setMinuteInput(minuteInput.padStart(2, '0'));
            setTimeValidated(true);
        }
    }

    const createPayloadDate = () => {
        if (!timeValidated || !dateValidated) return;
        let constructedDate;
        try {
            const payloadDay = parseInt(dayInput);
            const payloadMonth = parseInt(monthInput);
            const payloadYear = parseInt(yearInput);
            const payloadHours = parseInt(hourInput);
            const payloadMinutes = parseInt(minuteInput);

            constructedDate = new Date(payloadYear, payloadMonth - 1, payloadDay, payloadHours, payloadMinutes);
            setFinalDate(constructedDate);

            if (typeof onValidInput === 'function') onValidInput(constructedDate);

        } catch (err) {
            console.error('Fehler beim Erstellen des Datums: ', err)
            setDateValidated(false);
            setTimeValidated(false);
            setIsEditing(true);
        }
    }

    useEffect(() => {
        validateInput();
    }, [dayInput, monthInput, yearInput, isEditing]);

    useEffect(() => {
        validateTimeInput();
    }, [hourInput, minuteInput, isTimeEditing]);

    useEffect(() => {
        createPayloadDate();
    }, [timeValidated, dateValidated]);

    const handleDayInput = (e) => {
        e.preventDefault();
        let finalDays;
        const enteredDayString = e.target.value;
        if (isNaN(enteredDayString)) return
        else if (enteredDayString.length > 2 || enteredDayString.includes('.')) return
        else if (parseInt(enteredDayString) > 31) finalDays = '31'
        else if (enteredDayString === '00') finalDays = '01'
        else finalDays = enteredDayString;
        setDayInput(finalDays)
        if (finalDays.length === 2) monthInputRef.current.focus();
    }

    const handleMonthInput = (e) => {
        e.preventDefault();
        let finalMonths;
        const enteredMonthString = e.target.value;
        if (isNaN(enteredMonthString) || enteredMonthString.includes('.')) return
        else if (enteredMonthString.length > 2) return
        else if (parseInt(enteredMonthString) > 12) finalMonths = '12'
        else if (enteredMonthString === '00') finalMonths = '01'
        else finalMonths = enteredMonthString;
        setMonthInput(finalMonths);
        if (finalMonths.length === 2) yearInputRef.current.focus();
    }

    const handleYearInput = (e) => {
        const [calledAtDay, calledAtMonth, calledAtYear] = currDate();
        e.preventDefault();
        let finalYear;
        const enteredYear = e.target.value;
        if (isNaN(enteredYear) || enteredYear.includes('.')) return
        else if (enteredYear.length > 4) return
        else if (enteredYear.length === 4 && parseInt(enteredYear) < calledAtYear) finalYear = `${calledAtYear}`
        else finalYear = enteredYear;
        setYearsInput(finalYear);
        if (finalYear.length === 4) {
            yearInputRef.current.blur();
            hourInputRef.current.focus();
        }
    }

    const handleHourInput = (e) => {
        e.preventDefault();
        let finalHours;
        const enteredHours = e.target.value;
        if (isNaN(enteredHours) || enteredHours.includes('.')) return
        else if (parseInt(enteredHours) > 23) finalHours = '23'
        else if (enteredHours === '00') finalHours = '01'
        else finalHours = enteredHours;
        setHourInput(finalHours);

        if (finalHours.length === 2) minuteInputRef.current.focus();
    }

    const handleMinuteInput = (e) => {
        e.preventDefault();
        let finalMinutes;
        const enteredMinutes = e.target.value;
        if (isNaN(enteredMinutes) || enteredMinutes.includes('.')) return
        else if (parseInt(enteredMinutes) > 59) finalMinutes = '59'
        else if (enteredMinutes === '00') finalMinutes = '01'
        else finalMinutes = enteredMinutes;
        setMinuteInput(finalMinutes);

        if (finalMinutes.length === 2) minuteInputRef.current.blur();
    }

    const title = 'Demo';

    return (
        <>
            <div className={`dti-container ${customClass ? String(customClass) : ''}`}>
                <div className='dti-wrapper'>
                    <fieldset className={`dti-fieldset ${(isEditing || isTimeEditing) ? 'isEditing' : ''}`}>
                        <legend className='dti-legend'>{dtiTitle ? dtiTitle : title}</legend>
                        <section
                            className='dti-dateSection'
                            onFocus={() => {
                                setIsEditing(true)
                                setDateValidated(false);
                            }}
                            onBlur={(e) => {
                                if (!e.currentTarget.contains(e.relatedTarget)) {
                                    setIsEditing(false);
                                }
                            }}
                        >
                            <input
                                ref={dayInputRef}
                                className='dti-inputField dti-day'
                                value={dayInput}
                                onChange={(e) => handleDayInput(e)}
                                type='text'
                                placeholder='dd'
                                onFocus={(e) => e.target.select()}
                            />
                            .
                            <input
                                ref={monthInputRef}
                                className='dti-inputField dti-month'
                                value={monthInput}
                                onChange={(e) => handleMonthInput(e)}
                                type='text'
                                placeholder='mm'
                                onFocus={(e) => e.target.select()}
                            />
                            .
                            <input
                                ref={yearInputRef}
                                className='dti-inputField dti-year'
                                value={yearInput}
                                onChange={(e) => handleYearInput(e)}
                                type='text'
                                placeholder='yyyy'
                                onFocus={(e) => e.target.select()}
                            />
                        </section>
                        <section
                            className='dti-timeSection'
                            onFocus={() => {
                                setIsTimeEditing(true)
                                setTimeValidated(false);
                            }}
                            onBlur={(e) => {
                                if (!e.currentTarget.contains(e.relatedTarget)) {
                                    setIsTimeEditing(false);
                                }
                            }}
                        >
                            <input
                                ref={hourInputRef}
                                className='dti-inputField dti-hour'
                                value={hourInput}
                                onChange={(e) => handleHourInput(e)}
                                type='text'
                                placeholder='hh'
                                onFocus={(e) => e.target.select()}
                            />
                            :
                            <input
                                ref={minuteInputRef}
                                className='dti-inputField dti-minute'
                                value={minuteInput}
                                onChange={(e) => handleMinuteInput(e)}
                                type='text'
                                placeholder='mm'
                                onFocus={(e) => e.target.select()}
                            />
                        </section>
                    </fieldset>
                </div>
            </div>
        </>
    );
};

export default DateTimeInput;