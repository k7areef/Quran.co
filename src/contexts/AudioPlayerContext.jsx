/* eslint-disable react-refresh/only-export-components */
import React from "react";

const AudioPlayerContext = React.createContext();

export const AudioPlayerContextProvider = ({ children }) => {

    const [currentTime, setCurrentTime] = React.useState(0);
    const [activeVerse, setActiveVerse] = React.useState(null);
    const [timestamps, setTimestamps] = React.useState([]);

    const value = {
        currentTime, setCurrentTime,
        activeVerse, setActiveVerse,
        timestamps, setTimestamps
    };

    return (
        <AudioPlayerContext.Provider value={value}>
            {children}
        </AudioPlayerContext.Provider>
    )
};

export const useAudioPlayer = () => React.useContext(AudioPlayerContext);