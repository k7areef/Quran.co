/**
 * @typedef {Object} SidebarProps
 * @prop {String} [className]
 */

import React from "react";
import SearchForm from "@components/common/SearchForm";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useParams } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";

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
 * @param {SidebarProps} props
 */
function Sidebar({ className }) {

    const { chapterId } = useParams();

    const [searchVal, setSearchVal] = React.useState("");
    const virtuosoRef = React.useRef(null);

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
        refetchOnWindowFocus: false
    });

    React.useEffect(() => { // Save chapters to localStorage
        if (data?.chapters) {
            localStorage.setItem("chapters", JSON.stringify(data.chapters));
        }
    }, [data]);

    React.useEffect(() => { // Scroll to active chapter
        if (!isLoading && data?.chapters && chapterId) {
            const index = data.chapters.findIndex(c => c.id === +(chapterId));
            if (index !== -1) {
                virtuosoRef.current?.scrollToIndex({
                    index,
                    align: 'start',
                    behavior: 'smooth'
                });
            }
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

    const handleSaveToLocalStorage = (chapterId) => { // Save last chapter to localStorage
        localStorage.setItem("last_chapter", chapterId);
    };

    return (
        <aside className={`chapters-sidebar w-80 shrink-0 bg-card border-2 border-border rounded-lg h-full flex flex-col max-md:hidden ${className}`}>
            {/* Search */}
            <div className="side-header p-3 bg-inherit sticky top-0 z-10 shrink-0">
                <SearchForm
                    id="chapters_search"
                    onChange={handleSearchVal}
                    placeholder="البحث في السور..."
                />
            </div>
            {/* Chapters */}
            <div className="chapters-container flex-1 min-h-0">
                {isLoading ? (
                    <div className="px-3 space-y-2">
                        {/* Loading Skeletons */}
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="chapter-item bg-item p-2 rounded-md animate-pulse h-12" />
                        ))}
                    </div>
                ) : (
                    <Virtuoso
                        ref={virtuosoRef}
                        style={{ height: '100%' }}
                        data={filteredChapters}
                        components={{
                            List: React.forwardRef((props, ref) => (
                                <div {...props} ref={ref} className="px-3 pb-3 space-y-2" />
                            ))
                        }}
                        itemContent={(index, chapter) => (
                            <div data-id={chapter.id} className="pb-2">
                                <NavLink
                                    to={`/chapter/${chapter.id}`}
                                    onClick={() => handleSaveToLocalStorage(chapter.id)}
                                    className={({ isActive }) =>
                                        `chapter-item border-2 p-2 rounded-md flex items-center gap-2 transition-colors duration-200 
                                        ${isActive ? "bg-primary border-primary" : "bg-item border-border sm:hover:bg-primary/30"}`
                                    }
                                >
                                    <div className="chapter-number">{String(chapter.id).padStart(3, "0")}</div>
                                    <h3 className="line-clamp-1 me-auto">
                                        <HighlightedName name={chapter.name_arabic} search={searchVal} />
                                    </h3>
                                    <span className="text-sm text-muted font-medium">( {chapter.verses_count} آيه )</span>
                                </NavLink>
                            </div>
                        )}
                    />
                )}
            </div>
        </aside>
    )
}

export default Sidebar;