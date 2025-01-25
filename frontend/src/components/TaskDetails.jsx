import React, { useEffect, useState } from 'react';
import { todosAPI, categoriesAPI } from '../api';

const TaskDetails = ({ id, view }) => {
    const [task, setTask] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categoryPath, setCategoryPath] = useState('');

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
            result.push({ id: node.id, slashPath: path });
            node.children.forEach(child => traverse(child, path));
        }
        rootNodes.forEach(r => traverse(r, ''));

        return result; 
    }

    useEffect(() => {
        const fetchData = async () => {
            const categoriesData = await categoriesAPI.getRawCategories();
            const flatCategories = buildHierarchyAndFlatten(categoriesData);
            setCategories(flatCategories);

            const [todoData] = await Promise.all([
                todosAPI.getById(id),
            ]);
            setTask(todoData);
        };

        fetchData();
    }, [id]);


    useEffect(() => {
        if (task && categories.length > 0 && view.includes('category')) {
            const categoryIds = Array.isArray(task.category_ids)
                ? task.category_ids
                : JSON.parse(task.category_ids || '[]');

            const paths = categoryIds.map((categoryId) => {
                const category = categories.find((cat) => cat.id === categoryId);
                return category ? category.slashPath : 'Kategorie nicht gefunden';
            });

            setCategoryPath(paths.join(', '));
        }
    }, [task, categories, view]);



    if (!task) {
        return <p>Lädt...</p>;
    }

    return (
        <div className="task-details">
            {view.includes('title') && <p><strong>Titel:</strong> {task.title}</p>}
            {view.includes('id') && <p><strong>ID:</strong> {task.id}</p>}
            {view.includes('details') && <p><strong>Details:</strong> {task.details}</p>}
            {view.includes('w_score') && <p><strong>Wichtigkeits-Score:</strong> {task.w_score}</p>}
            {view.includes('d_score') && <p><strong>Dringlichkeits-Score:</strong> {task.d_score}</p>}
            {view.includes('p_score') && <p><strong>Prioritäts-Score:</strong> {task.p_score}</p>}
            {view.includes('hasDeadline') && (
                <p><strong>Deadline:</strong> {task.hasDeadline ? 'Ja' : 'Nein'}</p>
            )}
            {view.includes('deadl_datetime') && task.deadl_datetime && (
                <p><strong>Deadline-Datum:</strong> {new Date(task.deadl_datetime).toLocaleString()}</p>
            )}
            {view.includes('created_at') && (
                <p><strong>Erstellungsdatum:</strong> {new Date(task.created_at).toLocaleString()}</p>
            )}
            {view.includes('category') && (
                <p>
                    <strong>Kategorien:</strong> {categoryPath || 'Keine Kategorie'}
                </p>
            )}
            {view.includes('notify') && (
                <p><strong>Benachrichtigung:</strong> {task.notify ? 'Ja' : 'Nein'}</p>
            )}
            {view.includes('status') && <p><strong>Status:</strong> {task.status}</p>}
            {view.includes('done_at') && task.done_at && (
                <p><strong>Erledigt am:</strong> {new Date(task.done_at).toLocaleString()}</p>
            )}
        </div>
    );
};

export default TaskDetails;