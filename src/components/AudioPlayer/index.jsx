/**
 * @typedef {Object} AudioPlayerProps
 * @prop {boolean} [versesIsLoading=false]
 * @prop {String} [className='']
 */

import React from "react";
import { useSettings } from "@contexts/SettingsContext";
import { faAngleLeft, faAngleRight, faPause, faPlay, faSpinner, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import TimeDisplay from "./components/TimeDisplay";
import { useAudioPlayer } from "@contexts/AudioPlayerContext";

const AudioMainContollers = React.memo(({ versesIsLoading, audioIsLoading, isPlaying, play, pause }) => {

    const { chapterId } = useParams();
    const navigate = useNavigate();

    // Button Controller Styles
    const btnStyle = `w-7.5 h-7.5 text-xs sm:text-sm md:text-base md:w-9 md:h-9 rounded-full flex items-center justify-center transition`;

    return (
        <>
            {/* Next Button */}
            <button
                title="السورة التالية"
                aria-label="السورة التالية"
                onClick={() => navigate(`/chapter/${+chapterId + 1}`)}
                disabled={versesIsLoading || audioIsLoading || +chapterId === 114}
                className={`${btnStyle} bg-primary/50 not-disabled:sm:hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed!`}
            >
                <FontAwesomeIcon icon={faAngleRight} />
                <span className="sr-only">Next</span>
            </button>
            {/* Play/Pause Button */}
            <button
                type="button"
                disabled={audioIsLoading}
                onClick={isPlaying ? pause : play}
                className={`${btnStyle} ${isPlaying ? "bg-primary" : "bg-primary/50"}`}
            >
                <FontAwesomeIcon icon={(versesIsLoading || audioIsLoading) ? faSpinner : isPlaying ? faPause : faPlay} {...((versesIsLoading || audioIsLoading) ? { className: "animate-spin" } : {})} />
                <span className="sr-only">{(versesIsLoading || audioIsLoading) ? "Loading..." : isPlaying ? "Pause" : "Play"}</span>
            </button>
            {/* Previous Button */}
            <button
                title="السورة السابقة"
                aria-label="السورة السابقة"
                onClick={() => navigate(`/chapter/${+chapterId - 1}`)}
                disabled={versesIsLoading || audioIsLoading || +chapterId === 1}
                className={`${btnStyle} bg-primary/50 not-disabled:sm:hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed!`}
            >
                <FontAwesomeIcon icon={faAngleLeft} />
                <span className="sr-only">Previous</span>
            </button>
        </>
    )
});

// Find Active Verse
const findActiveVerse = (currentTime, timestamps) => {
    const currentTimeFormated = (currentTime * 1000);
    const activeVerse = timestamps.find(t => ((currentTimeFormated >= t.timestamp_from) && (currentTimeFormated <= t.timestamp_to)));
    if (activeVerse) return activeVerse;
};

/**
 * @param {AudioPlayerProps} props
 */
function AudioPlayer({ className, versesIsLoading }) {

    const { chapterId } = useParams();
    const { reciter: { key: reciterId } } = useSettings();
    const { currentTime, setCurrentTime, setActiveVerse, timestamps, setTimestamps } = useAudioPlayer();

    const audioRef = React.useRef(null);
    const [soundVolume, setSoundVolume] = React.useState(Number(localStorage.getItem("lastSoundVolume")) || 0.5);
    const [sliderValue, setSliderValue] = React.useState(currentTime);
    const [isTimeDragging, setIsTimeDragging] = React.useState(false);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [duration, setDuration] = React.useState(0);

    // Set audio sound volume
    React.useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = soundVolume;
            localStorage.setItem("lastSoundVolume", soundVolume)
        }
    }, [soundVolume]);

    // Fetch audio data
    const { data, isLoading: audioIsLoading } = useQuery({
        queryKey: [`AUDIO_${reciterId}_${chapterId}`, reciterId, chapterId],
        queryFn: async () => {
            const res = await fetch(`https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${chapterId}?segments=true`);
            const data = await res.json();
            localStorage.setItem(`audio_${reciterId}_${chapterId}`, JSON.stringify(data));
            return data;
        },
        initialData: () => {
            const saved = localStorage.getItem(`audio_${reciterId}_${chapterId}`);
            const data = JSON.parse(saved);
            return saved ? data : undefined;
        },
        enabled: !!chapterId,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    // Set audio source and timestamps when data is loaded
    React.useEffect(() => {
        if (audioRef.current && data?.audio_file?.audio_url) {
            audioRef.current.src = data.audio_file.audio_url;
            setTimestamps(data?.audio_file?.timestamps);
        }
    }, [data, setTimestamps]);

    // Handlers:
    const play = React.useCallback(() => {
        if (!audioRef.current) return;
        audioRef.current.play();
    }, []);
    const pause = React.useCallback(() => {
        if (!audioRef.current) return;
        audioRef.current.pause();
    }, []);

    // Play audio when data is loaded and not already playing
    React.useEffect(() => {
        if (audioRef.current && data?.audio_file?.audio_url && isPlaying) {
            play();
        }
    }, [data, isPlaying, play]);

    // Audio Events Handlers:
    const onPlay = React.useCallback(() => setIsPlaying(true), []);
    const onPause = React.useCallback(() => setIsPlaying(false), []);
    const onEnded = React.useCallback(() => setIsPlaying(false), []);

    // Handle time update
    const handleTimeUpdate = React.useCallback(() => {
        if (audioRef.current && !isTimeDragging) {
            setSliderValue(audioRef.current.currentTime);
            setCurrentTime(audioRef.current.currentTime);

            if (Array.from(timestamps).length === 0) return;

            // Find Active Verse
            const activeVerse = findActiveVerse(currentTime, timestamps);
            if (activeVerse) setActiveVerse(activeVerse);
        }
    }, [isTimeDragging, setCurrentTime, timestamps, setActiveVerse, currentTime]);
    // Handle Loaded Metadata
    const handleOnLoadedMetaData = React.useCallback((e) => {
        setDuration(e.target.duration);
    }, []);
    // Handle Time Change
    const handleTimeChange = React.useCallback((e) => {
        setIsTimeDragging(false);
        const value = e.target.value;
        setSliderValue(value);
        if (audioRef.current) {
            audioRef.current.currentTime = value;
        }
    }, [setSliderValue]);

    return (
        <div className={`audio-player bg-card border-2 border-border rounded-lg p-3 mt-auto flex items-center gap-3 flex-wrap ${className}`}>
            <audio
                ref={audioRef}
                className="hidden"
                onPlay={onPlay}
                onPause={onPause}
                onEnded={onEnded}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleOnLoadedMetaData}
            />
            {/* Controllers */}
            <div className="audio-controllers flex items-center gap-3">
                {/* Audio Main Contollers */}
                <AudioMainContollers
                    versesIsLoading={versesIsLoading}
                    audioIsLoading={audioIsLoading}
                    isPlaying={isPlaying}
                    play={play}
                    pause={pause}
                />
                {/* Sound Volume */}
                <div className="sound-volume flex items-center gap-2 max-sm:max-w-25">
                    {/* Range */}
                    <input
                        max={1}
                        min={0.1}
                        step={0.1}
                        type="range"
                        value={soundVolume}
                        name="sound_progress"
                        onChange={(e) => setSoundVolume(e.target.value)}
                        className="w-full"
                        style={{
                            background: `linear-gradient(to left, var(--color-warning) ${soundVolume * 100}%, var(--color-primary) ${soundVolume * 100}%)`
                        }}
                    />
                    {/* Sound Icon */}
                    <FontAwesomeIcon icon={faVolumeHigh} />
                </div>
            </div>
            {/* Progress Bar */}
            <div className="progress-bar lg:flex-1 max-md:sm:flex-1 max-lg:md:w-full max-sm:w-full max-lg:md:-order-1 max-sm:-order-1 -mt-1.5">
                {/* Range */}
                <input
                    min={0}
                    step={0.1}
                    type="range"
                    max={duration}
                    value={sliderValue}
                    name="audio_progress"
                    onMouseUp={handleTimeChange}
                    onTouchEnd={handleTimeChange}
                    onChange={(e) => {
                        setIsTimeDragging(true);
                        setSliderValue(Number(e.target.value));
                    }}
                    className="w-full"
                    style={{
                        background: `linear-gradient(to left, var(--color-warning) ${(sliderValue / duration) * 100}%, var(--color-primary) ${(sliderValue / duration) * 100}%)`
                    }}
                />
            </div>
            {/* Time Display */}
            <TimeDisplay currentTime={currentTime} duration={duration} />
        </div>
    )
}

export default AudioPlayer;