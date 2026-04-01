/**
 * @typedef {Object} SidebarProps
 * @prop {String} [className]
 */

import SearchForm from "@components/common/SearchForm";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { NavLink, useParams } from "react-router-dom";

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
    const chaptersContainerRef = React.useRef(null);

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
        if (!isLoading && data?.chapters) {
            const lastId = +(chapterId);
            if (lastId) {
                const activeElement = chaptersContainerRef.current?.querySelector(`[data-id="${lastId}"]`);
                if (activeElement) {
                    activeElement.scrollIntoView({ behavior: "smooth", block: "start" });
                }
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
        <aside
            ref={chaptersContainerRef}
            style={{ scrollPaddingTop: 80 }}
            className={`chapters-sidebar w-80 shrink-0 bg-card border-2 border-border rounded-lg h-full overflow-y-auto max-md:hidden ${className}`}
        >
            <div className="side-header p-3 bg-inherit sticky top-0 z-10">
                {/* Search */}
                <SearchForm
                    id="chapters_search"
                    name="chapters_search"
                    onChange={handleSearchVal}
                    placeholder="البحث في السور..."
                />
            </div>
            {/* Chapters */}
            <div className="chapters px-3 pb-3">
                <ul className="chapters-list space-y-2">
                    {isLoading ? (
                        Array.from({ length: 114 }).map((_, index) => (<li
                            key={index}
                            title="جاري التحميل..."
                            aria-label="جاري التحميل..."
                            className="chapter-item bg-item border-2 border-border p-2 rounded-md flex items-center gap-2 animate-pulse"
                        >
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                            <span>جاري التحميل...</span>
                        </li>))
                    ) : (
                        filteredChapters.map((chapter, index) => {
                            return (<li key={chapter.id || index} data-id={chapter.id}>
                                <NavLink
                                    to={`/chapter/${chapter.id}`}
                                    onClick={() => handleSaveToLocalStorage(chapter.id)}
                                    className={({ isActive }) => `chapter-item border-2 p-2 rounded-md flex items-center gap-2 transition-colors duration-200 ${isActive ? "bg-primary border-primary" : "bg-item border-border sm:hover:bg-primary/30 sm:hover:border-primary/30"}`}
                                >
                                    <div className="chapter-number">{String(chapter.id).padStart(3, "0")}</div>
                                    <h3 className="line-clamp-1 me-auto">{<HighlightedName name={chapter.name_arabic} search={searchVal} />}</h3>
                                    <span className="text-sm text-muted font-medium">( {chapter.verses_count} آيه )</span>
                                </NavLink>
                            </li>)
                        })
                    )
                    }
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar;