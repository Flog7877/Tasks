import React, { useEffect, useState } from 'react';
import { todosAPI, categoriesAPI } from '../api';
import '../styles/CreateTask.css';
import useIsMobile from '../hooks/useIsMobile';
import Popup from './Popup/Popup';
import PopupInputfield from './Popup/PopupInputfield';

import PopupTextArea from './Popup/PopupTextArea';
import PopupNumberInput from './Popup/PopupNumberInput';
import NotificationModal from './NotificationModal';

import DateTimeInput from './DateTimeInput';

import {
    CancleIcon,
    PlusIcon,
    UpArrowIcon,
    DownArrowIcon
} from '../icons/icons';

function isValidDate(date) {
    if (Object.prototype.toString.call(date) === "[object Date]") {
        if (isNaN(date.getTime())) {
            return false;
        }
        else {
            return true;
        }
    }
}

function getContrastingColor(hexColor) {
    let color = hexColor.replace('#', '');
    if (color.length === 3) {
        color = color.split('').map(c => c + c).join('');
    }
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);

    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * 
 * @param {Object} CreateTask 
 * @param {function} CreateTask.toggle - Funktion, die das Toggle-Verhalten bestimmt 
 * @param {function} CreateTask.handleSubmit - Funktion, die bestimmt, was bei 'Hinzufügen' passiert. Nimmt Backend-Response entgegen. 
 */
const CreateTask = ({ toggle, handleSubmit }) => {

    const isMobile = useIsMobile();

    const PopupWidth = isMobile ? '90%' : '448px';

    const [dateMode, setDateMode] = useState('none');
    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [todoRecurrence, setTodoRecurrence] = useState('none');

    const [importanceScore, setImportanceScore] = useState('');
    const [urgencyScore, setUrgencyScore] = useState('');

    const [todoStatus, setTodoStatus] = useState('todo');

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDetails, setTaskDetails] = useState('');


    const [selectedCategoryArray, setSelectedCategoryArray] = useState([]);

    const [categories, setCategories] = useState([]);
    const [rawCategories, setRawCategories] = useState([]);

    const [currentStepText, setCurrentStepText] = useState('');
    const [stepsList, setStepsList] = useState([]);

    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationList, setNotificationList] = useState([]);
    const [todoEndDate, setTodoEndDate] = useState(null);

    function buildHierarchyAndFlatten(catArray) {
        const map = {};
        catArray.forEach(c => {
            map[c.id] = { ...c, children: [] };
        });

        const rootNodes = [];
        catArray.forEach(c => {
            if (!c.parent_id) {
                rootNodes.push(map[c.id]);
            } else if (map[c.parent_id]) {
                map[c.parent_id].children.push(map[c.id]);
            }
        });

        function sortChildren(node) {
            node.children.sort((a, b) => a.title.localeCompare(b.title));
            node.children.forEach(sortChildren);
        }

        rootNodes.sort((a, b) => a.title.localeCompare(b.title));
        rootNodes.forEach(sortChildren);

        const result = [];
        function traverse(node, prefix) {
            const path = prefix ? prefix + '/' + node.title : node.title;
            result.push({ id: node.id, slashPath: path, title: node.title, color: node.color, description: node.description });
            node.children.forEach(child => traverse(child, path));
        }
        rootNodes.forEach(r => traverse(r, ''));

        return result;
    }

    useEffect(() => {
        const fetchData = async () => {
            const categoriesData = await categoriesAPI.getRawCategories();
            setRawCategories(categoriesData);
            const flatCategories = buildHierarchyAndFlatten(categoriesData);
            setCategories(flatCategories);
        };

        fetchData();
    }, []);

    const handleChangeImportanceScore = (e) => {
        if (e > 10) setImportanceScore(10);
        else if (e <= 0) setImportanceScore(1);
        else setImportanceScore(e);
    }

    const handleChangeUrgencyScore = (e) => {
        if (e > 10) setUrgencyScore(10);
        else if (e <= 0) setUrgencyScore(1);
        else setUrgencyScore(e);
    }

    const handleCreateTask = async (e) => {
        e.preventDefault();

        const todoDate = !isValidDate(selectedDateTime) || dateMode === 'none' ? null : selectedDateTime.toISOString();
        const end_date = !isValidDate(todoEndDate) || todoRecurrence === 'none' ? null : todoEndDate.toISOString();

        const payload = {
            title: taskTitle,
            details: taskDetails,
            steps: stepsList,
            importanceScore: parseInt(importanceScore),
            urgencyScore: parseInt(urgencyScore),
            categories: selectedCategoryArray,
            status: todoStatus,
            dateMode: dateMode,
            todoDate: todoDate,
            recurrence: todoRecurrence,
            endDate: end_date,
            notifications: notificationList
        }

        try {
            const response = await todosAPI.create(payload);
            if (typeof handleSubmit === 'function') handleSubmit(response)
        } catch (err) {
            console.error('Fehler beim erstellen des Tasks:', err);
        }
    }

    const handleSelectCategory = (catID) => {
        const catObj = categories.find(item => item.id === parseInt(catID));
        if (!selectedCategoryArray.includes(catObj)) setSelectedCategoryArray(prevCats => [...prevCats, catObj]);
    }

    const handleUnselectCategory = (catObj) => {
        const newArray = selectedCategoryArray.filter(item => item !== catObj)
        setSelectedCategoryArray(newArray);
    }

    const handleAddStep = (e) => {
        e.preventDefault();
        const textToSave = currentStepText;
        const currentStepsLength = stepsList.length;
        const stepNumber = currentStepsLength + 1;
        const stepListEntry = {
            "id": `${stepNumber}`,
            "content": `${textToSave}`,
            "stepStatus": "todo",
        };
        setStepsList(prevSteps => [...prevSteps, stepListEntry]);
        setCurrentStepText('');
    }
    const handleChangeOrder = (step, direction) => {
        const movedStepId = parseInt(step.id);
        const editStepsList = stepsList;

        let newMovedId, affectedStepId, newAffectedId;

        switch (direction) {
            case 'up':
                if (movedStepId === stepsList.length) return;
                affectedStepId = movedStepId + 1;
                newMovedId = movedStepId + 1;
                newAffectedId = affectedStepId - 1
                break;
            case 'down':
                if (movedStepId === 1) return;
                affectedStepId = movedStepId - 1;
                newMovedId = movedStepId - 1;
                newAffectedId = affectedStepId + 1
                break;
            default:
                console.error('Fehler beim Verschieben eines Schritts: Ungültige Richtung!')
        }

        for (let stepListCurr of editStepsList) {
            const currId = parseInt(stepListCurr.id);
            if (currId === affectedStepId) stepListCurr.id = newAffectedId
            else if (currId === movedStepId) stepListCurr.id = newMovedId
        }

        const sortedSteps = [...stepsList].sort((a, b) => parseInt(a.id) - parseInt(b.id));

        setStepsList(sortedSteps);
    }

    const handleDeleteStep = (step) => {
        const deletedStep = step;
        const deletedNumber = deletedStep.id;
        const newStepArray = stepsList.filter(item => item !== deletedStep);
        for (let otherStep of newStepArray) {
            otherStep.id = otherStep.id > deletedNumber ? otherStep.id - 1 : otherStep.id;
        }
        setStepsList(newStepArray);
    }

    const handleChangeRecurrence = (e) => {
        e.preventDefault
        const mode = e.target.value;
        setTodoRecurrence(mode);
    }

    const handleDateTimeInput = (passedDate) => {
        if (isValidDate(passedDate)) setSelectedDateTime(passedDate);
    }

    const toggleShowNotificationModal = () => {
        setShowNotificationModal(!showNotificationModal);
    }

    const handleAddNotification = (e) => {
        const new_notification = e;
        new_notification.id = notificationList.length;
        setNotificationList(prevNotifs => [...prevNotifs, new_notification]);
        setShowNotificationModal(false)
    }

    const gerDateTime = (dateString) => {
        const date = new Date(dateString)
        return `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}`
    }

    const handleDeleteNotification = (notification) => {
        const deletedNotification = notification;
        const newStepArray = notificationList.filter(item => item !== deletedNotification);
        setNotificationList(newStepArray);
    }

    return (
        <>
            <Popup
                toggle={toggle}
                handler={handleCreateTask}
                title={'Aufgabe hinzufügen'}
                buttonTitle={'Hinzufügen'}
                mode='form'
                width={PopupWidth}
                zIndex={888}
                content={
                    <>
                        <PopupInputfield
                            type={'text'}
                            placeholder={'Titel'}
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                        />
                        <PopupTextArea
                            rows={1}
                            placeholder={'Details...'}
                            value={taskDetails}
                            onChange={(e) => setTaskDetails(e.target.value)}
                        />
                        <div className='createTask-steps-container'>
                            <ul className='CreateTask-steps-list'>
                                {stepsList.length > 0 ? stepsList.map(step => (
                                    <li
                                        className='singleStep-entry'
                                        key={step.id}
                                    >
                                        <span className='singleStep-title'>Schritt {step.id}</span>
                                        <div className='steps-buttonWrapper'>
                                            <button
                                                id={`sigleStep-deleteButton-id${step.id}`}
                                                className='singleStep-deleteButton'
                                                type='button'
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteStep(step);
                                                }}
                                            >
                                                <CancleIcon width="20px" />
                                            </button>
                                            <button
                                                id={`sigleStep-upButton-id${step.id}`}
                                                className='singleStep-changeOrderButton'
                                                type='button'
                                                disabled={parseInt(step.id) === stepsList.length}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleChangeOrder(step, 'up');
                                                }}
                                            >
                                                <DownArrowIcon width="20px" />
                                            </button>
                                            <button
                                                id={`sigleStep-downButton-id${step.id}`}
                                                className='singleStep-changeOrderButton'
                                                type='button'
                                                disabled={parseInt(step.id) === 1}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleChangeOrder(step, 'down');
                                                }}
                                            >
                                                <UpArrowIcon width="20px" />
                                            </button>
                                        </div>
                                        <div className='singleStep-content'>
                                            {step.content}
                                        </div>
                                    </li>
                                )) : <span></span>}
                            </ul>
                            <div className='addSteps-wrapper'>
                                <fieldset className='addSteps-fieldset'>
                                    <legend className='addSteps-legend'>Schritt hinzufügen</legend>
                                    <input
                                        className='addSteps-input'
                                        type='text'
                                        placeholder='Neuer Schritt...'
                                        value={currentStepText}
                                        onChange={(e) => setCurrentStepText(e.target.value)}
                                    />
                                </fieldset>
                                <div style={{ position: 'relative', width: 'calc(100% - 35px)', height: '0' }}>
                                    <div className='addSteps-button-wrapper'>
                                        {currentStepText !== '' && (
                                            <button
                                                className='addSteps-button'
                                                type='button'
                                                onClick={(e) => handleAddStep(e)}
                                            >
                                                <PlusIcon width="26px" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PopupNumberInput
                            legend={'Wichtigkeitsscore'}
                            value={importanceScore}
                            placeholder={'1-10'}
                            onChange={(e) => handleChangeImportanceScore(e.target.value)}

                        />
                        <PopupNumberInput
                            legend={'Dringlichkeitsscore'}
                            value={urgencyScore}
                            placeholder={'1-10'}
                            onChange={(e) => handleChangeUrgencyScore(e.target.value)}

                        />
                        <div className='ct-cat'>
                            <label>
                                <select
                                    className='ct-cat-select'
                                    value={'Kategorie...'}
                                    onChange={(e) => handleSelectCategory(e.target.value)}
                                >
                                    <option value="">Kategorie hinzufügen</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.slashPath}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <div style={{ position: 'relative', width: 'calc(100% - 35px)', height: '0' }}>
                                <div className='ct-cat-select-wrapper'>
                                        <button
                                            className='ct-add'
                                            type='button'
                                            onClick={(e) => e.preventDefault()}
                                            disabled={true}
                                        >
                                            <PlusIcon width="26px" />
                                        </button>
                                </div>
                            </div>
                            <ul className='CreateTask-category-list'>
                                {selectedCategoryArray.length > 0 ? (
                                    selectedCategoryArray.map(cat => (
                                        <li
                                            key={cat.id}
                                            style={{ backgroundColor: `${cat.color}`, color: `${getContrastingColor(cat.color)}` }}
                                        >
                                            {cat.slashPath}&nbsp;
                                            <button
                                                className='CreateTask-UnselectCategory'
                                                type='button'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUnselectCategory(cat)
                                                }}
                                                style={{ color: `${getContrastingColor(cat.color)}` }}
                                            >
                                                <CancleIcon width='16px' />
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <span></span>
                                )}
                            </ul>
                        </div>
                        <div className='CreateTask-status-container'>
                            <strong>Status</strong>&nbsp;
                            <div className='status-toggle'>
                                <label>
                                    <input
                                        type="radio"
                                        value="todo"
                                        checked={todoStatus === 'todo'}
                                        onChange={(e) => setTodoStatus(e.target.value)}
                                    />
                                    Todo
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="inProgress"
                                        checked={todoStatus === 'inProgress'}
                                        onChange={(e) => setTodoStatus(e.target.value)}
                                    />
                                    In Progress
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="putOff"
                                        checked={todoStatus === 'putOff'}
                                        onChange={(e) => setTodoStatus(e.target.value)}
                                    />
                                    Put off
                                </label>
                            </div>
                        </div>
                        <div className='CreateTask-dateMode-wrapper'>
                            <div className='CreateTask-dateMode-container'>
                                <strong>Datemode</strong>&nbsp;
                                <div className='dateMode-toggle'>
                                    <label>
                                        <input
                                            type="radio"
                                            value="none"
                                            checked={dateMode === 'none'}
                                            onChange={(e) => {
                                                setDateMode(e.target.value);
                                            }}
                                        />
                                        Aus
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="deadline"
                                            checked={dateMode === 'deadline'}
                                            onChange={(e) => setDateMode(e.target.value)}
                                        />
                                        Deadline
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="onDateTime"
                                            checked={dateMode === 'onDateTime'}
                                            onChange={(e) => setDateMode(e.target.value)}
                                        />
                                        Zeitpunkt
                                    </label>
                                </div>
                            </div>
                            {dateMode !== 'none' && (
                                <div className='dateMode-datePicker'>
                                    <DateTimeInput
                                        title={dateMode === 'deadline' ? 'Deadline' : 'Startzeitpunkt'}
                                        width='calc(100% - 35px)'
                                        onValidInput={(d) => handleDateTimeInput(d)}
                                        enablePast={false}
                                    />
                                    {dateMode === 'onDateTime' && (
                                        <div className='dateMode-recurrencePicker'>
                                            <strong>Recurrence</strong>
                                            <select
                                                value={todoRecurrence}
                                                onChange={(e) => handleChangeRecurrence(e)}
                                            >
                                                <option value='none'>Keine</option>
                                                <option value='daily'>Täglich</option>
                                                <option value='weekly'>Wöchentlich</option>
                                                <option value='monthly'>Monatlich</option>
                                            </select>
                                        </div>
                                    )}
                                    {todoRecurrence !== 'none' && dateMode === 'onDateTime' && (
                                        <div className='dateMode-endDate'>
                                            <strong>Enddatum</strong>&nbsp;&nbsp;
                                            <DateTimeInput
                                                enablePast={false}
                                                timeInput={false}
                                                width='fit-content'
                                                customClass='dm-end'
                                                onChange={(e) => {
                                                    setTodoEndDate(e)
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div
                            className='CreateTask-button'
                            onClick={toggleShowNotificationModal}
                        >
                            Benachrichtigung hinzufügen
                        </div>
                        {showNotificationModal && (
                            <NotificationModal
                                toggle={toggleShowNotificationModal}
                                handleCancle={() => toggleShowNotificationModal()}
                                handleDone={(e) => handleAddNotification(e)}
                            />
                        )}
                        <ul className='ct-notif-list'>
                            {notificationList.length > 0 ? notificationList.map(notification => (
                                <li
                                    className='ct-notif-entry'
                                    key={notification.id}
                                >
                                    Datum: {gerDateTime(notification.date_string)}
                                    <button
                                        id={`notification-deleteButton-id${notification.id}`}
                                        className='ct-notif-deleteButton'
                                        type='button'
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleDeleteNotification(notification);
                                        }}
                                    >
                                        <CancleIcon width="20px" />
                                    </button><br />
                                    Recurrence: {notification.recurrence} <br />
                                    Enddatum: {notification.rec_end_date === null ? '-' : new Date(notification.rec_end_date).toLocaleDateString()}
                                </li>
                            )) : <span></span>}
                        </ul>
                    </>
                }
            />
        </>
    );
};

export default CreateTask;