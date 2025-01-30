import React, { useEffect, useState } from 'react';
import { todosAPI, categoriesAPI } from '../api';
import '../styles/CreateTask.css';

import Popup from './Popup/Popup';
import PopupInputfield from './Popup/PopupInputfield';

import SimpleToggle from './SimpleToggle';
import MuiDateTimePicker from './DateTimePicker';
import PopupTextArea from './Popup/PopupTextArea';
import PopupNumberInput from './Popup/PopupNumberInput';
import PopupDelField from './Popup/PopupDelField';
import CancleIcon from '../icons/CancelIcon';

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

const CreateTask = ({ toggle }) => {

    const [hasDeadline, setHasDeadline] = useState(false);
    const [hasNotification, setHasNotification] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const [importanceScore, setImportanceScore] = useState('');
    const [urgencyScore, setUrgencyScore] = useState('')

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDetails, setTaskDetails] = useState('');

    const [categories, setCategories] = useState([]);
    const [rawCategories, setRawCategories] = useState([]);


    // Temp 

    const [showStep, setShowStep] = useState(false);
    const [step, setStep] = useState('');

    //

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
            console.log('flattened categories: ', flatCategories);
            setCategories(flatCategories);
        };

        fetchData();
    }, []);

    const handleHasDeadline = () => {
        setHasDeadline(!hasDeadline);
    }

    const handleDeadlineSelect = (e) => {
        setSelectedDate(e);
        //console.log(new Date(selectedDate.$d))
    }

    const toggleNotification = (e) => {
        setHasNotification(!hasNotification);
    }

    const handleAddStep = () => {
        if (showStep === false) setShowStep(true);
    }

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

    const handleCreateTask = (e) => {
        e.preventDefault();
        console.log('Hinzufügen gedrückt')
    }

    // Temp

    const toggleStep = () => {
        setStep('');
        setShowStep(!showStep);
    }

    const [selectedCategoryArray, setSelectedCategoryArray] = useState([]);

    const handleSelectCategory = (catID) => {
        const catObj = categories.find(item => item.id === parseInt(catID));
        if (!selectedCategoryArray.includes(catObj)) setSelectedCategoryArray(prevCats => [...prevCats, catObj]);
    }

    const handleUnselectCategory = (catObj) => {
        const newArray = selectedCategoryArray.filter(item => item !== catObj)
        console.log('Die zu entfernende Kategorie: ', catObj);
        setSelectedCategoryArray(newArray);
    }

    return (
        <>
            <Popup
                toggle={toggle}
                handler={handleCreateTask}
                title={'Aufgabe hinzufügen'}
                buttonTitle={'Hinzufügen'}
                children={
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
                        <div>
                            <button
                                className='ct-add-button'
                                onClick={handleAddStep}
                                type='button'
                            >
                                + Schritt hinzufügen
                            </button>
                        </div>
                        {showStep && (<div>
                            <PopupDelField
                                legend={'Schritt 1'}
                                id={3}
                                placeholder={'Schritt hinzufügen...'}
                                value={step}
                                onChange={(e) => setStep(e.target.value)}
                                onClick={toggleStep}
                            />
                        </div>)}
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
                        <div>
                            <label>
                                <select
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
                                    <li>Keine Kategorie ausgewählt</li>
                                )}
                            </ul>
                        </div>
                        <p>
                            Status
                        </p>
                        <p>
                            Fälligkeitsdatum? <SimpleToggle initial={hasDeadline} handler={handleHasDeadline} toggleId={"deadline"} />
                        </p>
                        {hasDeadline && (<div>
                            <MuiDateTimePicker
                                label="Deadline"
                                value={selectedDate}
                                onChange={(newValue) => handleDeadlineSelect(newValue)}
                            />
                        </div>)}
                        <p>
                            Reminder? <SimpleToggle initial={hasNotification} handler={toggleNotification} toggleId={"reminder"} />
                        </p>
                        {hasNotification && (
                            <div>
                                <button
                                    className='ct-add-button'
                                    onClick={handleAddStep}
                                    type='button'
                                >
                                    + Benachrichtigung hinzufügen
                                </button>
                            </div>
                        )}
                    </>
                }
            />
        </>
    );
};

export default CreateTask;