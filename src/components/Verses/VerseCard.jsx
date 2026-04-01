/**
 * @typedef {Object} VerseCardProps
 * @prop {object} [verse={}]
 */

import VerseActions from "./VerseActions";

/**
 * @param {VerseCardProps} props
 */
function VerseCard({ verse }) {
    return (
        <div className="verse-card bg-item rounded-lg p-3 space-y-5">
            {/* Text */}
            <div className="verse-text">
                <p className="leading-loose">{verse?.text_imlaei}</p>
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
            <VerseActions verse={verse} />
        </div>
    )
}

export default VerseCard;