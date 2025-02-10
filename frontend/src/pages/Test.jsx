import React, { useState, useEffect, useRef } from 'react';

import DateTimeInput from '../components/DateTimeInput';
import Popup from '../components/Popup/Popup';

import '../styles/components/TaskCard.css';

import { todosAPI, categoriesAPI } from '../api';
import useIsMobile from '../hooks/useIsMobile';



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

function Test() {

    const isMobile = useIsMobile();

    const cardWidth = isMobile ? '50%' : '448px';

    const [categories, setCategories] = useState([]);
    const [rawCategories, setRawCategories] = useState([]);
    const [todos, setTodos] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            const [todosData, categoriesData] = await Promise.all([
                todosAPI.getAll(),
                categoriesAPI.getRawCategories(),
            ]);
            setTodos(todosData);
            setRawCategories(categoriesData);
            const flatCategories = buildHierarchyAndFlatten(categoriesData);
            setCategories(flatCategories);
            console.log(flatCategories)
        };

        fetchData();
    }, []);

    const handleCheckbox = (id) => {
        console.log(`Aufgabe ${id} abgehakt!`);
    }

    const renderTask = (todo) => {
        const taskId = todo.id;
        return (
            <div className='task-wrapper' id={taskId}>
                <div
                    className='task-container'
                    style={{ width: cardWidth }}
                >
                    <div className='task-header' id={`task-header-${taskId}`}>
                        <input
                            defaultValue={taskId}
                            name='task'
                            type='checkbox'
                            id={`task-${taskId}`}
                            onChange={() => {
                                handleCheckbox(taskId);
                            }}
                        />
                        <label htmlFor={`task-${taskId}`}>{todo.title}</label>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div
                style={{ width: '500px' }}
                id='test'
            >

                {!!todos[0] && (
                    renderTask(todos[0])
                )}
            </div>
        </>
    );
};

export default Test;