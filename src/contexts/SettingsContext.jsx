/* eslint-disable react-refresh/only-export-components */
import React from "react";

const SettingsContext = React.createContext();

export const SettingsContextProvider = ({ children }) => {

    const [textType, setTextType] = React.useState({ key: "text_uthmani", label: "رسم عثماني (برواية حفص)" });
    const [translator, setTranslator] = React.useState({ key: 85, label: "عبد الحليم" });
    const [reciter, setReciter] = React.useState({ key: 2, label: "عبد الباسط عبد الصمد" });

    const [isChaptersSidebarOpen, setIsChaptersSidebarOpen] = React.useState(false);

    const value = {
        textType,
        setTextType,
        translator,
        setTranslator,
        reciter,
        setReciter,
        isChaptersSidebarOpen,
        setIsChaptersSidebarOpen
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
};

export const useSettings = () => React.useContext(SettingsContext);