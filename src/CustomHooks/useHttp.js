import { useCallback, useState } from 'react';

const catchError = (errorFunction, loadingFunction) => fn => (requestConfig, getAllData) =>
    fn(requestConfig, getAllData).catch(err => errorFunction(err.message), loadingFunction(false));

const useHttp = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const countrySelector = useCallback(catchError(setError, setIsLoading)(async (requestConfig, getAllData) => {
        setIsLoading(true);
        const response = await fetch(requestConfig.url);
        if (!response.ok) {
            throw new Error("An error occured!");
        }
        const data = await response.json();
        getAllData(data);
    }), []);

    return { error, isLoading, countrySelector }
}

export default useHttp;