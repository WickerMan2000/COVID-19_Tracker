import React, { useContext } from 'react';
import InputContext from '../store/InputContext';
import styles from './Announcement.module.css';

const Announcement = React.memo(({ index, description, covidState, data = [] }) => {
    const inputContext = useContext(InputContext);
    const announcementData = data.filter(object => object.case === covidState);

    // console.log(announcementData)

    return (
        <div className={[styles.Announcement, { 'grid-column': index + 2 / 5 }].join(' ')}>
            <h1>{inputContext.country}</h1>
            <h2>{announcementData.map(object => object.data[object.data.length - 1].key)}</h2>
            <h3>{announcementData.map(object => object.data[object.data.length - 1].value)} cases</h3>
            <h4>{covidState}</h4>
            <h5>{description}</h5>
        </div>
    );
})

export default Announcement;