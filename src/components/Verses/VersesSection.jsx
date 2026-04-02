/**
 * @typedef {Object} VersesSectionProps
 * @prop {string} [className='']
 */

import React from "react";
import SearchForm from "@components/common/SearchForm";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import VerseCard from "./VerseCard";

// Highlighted Name Comp:
const HighlightedName = ({ name, search }) => {
    if (!search) return <span>{name}</span>;

    const regex = new RegExp(`(${search})`, 'gi');

    const parts = name.split(regex);

    return (
        <>
            {parts.map((part, index) =>
                regex.test(part) ? (
                    <span key={index} className="text-warning">{part}</span>
                ) : (
                    <span key={index}>{part}</span>
                )
            )}
        </>
    );
};

/**
 * @param {VersesSectionProps} props
 */
function VersesSection({ className }) {

    const { chapterId } = useParams();
    const [searchVal, setSearchVal] = React.useState("");

    const { data, isLoading } = useQuery({
        queryKey: [`VERSES_CHAPTERS_${chapterId}`, chapterId],
        queryFn: async () => {
            const params = {
                fields: "text_imlaei,text_uthmani",
                translations: 85
            };
            const res = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${chapterId}?fields=${params["fields"]}&translations=${params["translations"]}&per_page=1000`);
            const data = await res.json();
            localStorage.setItem(`verses_chapter_${chapterId}`, JSON.stringify(data?.verses));
            return data;
        },
        initialData: () => {
            const saved = localStorage.getItem(`verses_chapter_${chapterId}`);
            return saved ? { verses: JSON.parse(saved) } : undefined;
        },
        enabled: !!chapterId,
        refetchOnWindowFocus: false
    });

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