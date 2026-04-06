/**
 * @typedef {Object} SidebarProps
 * @prop {String} [className]
 * @prop {Function} [onClick]
 */

import React from "react";
import SearchForm from "@components/common/SearchForm";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ChapterItem from "./ChapterItem";

/**
 * @param {SidebarProps} props
 */
function Sidebar({ className, onClick }) {

    const { chapterId } = useParams();

    const [searchVal, setSearchVal] = React.useState("");
    const chaptersRef = React.useRef(null);

    const { data, isLoading } = useQuery({
        queryKey: ['CHAPTERS'],
        queryFn: async () => {
            const res = await fetch(`https://api.quran.com/api/v4/chapters`);
            return res.json();
        },
        initialData: () => {
            const saved = localStorage.getItem("chapters");
            return saved ? { chapters: JSON.parse(saved) } : undefined;
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false
    });

    React.useEffect(() => { // Save chapters to localStorage
        if (data?.chapters) {
            localStorage.setItem("chapters", JSON.stringify(data.chapters));
        }
    }, [data]);

    React.useEffect(() => { // Scroll to active chapter
        if (!isLoading && data?.chapters && chapterId) {
            chaptersRef?.current?.querySelector(`[data-chapter-id="${chapterId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [isLoading, data, chapterId]);

    const chapters = React.useMemo(() => { // Get chapters from data or localStorage
        return data?.chapters || [];
    }, [data]);

    const filteredChapters = React.useMemo(() => { // Filter chapters by search value
        if (!searchVal) return chapters;
        return chapters.filter(c => c.name_arabic.includes(searchVal));
    }, [chapters, searchVal]);

    const handleSearchVal = React.useCallback((e) => { // Handle search input change
        setSearchVal(e.target.value.trim());
    }, []);

    return (
        <aside onClick={onClick} className={`chapters-sidebar w-80 shrink-0 h-full max-md:bg-card flex flex-col gap-3 ${className}`}>
            {/* Search */}
            <div className="side-header bg-inherit sticky top-0 z-10 shrink-0">
                <SearchForm
                    id="chapters_search"
                    onChange={handleSearchVal}
                    placeholder="البحث في السور..."
                />
            </div>
            {/* Chapters */}
            <div ref={chaptersRef} className="chapters-container flex-1 min-h-0 overflow-y-auto p-2 space-y-2 md:bg-card md:border-2 md:border-border md:rounded-lg ">
                {isLoading ? (
                    Array.from({ length: 15 }).map((_, i) => (
                        <div key={i} className="chapter-item bg-item p-2 rounded-md animate-pulse h-12" />
                    ))
                ) : (
                    filteredChapters.map((chapter) => (
                        <ChapterItem key={chapter.id} chapter={chapter} searchVal={searchVal} />
                    ))
                )}
            </div>
        </aside>
    )
}

export default Sidebar;