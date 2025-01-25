import React, { useState, useEffect } from 'react';
import EisenhowerMatrix from '../components/EisenhowerMatrix';
import EisenhowerGraph from '../components/EisenhowerGraph';
import { todosAPI, categoriesAPI } from '../api';
import TaskDetails from '../components/TaskDetails';

const Tasks = () => {
    const [todos, setTodos] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(new Set(['none']));
    const [statuses, setStatuses] = useState(new Set(['todo', 'inProgress']));

    useEffect(() => {
        const fetchTodosAndCategories = async () => {
            const [todosData, categoriesData] = await Promise.all([
                todosAPI.getAll(),
                categoriesAPI.getAll(),
            ]);

            setTodos(todosData);
            const allCategoryIds = new Set();
            const collectCategoryIds = (categories) => {
                categories.forEach((cat) => {
                    allCategoryIds.add(cat.id);
                    if (cat.children) {
                        collectCategoryIds(cat.children);
                    }
                });
            };
            collectCategoryIds(categoriesData);

            setCategories(categoriesData);
            setSelectedCategories((prev) => new Set([...prev, ...allCategoryIds]));
            setFilteredTodos(todosData);
        };

        fetchTodosAndCategories();
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            let filtered = todos;
            if (selectedCategories.size > 0) {
                filtered = filtered.filter((todo) => {
                    const todoCategories = Array.isArray(todo.category_ids)
                        ? todo.category_ids
                        : JSON.parse(todo.category_ids || '[]');

                    if (selectedCategories.has('none') && todoCategories.length === 0) {
                        return true;
                    }

                    return todoCategories.some((catId) =>
                        isCategorySelected(catId, selectedCategories, categories)
                    );
                });
            }

            if (statuses.size > 0) {
                filtered = filtered.filter((todo) => statuses.has(todo.status));
            }

            setFilteredTodos(filtered);
        };

        applyFilters();
    }, [selectedCategories, statuses, todos]);

    const isCategorySelected = (categoryId, selected, categories) => {
        if (selected.has(categoryId)) return true;

        const findCategory = (categories, id) => {
            for (const cat of categories) {
                if (cat.id === id) return cat;
                if (cat.children) {
                    const found = findCategory(cat.children, id);
                    if (found) return found;
                }
            }
            return null;
        };

        const category = findCategory(categories, categoryId);
        if (category && category.parent_id) {
            return isCategorySelected(category.parent_id, selected, categories);
        }
        return false;
    };

    const handleCategoryChange = (categoryId, isChecked) => {
        setSelectedCategories((prev) => {
            const updated = new Set(prev);
            if (isChecked) {
                updated.add(categoryId);
            } else {
                updated.delete(categoryId);
            }
            return updated;
        });
    };

    const handleSelectAll = () => {
        const allCategoryIds = new Set();
        const collectCategoryIds = (categories) => {
            categories.forEach((cat) => {
                allCategoryIds.add(cat.id);
                if (cat.children) {
                    collectCategoryIds(cat.children);
                }
            });
        };
        collectCategoryIds(categories);

        if (selectedCategories.size === allCategoryIds.size + 1) {
            setSelectedCategories(new Set());
        } else {
            setSelectedCategories(new Set([...allCategoryIds, 'none']));
        }
    };

    const handleStatusChange = (status, isChecked) => {
        setStatuses((prev) => {
            const updated = new Set(prev);
            if (isChecked) {
                updated.add(status);
            } else {
                updated.delete(status);
            }
            return updated;
        });
    };

    const view = ['id', 'title', 'w_score', 'd_score', 'p_score', 'category', 'hasDeadline', 'deadl_datetime', 'created_at', 'notify', 'status', 'done_at'];
    const testId = 4;

    const renderCategories = (categories) => {
        return categories.map((category) => (
            <div key={category.id} style={{ marginLeft: `${category.parent_id ? 20 : 0}px` }}>
                <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={selectedCategories.has(category.id)}
                    onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                />
                <label htmlFor={`category-${category.id}`}>{category.title}</label>
                {category.children && renderCategories(category.children)}
            </div>
        ));
    };

    const countAllCategories = (categories) => {
        let count = 0;
        const countRecursive = (categories) => {
            categories.forEach((cat) => {
                count += 1;
                if (cat.children) {
                    countRecursive(cat.children);
                }
            });
        };
        countRecursive(categories);
        return count;
    };

    return (
        <div>
            <h1>Aufgabenübersicht</h1>
            <div>
                <h2>Kategorien</h2>
                <button onClick={handleSelectAll}>
                    {selectedCategories.size === countAllCategories(categories) + 1 ? 'Unselect all' : 'Select all'}
                </button>


                <div>
                    <input
                        type="checkbox"
                        id="category-none"
                        checked={selectedCategories.has('none')}
                        onChange={(e) => {
                            setSelectedCategories((prev) => {
                                const updated = new Set(prev);
                                if (e.target.checked) updated.add('none');
                                else updated.delete('none');
                                return updated;
                            });
                        }}
                    />
                    <label htmlFor="category-none">Ohne Kategorie</label>
                </div>
                {renderCategories(categories)}
            </div>
            <h2>Status</h2>
            {['todo', 'inProgress', 'done', 'putOff'].map((status) => (
                <div key={status}>
                    <input
                        type="checkbox"
                        id={`status-${status}`}
                        checked={statuses.has(status)}
                        onChange={(e) => handleStatusChange(status, e.target.checked)}
                    />
                    <label htmlFor={`status-${status}`}>
                        {status === 'todo'
                            ? 'To-Do'
                            : status === 'inProgress'
                                ? 'In Bearbeitung'
                                : status === 'done'
                                    ? 'Erledigt'
                                    : 'Aufgeschoben'}
                    </label>
                </div>
            ))}

            <EisenhowerMatrix tasks={filteredTodos} />
            <EisenhowerGraph tasks={filteredTodos} />
            <div>
                <h1>TaskDetails-Test (id={testId}):</h1>
                <TaskDetails id={testId} view={view} />
            </div>
        </div>
    );
};

export default Tasks;
