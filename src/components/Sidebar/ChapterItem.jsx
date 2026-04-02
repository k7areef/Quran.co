/**
 * @typedef {Object} ChapterItemProps
 * @prop {object} chapter
 * @prop {string} searchVal
 */

import HighlightedName from "@components/common/HighlightedName";
import React from "react";
import { NavLink } from "react-router-dom";

/**
 * @param {ChapterItemProps} props
 */
const ChapterItem = React.memo(({ chapter, searchVal }) => {

    const handleSaveToLocalStorage = React.useCallback((chapterId) => { // Save last chapter to localStorage
        localStorage.setItem("last_chapter", chapterId);
    }, []);

    return (
        <NavLink
            to={`/chapter/${chapter.id}`}
            data-chapter-id={chapter.id}
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
    )
}, (prevProps, nextProps) => {
    return prevProps.chapter.id === nextProps.chapter.id && prevProps.searchVal === nextProps.searchVal;
});

export default ChapterItem;