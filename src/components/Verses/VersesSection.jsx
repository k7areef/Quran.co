/**
 * @typedef {Object} VersesSectionProps
 * @prop {string} [className='']
 * @prop {boolean} [isLoading=true]
 * @prop {object} data
 */

import React from "react";
import SearchForm from "@components/common/SearchForm";
import VerseCard from "./VerseCard";
import { useSettings } from "@contexts/SettingsContext";
import { List, useDynamicRowHeight, useListRef } from "react-window";
import { useAudioPlayer } from "@contexts/AudioPlayerContext";

/**
 * @param {VersesSectionProps} props
 */
function VersesSection({ className, isLoading, data }) {

    const { textType } = useSettings();
    const { activeVerse } = useAudioPlayer();
    const [searchVal, setSearchVal] = React.useState("");

    // Filter verses by search value
    const filteredVerses = React.useMemo(() => {
        const verses = data?.verses || [];
        if (!searchVal) return verses;
        return verses.filter(v => v.text_imlaei.includes(searchVal));
    }, [data?.verses, searchVal]);

    // Handle search input change
    const handleSearchVal = React.useCallback((e) => {
        setSearchVal(e.target.value.trim());
    }, []);

    const listRef = useListRef(null);

    const rowHeight = useDynamicRowHeight({
        defaultRowHeight: 50
    });

    const Row = React.useCallback(({ index, style }) => {
        const verse = filteredVerses[index];
        return (
            <div style={style} className="pb-2 px-2">
                <VerseCard
                    verse={verse}
                    key={verse.id}
                    searchVal={searchVal}
                    textType={textType}
                    listRef={listRef}
                    index={index}
                />
            </div>
        );
    }, [filteredVerses, listRef, searchVal, textType]);

    const activeIndex = React.useMemo(() => {
        if (!activeVerse) return -1;
        return filteredVerses.findIndex(v => v.verse_key === activeVerse.verse_key);
    }, [filteredVerses, activeVerse]);

    React.useEffect(() => {
        if (activeIndex !== -1 && listRef.current) {
            listRef.current.scrollToRow({
                index: activeIndex,
                align: "start",
                behavior: "smooth"
            });
        }
    }, [activeIndex, listRef]);

    return (
        <section className={`verses flex flex-col gap-3 h-full min-h-0 ${className}`} id="verses">
            {/* Search Form */}
            <SearchForm onChange={handleSearchVal} className="shrink-0" placeholder={`البحث...`} id="verses_search" name="verses_search" />
            {/* Verses Container */}
            <div className="section-content bg-card border-2 border-border rounded-lg h-full min-h-0 relative overflow-y-auto space-y-2">
                {isLoading ? (
                    <div className="p-3">Loading...</div>
                ) : (
                    <List
                        listRef={listRef}
                        rowComponent={Row}
                        rowHeight={rowHeight}
                        rowProps={{ filteredVerses }}
                        rowCount={filteredVerses.length}
                        style={{ paddingTop: '8px', paddingBottom: '8px' }}
                        key={data?.verses[0]?.id || "default"}
                    />
                )}
            </div>
        </section>
    )
}

export default VersesSection;