import { useReducer } from "react"
import InputContext from '../store/InputContext';

const defaultState = { country: 'Global' };

const inputReducer = (_, action) => {
    if (action.type === "selectCountry") {
        return {
            country: action.country
        }
    }
    return defaultState;
}

const InputContextProvider = ({ children }) => {
    const [inputState, dispatchInput] = useReducer(inputReducer, defaultState);

    const inputContext = {
        country: inputState.country,
        dispatch: dispatchInput
    }

    return (
        <InputContext.Provider value={inputContext}>
            {children}
        </InputContext.Provider>
    );
}

export default InputContextProvider;