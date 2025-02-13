import { createContext } from 'react';
import React, { useState, useEffect } from 'react';

const BadgerPrefContext = createContext();

export const BadgerPrefProvider = ({ children }) => {
    const [prefs, setPrefs] = useState([]);

    return (
        <BadgerPrefContext.Provider value = {{ prefs, setPrefs }}>
            {children}
            </BadgerPrefContext.Provider>
    );
};

export default BadgerPrefContext;
