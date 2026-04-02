/**
 * @typedef {Object} VerseCardProps
 * @prop {object} [verse={}]
 * @prop {string} [searchVal='']
 */

import React from "react";
import VerseActions from "./VerseActions";
import { useTafsirActions } from "@contexts/TafsirContext";
import HighlightedName from "@components/common/HighlightedName";
import { useSettings } from "@contexts/SettingsContext";

/**
 * @param {VerseCardProps} props
 */
const VerseCard = React.memo(({ verse, searchVal }) => {

    const { openModal } = useTafsirActions();
    const { textType } = useSettings();

    return (
        <div className="verse-card bg-item rounded-lg p-3 space-y-5" style={{ contentVisibility: "auto" }}>
            {/* Text */}
            <div className="verse-text">
                <p className="leading-loose font-amiri text-2xl">
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
            <VerseActions verse={verse} openModal={openModal} />
        </div>
    )
});

export default VerseCard;