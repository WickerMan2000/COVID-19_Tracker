import React from 'react';
import styles from './Spinner.module.css';

const Spinner = ({ style }) => {
    return (
        <div style={style} className={styles.Loader}>Loading...</div>
    );
}

export default Spinner;