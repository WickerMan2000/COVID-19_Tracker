import React, { useContext } from 'react';
import InputContext from '../store/InputContext';
import styles from './Announcement.module.css';

const Announcement = React.memo(({ index, description, data }) => {
    const inputContext = useContext(InputContext);

    console.log(data);

    return (
        <div className={[styles.Announcement, { 'grid-column': index + 2 / 5 }].join(' ')}>
            <h1>{inputContext.country}</h1>
            <h2>Number</h2>
            <h3>Date</h3>
            <h4>{description}</h4>
        </div>
    );
})

export default Announcement;