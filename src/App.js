import React, { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Announcement from './components/Announcement';
import Country from './components/Country';
import useHttp from './CustomHooks/useHttp';
import InputContext from './store/InputContext';
import Chart from './components/Chart';
import Spinner from './UI/Spinner';
import styles from './App.module.css'

const descriptions = [
  'Number of confirmed cases of COVID-19.',
  'Number of deaths from COVID-19',
  'Number of recoveries caused by COVID-19'
];

const cases = ['confirmed', 'recovered', 'deaths'];
const globalCases = ['cases', 'deaths', 'recovered'];

const App = React.memo(() => {
  const { error, countrySelector } = useHttp();
  const [isLoading, setIsLoading] = useState(true);
  const { country } = useContext(InputContext);
  const appropriateDataRef = useRef([]);
  const casesRef = useRef([]);

  const calculateAppropriateData = (keys, values, cases, country) => {
    casesRef.current = casesRef.current.concat(cases);
    values = values.map((element, index, array) =>
      index > 0 ? (element - array[index - 1] > 0 ? element - array[index - 1] : 0) : array[0]);
    const newArray = new Array(keys.length).fill().map((_, index) => ({ key: keys[index], value: values[index] }));
    appropriateDataRef.current = appropriateDataRef.current.concat({ country: country, case: cases, data: newArray });
    appropriateDataRef.current.length === 3 && casesRef.current.sort();
    appropriateDataRef.current.length === 3 && setIsLoading(false);
  }

  const collectAppropriateData = useCallback(async (cases, country, data) => {
    if (country === 'Global') {
      const keys = Object.keys(data[cases]);
      const values = Object.values(data[cases]);
      calculateAppropriateData(keys, values, cases, country);
      return;
    }

    const reversedData = await data[cases].reverse();
    const keys = Object.keys(reversedData.find(ctry => ctry['Country/Region'] === country)).slice(4);
    let values = Object.values(reversedData.find(ctry => ctry['Country/Region'] === country)).slice(4);

    if (!reversedData.find(ctry => ctry['Country/Region'] === country)['Province/State']) {
      calculateAppropriateData(keys, values, cases, country);
    } else {
      const array = Array.from({ length: keys.length }, () => 0);
      const dataPerProvinceOrState = await reversedData.filter(ctry => ctry['Country/Region'] === country);
      dataPerProvinceOrState.forEach(element => Object.values(element).slice(4).forEach((el, index) => array[index] += el));
      calculateAppropriateData(keys, array, cases, country);
    }
  }, [])

  const appropriateCountryDataCalculation = useCallback((cases, url, extendUrl = false) => {
    cases.forEach(covidState => countrySelector({ url: extendUrl ? [url, covidState].join("") : url },
      collectAppropriateData.bind(null, covidState, country)));
  }, [country, collectAppropriateData, countrySelector])

  useEffect(() => {
    if (country === 'Global') {
      appropriateCountryDataCalculation(globalCases, "https://disease.sh/v3/covid-19/historical/all?lastdays=all");
    } else {
      appropriateCountryDataCalculation(cases, "https://covid2019-api.herokuapp.com/timeseries/", true);
    }
    return () => {
      setIsLoading(true);
      casesRef.current = [];
      appropriateDataRef.current = [];
    }
  }, [appropriateCountryDataCalculation, country])

  return (
    <Fragment>
      {isLoading && <Spinner style={{
        top: 500,
        left: 800,
        zIndex: 1000,
        display: 'inline',
        position: 'fixed'
      }} />}
      <div className={styles.Container}>
        {
          descriptions.map((description, idx) =>
            <Announcement
              index={idx}
              covidState={casesRef.current[idx]}
              description={description}
              data={appropriateDataRef.current} />)
        }
        <Country isEnabled={isLoading} />
        {!error ? <Chart
          covidState={casesRef.current}
          data={appropriateDataRef.current} />
          : <p>{error}</p>}
      </div>
    </Fragment>
  );
})

export default App;