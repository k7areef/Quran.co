/**
 * @typedef {Object} VerseCardProps
 * @prop {object} [verse={}]
 * @prop {string} [searchVal='']
 * @prop {string} [textType='']
 */

import React from "react";
import VerseActions from "./VerseActions";
import { useTafsirActions } from "@contexts/TafsirContext";
import HighlightedName from "@components/common/HighlightedName";
import { useAudioPlayer } from "@contexts/AudioPlayerContext";

/**
 * @param {VerseCardProps} props
 */
const VerseCard = React.memo(({ verse, searchVal, textType }) => {

    const { openModal } = useTafsirActions();
    const { activeVerse } = useAudioPlayer();

    const isActive = (activeVerse?.verse_key === verse?.verse_key);

    return (
        <div className="verse-card bg-item rounded-lg p-3 space-y-5" style={{ contentVisibility: "auto" }}>
            {/* Text */}
            <div className="verse-text">
                <p className={`leading-loose font-amiri font-bold text-2xl transition-colors duration-500 ${isActive ? "text-warning" : "text-inherit"}`}>
                    <HighlightedName name={verse?.[textType?.key]} search={searchVal} />
                </p>
            </div>
            {/* Transition */}
            {
                ((verse?.translations || []).length > 0) &&
                <div className="verse-transition" dir="ltr">
                    <p>{verse.translations[0]?.text}</p>
                </div>
            }
            {/* Separator */}
            <hr className="border-muted/20" />
            {/* Actions */}
            <VerseActions verse={verse} openModal={openModal} isActive={isActive} />
        </div>
    )
});

export default VerseCard;