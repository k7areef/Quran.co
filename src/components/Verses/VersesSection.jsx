/**
 * @typedef {Object} VersesSectionProps
 * @prop {string} [className='']
 */

import SearchForm from "@components/common/SearchForm";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import VerseCard from "./VerseCard";
import React from "react";

/**
 * @param {VersesSectionProps} props
 */
function VersesSection({ className }) {

    const { chapterId } = useParams();

    const { data, isLoading } = useQuery({
        queryKey: [`VERSES_CHAPTERS_${chapterId}`, chapterId],
        queryFn: async () => {
            const params = {
                fields: "text_imlaei,text_uthmani",
                translations: 85
            };
            const res = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${chapterId}?fields=${params["fields"]}&translations=${params["translations"]}&per_page=1000`);
            return res.json();
        },
        initialData: () => {
            const saved = localStorage.getItem(`verses_chapter_${chapterId}`);
            return saved ? { verses: JSON.parse(saved) } : undefined;
        },
        enabled: !!chapterId,
        refetchOnWindowFocus: false
    });

    React.useEffect(() => { // Handle Local Storage:
        if (!data || !chapterId) return;
        localStorage.setItem(`verses_chapter_${chapterId}`, JSON.stringify(data?.verses));
    }, [data, chapterId]);

    return (
        <section className={`verses flex flex-col gap-5 h-full min-h-0 ${className}`} id="verses">
            {/* Search */}
            <SearchForm
                id="verses_search"
                name="verses_search"
                className="shrink-0"
                placeholder={`البحث في سورة ${"الفاتحة"}...`}
            />
            {/* Section Content */}
            <div className="section-content bg-card border-2 border-border rounded-lg p-3 h-full min-h-0 overflow-y-auto">
                {/* Verses */}
                <div className="verses space-y-2">
                    {isLoading ? (
                        <>Loading...</>
                    ) : (
                        (data?.verses || []).map((verse, index) => (<VerseCard verse={verse} key={index} />))
                    )}
                </div>
            </div>
        </section>
    )
}

export default VersesSection;