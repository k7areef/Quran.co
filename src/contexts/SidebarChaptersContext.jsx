/* eslint-disable react-refresh/only-export-components */
import React from "react";

const SidebarChaptersContext = React.createContext();

export const SidebarChaptersContextProvider = ({ children }) => {

    const [isChaptersSidebarOpen, setIsChaptersSidebarOpen] = React.useState(false);

    const value = {
        isChaptersSidebarOpen,
        setIsChaptersSidebarOpen,
    };

    return (
        <SidebarChaptersContext.Provider value={value}>
            {children}
        </SidebarChaptersContext.Provider>
    )
};

export const useSidebarChapters = () => React.useContext(SidebarChaptersContext);