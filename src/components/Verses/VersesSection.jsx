/**
 * @typedef {Object} VersesSectionProps
 * @prop {string} [className='']
 * @prop {boolean} [isLoading=true]
 * @prop {object} data
 */

import React from "react";
import SearchForm from "@components/common/SearchForm";
import VerseCard from "./VerseCard";

/**
 * @param {VersesSectionProps} props
 */
function VersesSection({ className, isLoading, data }) {

    console.log(data);


    const [searchVal, setSearchVal] = React.useState("");

    const filteredVerses = React.useMemo(() => { // Filter verses by search value
        const verses = data?.verses || [];
        if (!searchVal) return verses;
        return verses.filter(v => v.text_imlaei.includes(searchVal));
    }, [data?.verses, searchVal]);

    const handleSearchVal = React.useCallback((e) => { // Handle search input change
        setSearchVal(e.target.value.trim());
    }, []);

    return (
        <section className={`verses flex flex-col gap-5 h-full min-h-0 ${className}`} id="verses">
            {/* Search Form */}
            <SearchForm onChange={handleSearchVal} className="shrink-0" placeholder={`البحث...`} id="verses_search" name="verses_search" />
            {/* Verses Container */}
            <div className="section-content bg-card border-2 border-border rounded-lg h-full min-h-0 relative overflow-y-auto p-2 space-y-2">
                {isLoading ? (
                    <div className="p-3">Loading...</div>
                ) : (
                    filteredVerses.map((verse) => (
                        <VerseCard verse={verse} key={verse.id} searchVal={searchVal} />
                    ))
                )}
            </div>
        </section>
    )
}

export default VersesSection;