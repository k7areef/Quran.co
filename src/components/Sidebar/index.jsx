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
import { List, useDynamicRowHeight, useListRef } from "react-window";

/**
 * @param {SidebarProps} props
 */
function Sidebar({ className, onClick }) {

    const { chapterId } = useParams();

    const [searchVal, setSearchVal] = React.useState("");
    const listRef = useListRef(null);

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

    // Save chapters to localStorage
    React.useEffect(() => {
        if (data?.chapters) {
            localStorage.setItem("chapters", JSON.stringify(data.chapters));
        }
    }, [data]);

    // Scroll to active chapter
    React.useEffect(() => {
        if (!isLoading && data?.chapters && chapterId) {
            const timer = setTimeout(() => {
                const list = listRef.current;
                if (list) {
                    const targetIndex = +chapterId - 1;
                    list.scrollToRow({
                        behavior: "smooth",
                        align: "start",
                        index: targetIndex
                    });
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [chapterId, data?.chapters, isLoading, listRef]);

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

    const rowHeight = useDynamicRowHeight({
        defaultRowHeight: 44
    });

    const Row = ({ index, style }) => {
        const chapter = filteredChapters[index];
        return (
            <div style={style} className="pb-2 px-2">
                <ChapterItem key={chapter.id} chapter={chapter} searchVal={searchVal} />
            </div>
        );
    };
    const RowSkeleton = ({ style }) => {
        return (
            <div style={style} className="pb-2 px-2">
                <div className="chapter-item bg-item p-2 rounded-md animate-pulse h-12" />
            </div>
        );
    };

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
            <div className="chapters-container flex-1 min-h-0 overflow-y-auto md:py-2 space-y-2 md:bg-card md:border-2 md:border-border md:rounded-lg ">
                {isLoading ? (
                    <List
                        rowComponent={RowSkeleton}
                        rowCount={114}
                        rowHeight={44}
                        rowProps={{}}
                    />
                ) : (
                    <List
                        listRef={listRef}
                        rowComponent={Row}
                        rowCount={filteredChapters.length}
                        rowHeight={rowHeight}
                        rowProps={{ filteredChapters }}
                    />
                )}
            </div>
        </aside>
    )
}

export default Sidebar;