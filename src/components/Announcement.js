import React, { useContext } from 'react';
import InputContext from '../store/InputContext';
import styles from './Announcement.module.css';

const Announcement = React.memo(({ description, caseOfInterest, oldData, loading, data = [] }) => {
    const inputContext = useContext(InputContext);
    const announcementData = data.filter(object => object.case === caseOfInterest);

    return (
        <article className={styles.Announcement}>
            <p style={{ fontSize: '30px' }}>{description}</p>
            <h1 style={{ fontSize: (inputContext.country.length > 30 || (oldData && oldData.length > 30)) && '17px' }}>
                {loading ? oldData : inputContext.country}
            </h1>
            <h2>{announcementData.map(object => object.data[object.data.length - 1].key)}</h2>
            <h3>{announcementData.map(object => object.data[object.data.length - 1].value)} cases</h3>
            <h4>{caseOfInterest}</h4>
        </article>
    );
})

export default Announcement;