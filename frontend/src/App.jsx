import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import NotFound from './pages/NotFound';

// TEMPORÄR: 
import DateTimeInput from './components/DateTimeInput';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/datetime" element={<DateTimeInput />} /> 
            </Routes>
        </Router>
    );
};

export default App;
