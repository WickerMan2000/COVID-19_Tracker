import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import styles from './Chart.module.css';

const Chart = React.memo(({ data, covidState }) => {
    const [chartData, setChartData] = useState({});
    const depictedData = data.filter(object => object.case === "confirmed");

    useEffect(() => {
        setChartData({
            labels: depictedData.map(({ data }) => data.map(({ key }) => key))[0],
            datasets: [
                {
                    label: 'Per Day',
                    data: depictedData.map(({ data }) => data.map(({ value }) => value))[0],
                    backgroundColor: 'lightblue',
                    borderwidth: 1,
                    hoverBorderWidth: 20,
                    hoverBackgroundColor: 'green',
                    fill: true
                }
            ]
        });
    }, [data])

    return (
        <div className={styles.Chart}>
            <div>
                <Line data={chartData} options={{
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        },
                    },
                    plugins: {
                        tooltip: {
                            events: ['click']
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