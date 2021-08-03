import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Announcement from './components/Announcement';
import Country from './components/Country';
import useHttp from './CustomHooks/useHttp';
import InputContext from './store/InputContext';
import Chart from './components/Chart';
import styles from './App.module.css'

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

  const calculateAppropriateData = (keys, values, cases, country) => {
    values = values.map((element, index, array) =>
      index > 0 ? (element - array[index - 1] > 0 ? element - array[index - 1] : 0) : array[0]);
    const newArray = new Array(keys.length).fill().map((_, index) => ({ key: keys[index], value: values[index] }));
    appropriateDataRef.current = appropriateDataRef.current.concat({ country: country, case: cases, data: newArray });
    appropriateDataRef.current.length === 3 && setReady(true);
  }

  const collectAppropriateData = useCallback(async (cases, country, data) => {
    const reversedData = await data[cases].reverse();
    const keys = Object.keys(reversedData.find(ctry => ctry['Country/Region'] === country)).slice(4);
    let values = Object.values(reversedData.find(ctry => ctry['Country/Region'] === country)).slice(4);

    if (!reversedData.find(ctry => ctry['Country/Region'] === country)['Province/State']) {
      calculateAppropriateData(keys, values, cases, country);
    } else {
      const array = Array.from({ length: values.length }, () => 0);
      const dataPerProvinceOrState = await reversedData.filter(ctry => ctry['Country/Region'] === country);
      dataPerProvinceOrState.forEach(element => Object.values(element).slice(4).forEach((el, index) => array[index] += el));
      calculateAppropriateData(keys, array, cases, country);
    }
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
          <Announcement
            index={idx}
            covidState={cases[idx]}
            description={description}
            data={appropriateDataRef.current} />)
      }
      <Country />
      <Chart
        covidState={cases[0]}
        data={appropriateDataRef.current} />
    </div>
  );
})

export default App;