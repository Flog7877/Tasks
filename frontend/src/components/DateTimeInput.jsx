import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/DateTimeInput.css'

/*
 * Vorzunehmende Änderungen:
 * - Visuelles Zeichen bei nicht validem Input
*/

/**
 * @param {Date} passedDate - Date to select components 
 * @returns {Array} [Day, Month, Year, Hours, Minutes] - Warning! Month in human-readable form.
 */
function dateComponents(passedDate) {
    return [passedDate.getDate(), passedDate.getMonth() + 1, passedDate.getFullYear(), passedDate.getHours(), passedDate.getMinutes()];
}

const isLeapYear = (givenYear) => {
    const divByFour = givenYear % 4 === 0;
    const divByHundret = givenYear % 100 === 0;
    const divByFourhundret = givenYear % 400 === 0;
    const leapYearConfirmed = divByFour && (!divByHundret || divByFourhundret);
    return leapYearConfirmed;

}

/**
     * @param {string} str - string to validate 
     * @param {number} l  - maximum input length 
     * @param {number} m  - maximum value   
     * 
     * @returns {string | undefined} final value as string or undefined
    */
function validateValue(str, l, m) {
    let finalValueStr;
    if (isNaN(str)) return
    else if (str.length > l || str.includes('.')) return
    else if (parseInt(str) > m) finalValueStr = `${m}`
    else finalValueStr = str;
    return finalValueStr;
}

/**
 * Converts argument (number/ string) to string
 * @param {*} arg - Argument to pad
 * @param {number} length 
 * @returns 
 */
const dPad = (arg, length) => {
    return String(arg).padStart(length, "0");
}


/**
 * @param {Object} DateTimeInput 
 * Simple DateTime Input. Following params can be used:
 * @param {string} DateTimeInput.customClass - Optional. If given, DateTimeInput can be selected with dti-container.<custom-class>
 * @param {string} DateTimeInput.title - Optional.  If given, Input will render as fieldset with legend
 * @param {string} DateTimeInput.id - Optional. When multiple Inputs are used, an id might be necessary 
 * @param {boolean} DateTimeInput.enablePast - Obtional, enbled by default. If enabled, user can select past dates 
 * @param {string} DateTimeInput.width - Uses 100% of container by default, minimum of 160px
 * @param {boolean} DateTimeInput.timeInput - Default true. If disabled, input is date-only.
 * @param {Date} DateTimeInput.maxDateTime - If given, dates after maxDateTime will be set to maximum date.
 * @param {Date} DateTimeInput.minDateTime - If given, dates before minDateTime will be set to minimum date.
 * @param {Date} DateTimeInput.initial - Inital Date to be displayed
 * @param {Date} DateTimeInput.value - For Datetime to be controlled.
 * @param {function} DateTimeInput.onChange - No initial validation. 
 * @param {function} DateTimeInput.onValidInput - Function that handles the date. Will only pass date when input is valid.
 */
const DateTimeInput = ({
    customClass,
    title,
    id,
    enablePast = true,
    onValidInput,
    onChange,
    width = '100%',
    timeInput = true,
    maxDateTime,
    minDateTime,
    initial,
    value
}) => {

    if (!!minDateTime && !!maxDateTime) {
        if (minDateTime > maxDateTime) {
            console.error('DateTimeInput: Minimum date cannot be greater than maximum date.')
            return;
        }
    }

    let [initialDays, initialMonths, initialYears, initialHours, initialMinutes] = ['', '', '', '', ''];

    if (!!initial) {
        const [initialDayValue, initialMonthValue, initialYearValue, initialHourValue, initialMinuteValue] = dateComponents(initial);
        initialDays = dPad(initialDayValue, 2);
        initialMonths = dPad(initialMonthValue, 2);
        initialYears = dPad(initialYearValue, 4);
        initialHours = dPad(initialHourValue, 2);
        initialMinutes = dPad(initialMinuteValue, 2);
    }

    const [dayInput, setDayInput] = useState(initialDays);
    const [monthInput, setMonthInput] = useState(initialMonths);
    const [yearInput, setYearsInput] = useState(initialYears);
    const [hourInput, setHourInput] = useState(initialHours);
    const [minuteInput, setMinuteInput] = useState(initialMinutes);

    const [isDateEditing, setIsDateEditing] = useState(false);
    const [dateValidated, setDateValidated] = useState(false);
    const [isTimeEditing, setIsTimeEditing] = useState(false);
    const [timeValidated, setTimeValidated] = useState(false);

    const dayInputRef = useRef(null);
    const monthInputRef = useRef(null);
    const yearInputRef = useRef(null);
    const hourInputRef = useRef(null);
    const minuteInputRef = useRef(null);

    const validateDateInput = () => {
        const isShortMonth = [4, 6, 9, 11].includes(parseInt(monthInput));
        const isFeb = parseInt(monthInput) === 2;
        const leapCase = isLeapYear(parseInt(yearInput));
        const prevDayInput = parseInt(dayInput);
        const prevMonthInput = parseInt(monthInput);

        if (!isDateEditing && dayInput !== '' && monthInput !== '' && yearInput.length === 4) {
            if (isShortMonth && dayInput === '31') setDayInput('30')
            else if (leapCase && isFeb && parseInt(dayInput) > 29) setDayInput('29')
            else if (!leapCase && isFeb && parseInt(dayInput) > 28) setDayInput('28');
            if (prevDayInput < 10) setDayInput(`0${prevDayInput}`);
            if (prevMonthInput < 10) setMonthInput(`0${prevMonthInput}`);

            if (prevDayInput === 0) setDayInput('01');
            if (prevMonthInput === 0) setMonthInput('01');

            if (!isNaN(dayInput) && dayInput.length === 2
                && !isNaN(monthInput) && monthInput.length === 2
                && !isNaN(yearInput) && yearInput.length === 4) {
                setDateValidated(true);
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

    const sendDate = (days, months, years, hours, minutes) => {
        try {
            const finalMonths = months - 1;
            const finalHours = timeInput ? hours : 0;
            const finalMinutes = timeInput ? minutes : 0;
            const finalDate = new Date(years, finalMonths, days, finalHours, finalMinutes)
            if (typeof onValidInput === 'function') onValidInput(finalDate);
        } catch (err) {
            console.error('Fehler beim Erstellen des Datums: ', err)
        }
    }

    const validateDateTimeInput = () => {
        if ((timeInput && !timeValidated) || !dateValidated) return;

        let daysInt = parseInt(dayInput);
        let monthsInt = parseInt(monthInput);
        let yearsInt = parseInt(yearInput);
        let hoursInt = timeInput ? parseInt(hourInput) : 0;
        let minutesInt = timeInput ? parseInt(minuteInput) : 0;
        const givenDate = new Date(yearsInt, monthsInt - 1, daysInt, hoursInt, minutesInt);

        if (!!maxDateTime) {
            const [maxDays, maxMonths, maxYears, maxHours, maxMinutes] = dateComponents(maxDateTime);
            if (givenDate > maxDateTime) {
                setDayInput(String(maxDays).padStart(2, "0"));
                setMonthInput(String(maxMonths).padStart(2, "0"));
                setYearsInput(String(maxYears).padStart(4, "0"));
                setHourInput(String(maxHours).padStart(2, "0"));
                setMinuteInput(String(maxMinutes).padStart(2, "0"));
                daysInt = maxDays;
                monthsInt = maxMonths;
                yearsInt = maxYears;
                hoursInt = maxHours;
                minutesInt = maxMinutes;
            }
        }

        if (!!minDateTime || !enablePast) {
            const now = new Date();
            let minimumDate = now;
            if (!!minDateTime) minimumDate = enablePast ? minDateTime : now < minDateTime ? minDateTime : now;
            const [minDays, minMonths, minYears, minHours, minMinutes] = dateComponents(minimumDate);
            if (givenDate < minimumDate) {
                setDayInput(String(minDays).padStart(2, "0"));
                setMonthInput(String(minMonths).padStart(2, "0"));
                setYearsInput(String(minYears).padStart(4, "0"));
                setHourInput(String(minHours).padStart(2, "0"));
                setMinuteInput(String(minMinutes).padStart(2, "0"));
                daysInt = minDays;
                monthsInt = minMonths;
                yearsInt = minYears;
                hoursInt = minHours;
                minutesInt = minMinutes;
            }
        }
        sendDate(daysInt, monthsInt, yearsInt, hoursInt, minutesInt);
    }

    useEffect(() => {
        validateDateInput();
    }, [dayInput, monthInput, yearInput, isDateEditing]);

    useEffect(() => {
        validateTimeInput();
    }, [hourInput, minuteInput, isTimeEditing]);

    useEffect(() => {
        validateDateTimeInput();
    }, [timeValidated, dateValidated]);

    useEffect(() => {
        if (typeof onChange === 'function') onChange(new Date(`${yearInput}-${monthInput}-${dayInput}${timeInput ? `T${hourInput}:${minuteInput}` : ''}`));
    }, [minuteInput, hourInput, dayInput, monthInput, yearInput])

    const handleDayInput = (e) => {
        e.preventDefault();
        const enteredDayString = e.target.value;
        let finalDays = validateValue(enteredDayString, 2, 31);
        if (finalDays === undefined) return
        else if (finalDays === '00') finalDays = `01`
        setDayInput(finalDays)
        if (finalDays.length === 2) monthInputRef.current.focus();
    }

    const handleMonthInput = (e) => {
        e.preventDefault();
        const enteredMonthString = e.target.value;
        let finalMonths = validateValue(enteredMonthString, 2, 12);
        if (finalMonths === undefined) return
        else if (finalMonths === '00') finalMonths = `01`
        setMonthInput(finalMonths);
        if (finalMonths.length === 2) yearInputRef.current.focus();
    }

    const handleYearInput = (e) => {
        e.preventDefault();
        let finalYear;
        const enteredYear = e.target.value;
        if (isNaN(enteredYear) || enteredYear.includes('.')) return
        else if (enteredYear.length > 4) return
        else finalYear = enteredYear;
        setYearsInput(finalYear);
        if (finalYear.length === 4) {
            yearInputRef.current.blur();
            if (timeInput) hourInputRef.current.focus();
        }
    }

    const handleHourInput = (e) => {
        e.preventDefault();
        const enteredHours = e.target.value;
        const finalHours = validateValue(enteredHours, 2, 23);
        if (finalHours === undefined) return
        setHourInput(finalHours);

        if (finalHours.length === 2) minuteInputRef.current.focus();
    }

    const handleMinuteInput = (e) => {
        e.preventDefault();
        const enteredMinutes = e.target.value;
        const finalMinutes = validateValue(enteredMinutes, 2, 59);
        if (finalMinutes === undefined) return
        setMinuteInput(finalMinutes);

        if (finalMinutes.length === 2) minuteInputRef.current.blur();
    }

    return (
        <>
            <div className={`dti-container ${customClass ? String(customClass) : ''}`}>
                <div className='dti-wrapper'>
                    <fieldset
                        className={`dti-fieldset ${(isDateEditing || isTimeEditing) ? 'isEditing' : ''}`}
                        style={{ width: width, paddingTop: `${!!title? 3.5 : 16.5}px` }}
                    >
                        {!!title && (<legend className='dti-legend'>{title}</legend>)}
                        <section
                            className='dti-Section dateSection'
                            onFocus={() => {
                                setIsDateEditing(true)
                                setDateValidated(false);
                            }}
                            onBlur={(e) => {
                                if (!e.currentTarget.contains(e.relatedTarget)) {
                                    setIsDateEditing(false);
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
                                id={id ? `dti-day-${id}` : ''}
                                style={{ width: `${dayInput !== '' ? '18px' : '18px'}`, textAlign: 'right' }}
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
                                id={id ? `dti-month-${id}` : ''}
                                style={{ width: `${monthInput !== '' ? '18px' : '28px'}`, textAlign: 'center' }}
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
                                id={id ? `dti-year-${id}` : ''}
                                style={{ width: `${yearInput !== '' ? '36px' : '32px'}`, textAlign: 'left' }}
                            />
                        </section>
                        {timeInput && (
                            <>
                                &nbsp;
                                <section
                                    className='dti-section timeSection'
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
                                        id={id ? `dti-hours-${id}` : ''}
                                        style={{ width: `${hourInput !== '' ? '18px' : '18px'}`, textAlign: 'right' }}
                                    />
                                    <span className='dtiTime-separator'>:</span>
                                    <input
                                        ref={minuteInputRef}
                                        className='dti-inputField dti-minute'
                                        value={minuteInput}
                                        onChange={(e) => handleMinuteInput(e)}
                                        type='text'
                                        placeholder='mm'
                                        onFocus={(e) => e.target.select()}
                                        id={id ? `dti-minutes-${id}` : ''}
                                        style={{ width: `${minuteInput !== '' ? '18px' : '28px'}`, textAlign: 'left' }}
                                    />
                                </section>
                            </>
                        )}
                    </fieldset>
                </div>
            </div>
        </>
    );
};

export default DateTimeInput;