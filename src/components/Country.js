import React, { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import InputContext from '../store/InputContext';
import useHttp from '../CustomHooks/useHttp';
import Spinner from '../UI/Spinner';
import styles from './Country.module.css';

const Country = ({ isEnabled }) => {
    const [countries, setCountries] = useState([{ country: 'Global' }]);
    const { error, countrySelector } = useHttp();
    const { dispatch } = useContext(InputContext);

    const getListOfAllCountries = useCallback(async data => {
        const filteredObject = {};
        const result = await data.confirmed.map((_, index) => {
            return {
                country: data.confirmed[index]['Country/Region']
            }
        });
        const filteredResult = result.filter(({ country }) => !filteredObject[country] && (filteredObject[country] = true));
        setCountries(state => state.concat(filteredResult));
    }, [])

    const selectHandler = event => {
        const { value } = event.target;
        dispatch({ type: 'selectCountry', country: value });
    }

    useEffect(() => {
        countrySelector({ url: 'https://covid2019-api.herokuapp.com/timeseries/confirmed' }, getListOfAllCountries);
    }, [getListOfAllCountries, countrySelector])

    return (
        <Fragment>
            {countries.length <= 1 && <Spinner style={{
                top: 230,
                left: 270,
                zIndex: 1000,
                display: 'inline',
                position: 'fixed'
            }} />}
            <div className={styles.Country}>
                {error && <p style={{ 'color': 'red' }}>{error}</p>}
                <select name="country" onChange={selectHandler} disabled={countries.length <= 1 || isEnabled}>
                    {
                        countries.map(({ country }, index) =>
                            <option key={index} value={country}>{country}</option>
                        )
                    }
                </select>
            </div>
        </Fragment>
    );
}

export default Country;