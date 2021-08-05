import React from 'react';

const InputContext = React.createContext({
    country: 'Global',
    dispatch: () => { }
});

export default InputContext;