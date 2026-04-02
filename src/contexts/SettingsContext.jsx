/* eslint-disable react-refresh/only-export-components */
import React from "react";

const SettingsContext = React.createContext();

export const SettingsContextProvider = ({ children }) => {

    const [textType, setTextType] = React.useState({ key: "text_uthmani", label: "رسم عثماني (برواية حفص)" });

    const value = {
        textType,
        setTextType
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
};

export const useSettings = () => React.useContext(SettingsContext);