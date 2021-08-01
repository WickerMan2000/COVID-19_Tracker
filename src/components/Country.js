import React, { useCallback, useContext, useEffect, useState } from 'react';
import InputContext from '../store/InputContext';
import useHttp from '../CustomHooks/useHttp';
import styles from './Country.module.css';

const Country = () => {
    const [countries, setCountries] = useState([]);
    const { error, isLoading, countrySelector } = useHttp();
    const context = useContext(InputContext);

    const getListOfAllCountries = useCallback(async data => {
        const filteredObject = {};
        const result = await data.confirmed.map((_, index) => {
            return {
                country: data.confirmed[index]['Country/Region']
            }
        });
        const filteredResult = result.filter(object => !filteredObject[object.country] && (filteredObject[object.country] = true));
        setCountries(filteredResult);
    }, [])

    const selectHandler = event => {
        const { value } = event.target;
        context.dispatch({ type: 'selectCountry', country: value });
    }

    useEffect(() => {
        countrySelector({ url: 'https://covid2019-api.herokuapp.com/timeseries/confirmed' }, getListOfAllCountries);
    }, [getListOfAllCountries, countrySelector])

    return (
        <div className={styles.Country}>
            {!isLoading && error && <p style={{ 'color': 'red' }}>{error}</p>}
            <select name="country" onChange={selectHandler}>
                {
                    countries.map((ctry, index) =>
                        <option key={index} value={ctry.country}>{ctry.country}</option>
                    )
                }
            </select>
        </div>
    );
}

export default Country;