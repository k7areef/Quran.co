/**
 * @typedef {Object} VersesSectionProps
 * @prop {string} [className='']
 */

import React from "react";
import SearchForm from "@components/common/SearchForm";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import VerseCard from "./VerseCard";
import { Virtuoso } from 'react-virtuoso'

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

    const verses = data?.verses || [];

    return (
        <section className={`verses flex flex-col gap-5 h-full min-h-0 ${className}`} id="verses">
            <SearchForm className="shrink-0" placeholder={`البحث...`} id="verses_search" name="verses_search" />

            {/* شيلنا الـ overflow-y-auto والـ padding من هنا */}
            <div className="section-content bg-card border-2 border-border rounded-lg h-full min-h-0 relative">
                {isLoading ? (
                    <div className="p-3">Loading...</div>
                ) : (
                    <Virtuoso
                        style={{ height: '100%' }}
                        data={verses}
                        overscan={400}
                        computeItemKey={(index, verse) => verse.id}
                        itemContent={(index, verse) => (
                            <div className="p-2" key={index}>
                                <VerseCard verse={verse} />
                            </div>
                        )}
                    />
                )}
            </div>
        </section>
    )
}

export default VersesSection;