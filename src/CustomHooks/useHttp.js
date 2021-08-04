import { useCallback, useState } from 'react';

const catchError = errorFunction => fn => (requestConfig, getAllData) =>
    fn(requestConfig, getAllData).catch(err => errorFunction(err.message));

const useHttp = () => {
    const [error, setError] = useState(null);

    const countrySelector = useCallback(catchError(setError)(async (requestConfig, getAllData) => {
        setError(null);
        const response = await fetch(requestConfig.url);
        if (!response.ok) {
            throw new Error("An error occured!");
        }
        const data = await response.json();
        getAllData(data);
    }), []);

    return { error, countrySelector }
}

export default useHttp;