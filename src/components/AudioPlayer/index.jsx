/**
 * @typedef {Object} AudioPlayerProps
 * @prop {String} [className = '']
 */

/**
 * @param {AudioPlayerProps} props
 */
function AudioPlayer({ className }) {
    return (
        <div className={`audio-player bg-card border-2 border-border rounded-lg p-3 mt-auto ${className}`}>
            Audio  Player
        </div>
    )
}

export default AudioPlayer;