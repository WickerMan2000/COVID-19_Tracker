import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Announcement from './components/Announcement';
import Country from './components/Country';
import styles from './App.module.css'
import useHttp from './CustomHooks/useHttp';
import InputContext from './store/InputContext';

const descriptions = [
  'Number of confirmed cases of COVID-19.',
  'Number of recoveries from COVID-19',
  'Number of deaths caused by COVID-19'
];

const cases = ['confirmed', 'recovered', 'deaths'];

const App = React.memo(() => {
  const { error, isLoading, countrySelector } = useHttp();
  const [_, setReady] = useState(false);
  const appropriateDataRef = useRef([]);
  const inputContext = useContext(InputContext);

  const collectAppropriateData = useCallback(async (cases, country, data) => {
    const keys = await Object.keys(data[cases].find(ctry => ctry['Country/Region'] === country)).slice(4);
    let values = await Object.values(data[cases].find(ctry => ctry['Country/Region'] === country)).slice(4);

    if (data[cases].find(ctry => ctry['Country/Region'] === country)['Province/State']) {
      const array = Array.from({ length: values.length }, () => 0);
      const dataPerProvinceOrState = await data[cases].filter(ctry => ctry['Country/Region'] === country);
      dataPerProvinceOrState.forEach(element => Object.values(element).slice(4).forEach((el, index) => array[index] += el));
      values = array;
    }

    values = values.map((element, index, array) => index > 0 ? element - array[index - 1] : array[0]);
    const newArray = new Array(keys.length).fill().map((_, index) => ({ key: keys[index], value: values[index] }));
    appropriateDataRef.current = appropriateDataRef.current.concat({ country: country, case: cases, data: newArray });
    appropriateDataRef.current.length === 3 && setReady(true);
  }, [])

  useEffect(() => {
    setReady(false);
    appropriateDataRef.current = [];
    inputContext.country && cases.forEach(covidState => countrySelector({ url: `https://covid2019-api.herokuapp.com/timeseries/${covidState}` },
      collectAppropriateData.bind(null, covidState, inputContext.country)));
  }, [countrySelector, collectAppropriateData, inputContext.country])

  return (
    <div className={styles.Container}>
      {
        descriptions.map((description, idx) =>
          <Announcement description={description} index={idx} data={appropriateDataRef.current[idx]} />)
      }
      <Country />
    </div>
  );
})

export default App;