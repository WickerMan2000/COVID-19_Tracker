import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import styles from './Chart.module.css';

const Chart = React.memo(({ data, covidState }) => {
    const [chartData, setChartData] = useState({});

    const colors = ['blue', 'red', 'green'];
    const depData = cs => data.filter(object => object.case === cs);
    const newCovidState = colors.map((color, index) => ({ cov: covidState[index], color: color }));

    useEffect(() => {
        setChartData({
            labels: depData(covidState[0]).map(({ data }) => data.map(({ key }) => key))[0],
            datasets: newCovidState.map(({ cov, color }) => ({
                data: depData(cov).map(({ data }) => data.map(({ value }) => value))[0],
                backgroundColor: color,
                hoverBackgroundColor: 'white',
                hoverBorderWidth: 20,
                borderwidth: 10,
                label: cov,
                fill: true
            }))
        });
    }, [data])

    return (
        <div className={styles.Chart}>
            <div>
                <Bar data={chartData} options={{
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        },
                    },
                    layout: {
                        padding: {
                            left: 150,
                            right: 150,
                            top: 10,
                            bottom: 300
                        }
                    },
                    plugins: {
                        tooltip: {
                            events: ['mousemove']
                        },
                        title: {
                            display: true,
                            text: 'Custom Chart Title'
                        }
                    }
                }} />
            </div>
        </div>
    );
})

export default Chart;