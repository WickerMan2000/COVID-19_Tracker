import { useReducer } from "react"
import InputContext from '../store/InputContext';

const defaultState = { country: 'Global' };

const { Provider } = InputContext;

const InputContextProvider = ({ children }) => {
    const [inputState, dispatchInput] = useReducer((state, action) => {
        if (action.type === "SELECT_COUNTRY") {
            return {
                country: action.country
            }
        }
        return state;
    }, defaultState);

    const inputContext = {
        country: inputState.country,
        dispatch: dispatchInput
    }

    return (
        <Provider value={inputContext}>
            {children}
        </Provider>
    );
}

export default InputContextProvider;