import React from "react";
import { useQuery } from "@tanstack/react-query";

const TafsirContext = React.createContext();

export const TafsirContextProvider = ({ children }) => {

    const [verseKey, setVerseKey] = React.useState(null);
    const [isOpen, setIsOpen] = React.useState(false);

    const { data, isLoading } = useQuery({
        queryKey: [`TAFSIR_VERSE_${verseKey}`, verseKey],
        queryFn: async () => {
            const res = await fetch(`https://api.quran.com/api/v4/tafsirs/15/by_ayah/${verseKey}?fields=text_imlaei`);
            return res.json();
        },
        enabled: !!verseKey,
        refetchOnWindowFocus: false
    });

    const openModal = React.useCallback((verseKey) => {
        if (!verseKey) return;
        setIsOpen(true);
        setVerseKey(verseKey);
    }, []);

    const closeModal = React.useCallback(() => {
        setIsOpen(false);
        setVerseKey(null);
    }, []);

    const value = {
        verseKey,
        isOpen,
        openModal,
        closeModal,
        data,
        isLoading
    };

    return (
        <TafsirContext.Provider value={value}>
            {children}
        </TafsirContext.Provider>
    )
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTafsir = () => React.useContext(TafsirContext);