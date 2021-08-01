import React from 'react';

const InputContext = React.createContext({
    country: '',
    dispatch: () => { }
});

export default InputContext;