import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LinearScale,
    PointElement,
} from 'chart.js';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LinearScale,
    PointElement
);

const EisenhowerGraph = ({ tasks }) => {
    const data = {
        datasets: tasks.map((todo) => ({
            label: todo.title,
            data: [{ x: todo.d_score, y: todo.w_score }],
            backgroundColor: '#FF6384',
        })),
    };

    const options = {
        scales: {
            x: {
                title: { display: true, text: 'Dringlichkeit' },
                min: 1,
                max: 10,
            },
            y: {
                title: { display: true, text: 'Wichtigkeit' },
                min: 1,
                max: 10,
            },
        },
    };

    return <Scatter data={data} options={options} />;
};

export default EisenhowerGraph;