import React, { useState, useEffect } from 'react';
import '../styles/components/DateTimeInput.css'

function currDate() {
    const currentDate = new Date();
    return [currentDate.getDate(), currentDate.getMonth() + 1, currentDate.getFullYear()];
}

const isLeapYear = (givenYear) => {
    const divByFour = givenYear % 4 === 0;
    const divByHundret = givenYear % 100 === 0;
    const divByFourhundret = givenYear % 400 === 0;
    const leapYearConfirmed = divByFour && (!divByHundret || divByFourhundret);
    return leapYearConfirmed;

}

const DateTimeInput = ({ mode, customClass, dtiTitle, dtiId }) => {

    const [dayInput, setDayInput] = useState('');
    const [monthInput, setMonthInput] = useState('');
    const [yearInput, setYearsInput] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [dateValidated, setDateValidated] = useState(false);

    const validateInput = () => {
        const isShortMonth = [4, 6, 9, 11].includes(parseInt(monthInput));
        const isFeb = parseInt(monthInput) === 2;
        const leapCase = isLeapYear(parseInt(yearInput));
        const prevDayInput = parseInt(dayInput);
        const prevMonthInput = parseInt(monthInput);
        if (!isEditing && dayInput !== '' && monthInput !== '' && yearInput.length === 4) {
            console.log('Jetzt würde eine Validierung erfolgen.')
            if (isShortMonth && dayInput === '31') setDayInput('30')
            else if (leapCase && isFeb && parseInt(dayInput) > 29) setDayInput('29')
            else if (!leapCase && isFeb && parseInt(dayInput) > 28) setDayInput('28');

            if (prevDayInput < 10) setDayInput(`0${prevDayInput}`);
            if (prevMonthInput < 10) setMonthInput(`0${prevMonthInput}`);
            setDateValidated(true)
        }
    }

    useEffect(() => {
        validateInput();
    }, [dayInput, monthInput, yearInput, isEditing]);


    const handleDayInput = (e) => {
        e.preventDefault();
        let finalDays;
        const enteredDayString = e.target.value;
        if (isNaN(enteredDayString)) return
        else if (enteredDayString.length > 2) return
        else if (parseInt(enteredDayString) > 31) finalDays = '31'
        else if (enteredDayString === '00') finalDays = '01'
        else finalDays = enteredDayString;
        setDayInput(finalDays)
    }

    const handleMonthInput = (e) => {
        e.preventDefault();
        let finalMonths;
        const enteredMonthString = e.target.value;
        if (isNaN(enteredMonthString)) return
        else if (enteredMonthString.length > 2) return
        else if (parseInt(enteredMonthString) > 12) finalMonths = '12'
        else if (enteredMonthString === '00') finalMonths = '01'
        else finalMonths = enteredMonthString;
        setMonthInput(finalMonths);
    }

    const handleYearInput = (e) => {
        const [calledAtDay, calledAtMonth, calledAtYear] = currDate();
        e.preventDefault();
        let finalYear;
        const enteredYear = e.target.value;
        if (isNaN(enteredYear)) return
        else if (enteredYear.length > 4) return
        else if (enteredYear.length === 4 && parseInt(enteredYear) < calledAtYear) finalYear = `${calledAtYear}`
        else finalYear = enteredYear;
        setYearsInput(finalYear);
    }

    const title = 'test';

    return (
        <>
            <div className='dti-container'>
                <div
                    className='dti-wrapper'
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
                    <form className='dti-form'>
                        <fieldset className='dti-fieldset'>
                            <legend className='dti-legend'>{dtiTitle ? dtiTitle : title}</legend>
                            <input
                                className='dti-inputField'
                                value={dayInput}
                                onChange={(e) => handleDayInput(e)}
                                type='text'
                                placeholder='DD'
                            />
                            <input
                                className='dti-inputField'
                                value={monthInput}
                                onChange={(e) => handleMonthInput(e)}
                                type='text'
                                placeholder='MM'
                            />
                            <input
                                className='dti-inputField'
                                value={yearInput}
                                onChange={(e) => handleYearInput(e)}
                                type='text'
                                placeholder='YYYY'
                            />
                        </fieldset>
                    </form>
                </div>
            </div>
            {isEditing && (
                <div>
                    Am Bearbeiten
                </div>
            )}
            {dateValidated && (
                <div>
                    Datum validiert: {`${dayInput}.${monthInput}.${yearInput}`}
                </div>
            )}
        </>
    );
};

export default DateTimeInput;