import React, { Fragment, useCallback, useContext, useEffect, useReducer, useRef } from 'react';
import Announcement from './components/Announcement';
import Country from './components/Country';
import useHttp from './CustomHooks/useHttp';
import InputContext from './store/InputContext';
import Chart from './components/Chart';
import Spinner from './UI/Spinner';

const descriptions = ['Confirmed Cases', 'Deaths', 'Recoveries'];
const cases = ['confirmed', 'recovered', 'deaths'];
const globalCases = ['cases', 'deaths', 'recovered'];

const App = React.memo(() => {
  const { error, countrySelector } = useHttp();
  const { country } = useContext(InputContext);
  const appropriateDataRef = useRef([]);
  const casesRef = useRef([]);

  const [{ isLoading, casesData, countryData }, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'LOADING': {
        return {
          ...state,
          isLoading: action.loading,
        }
      }
      case 'PERSISTING_PREVIOUS_DATA': {
        return {
          ...state,
          isLoading: action.loading,
          casesData: action.casesData,
          countryData: action.countryData
        }
      }
      default: {
        return state;
      }
    }
  }, {
    isLoading: false,
    casesData: [],
    countryData: []
  })

  const calculateAppropriateData = (keys, values, cases, country) => {
    casesRef.current = casesRef.current.concat(cases);
    values = values.map((element, index, array) =>
      index > 0 ? (element - array[index - 1] > 0 ? element - array[index - 1] : 0) : array[0]);
    const newArray = new Array(keys.length).fill().map((_, index) => ({ key: keys[index], value: values[index] }));
    appropriateDataRef.current = appropriateDataRef.current.concat({ country: country, case: cases, data: newArray });
    appropriateDataRef.current.length === 3 &&
      casesRef.current.sort() && dispatch({
        type: 'LOADING',
        loading: false
      });
  }

  const collectAppropriateData = useCallback((cases, country, data) => {
    if (country === 'Global') {
      const keys = Object.keys(data[cases]);
      const values = Object.values(data[cases]);
      calculateAppropriateData(keys, values, cases, country);
      return;
    }

    const reversedData = data[cases].reverse();
    const keys = Object.keys(reversedData.find(ctry => ctry['Country/Region'] === country)).slice(4);
    let values = Object.values(reversedData.find(ctry => ctry['Country/Region'] === country)).slice(4);

    if (!reversedData.find(ctry => ctry['Country/Region'] === country)['Province/State']) {
      calculateAppropriateData(keys, values, cases, country);
    } else {
      const array = Array.from({ length: keys.length }, () => 0);
      const dataPerProvinceOrState = reversedData.filter(ctry => ctry['Country/Region'] === country);
      dataPerProvinceOrState.forEach(element => Object.values(element).slice(4).forEach((el, index) => array[index] += el));
      calculateAppropriateData(keys, array, cases, country);
    }
  }, [])

  const appropriateCountryDataCalculation = useCallback((cases, url, extendUrl = false) => {
    cases.forEach(caseOfInterest => countrySelector({ url: extendUrl ? [url, caseOfInterest].join("") : url },
      collectAppropriateData.bind(null, caseOfInterest, country)));
  }, [country, collectAppropriateData, countrySelector])

  useEffect(() => {
    if (country === 'Global') {
      appropriateCountryDataCalculation(globalCases, "https://disease.sh/v3/covid-19/historical/all?lastdays=all");
    } else {
      appropriateCountryDataCalculation(cases, "https://covid2019-api.herokuapp.com/timeseries/", true);
    }
    return () => {
      dispatch({
        type: 'PERSISTING_PREVIOUS_DATA',
        loading: true,
        casesData: casesRef.current,
        countryData: appropriateDataRef.current
      });
      casesRef.current = [];
      appropriateDataRef.current = [];
    }
  }, [appropriateCountryDataCalculation, country])

  return (
    <Fragment>
      {isLoading &&
        <Spinner style={{
          top: 500,
          left: 830,
          zIndex: 1000,
          display: 'inline',
          position: 'fixed'
        }} />}
      <div style={{ marginLeft: '320px' }}>
        {
          descriptions.map((description, idx) =>
            <Announcement
              loading={isLoading}
              description={description}
              oldData={countryData[0] && countryData[0].country}
              caseOfInterest={isLoading ? casesData[idx] : casesRef.current[idx]}
              data={isLoading ? countryData : appropriateDataRef.current} />)
        }
      </div>
      <Country isNotEnabled={isLoading} />
      {!error ?
        <Chart
          caseOfInterest={isLoading ? casesData : casesRef.current}
          data={isLoading ? countryData : appropriateDataRef.current} />
        : <p>{error}</p>}
    </Fragment>
  );
})

export default App;