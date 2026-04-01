/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

const TafsirDataContext = createContext();
const TafsirActionsContext = createContext();

export const TafsirContextProvider = ({ children }) => {
    const [verseKey, setVerseKey] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: [`TAFSIR_VERSE_${verseKey}`, verseKey],
        queryFn: async () => {
            const res = await fetch(`https://api.quran.com/api/v4/tafsirs/15/by_ayah/${verseKey}?fields=text_imlaei`);
            return res.json();
        },
        enabled: !!verseKey,
        refetchOnWindowFocus: false
    });

    const openModal = useCallback((key) => {
        if (!key) return;
        setIsOpen(true);
        setVerseKey(key);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setVerseKey(null);
    }, []);

    const actions = useMemo(() => ({ openModal, closeModal }), [openModal, closeModal]);

    const dataValue = useMemo(() => ({
        verseKey,
        isOpen,
        data,
        isLoading
    }), [verseKey, isOpen, data, isLoading]);

    return (
        <TafsirDataContext.Provider value={dataValue}>
            <TafsirActionsContext.Provider value={actions}>
                {children}
            </TafsirActionsContext.Provider>
        </TafsirDataContext.Provider>
    );
};

export const useTafsirData = () => useContext(TafsirDataContext);
export const useTafsirActions = () => useContext(TafsirActionsContext);