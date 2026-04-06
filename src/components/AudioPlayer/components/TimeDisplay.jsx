/**
 * @typedef {object} TimeDisplayProps
 * @prop {number} [duration=0]
 * @prop {number} [currentTime=0]
 */

import { formatTime } from "@utils/helpers";

/**
 * @param {TimeDisplayProps} props
 */
function TimeDisplay({ duration, currentTime }) {
    return (
        <div className="current-time text-xs flex items-center gap-1 max-lg:md:ms-auto max-sm:ms-auto">
            <span>{formatTime(duration)}</span>
            <span>:</span>
            <span>{formatTime(currentTime)}</span>
        </div>
    )
}

export default TimeDisplay;