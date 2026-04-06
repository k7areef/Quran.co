/**
 * @typedef {Object} AudioPlayerProps
 * @prop {boolean} [versesIsLoading=false]
 * @prop {String} [className = '']
 */

import React from "react";
import { useSettings } from "@contexts/SettingsContext";
import { faAngleLeft, faAngleRight, faPause, faPlay, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { formatTime } from "@utils/helpers.js";

/**
 * @param {AudioPlayerProps} props
 */
function AudioPlayer({ className, versesIsLoading }) {

    const navigate = useNavigate();

    const { chapterId } = useParams();
    const { reciter: { key: reciterId }, currentTime, setCurrentTime } = useSettings();
    const [sliderValue, setSliderValue] = React.useState(currentTime);
    const [isDragging, setIsDragging] = React.useState(false);

    const audioRef = React.useRef(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [duration, setDuration] = React.useState(0);

    // Fetch audio data
    const { data, isLoading: audioIsLoading } = useQuery({
        queryKey: [`AUDIO_${reciterId}_${chapterId}`, reciterId, chapterId],
        queryFn: async () => {
            const res = await fetch(`https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${chapterId}`);
            const data = await res.json();
            localStorage.setItem(`audio_${reciterId}_${chapterId}`, JSON.stringify(data));
            return data;
        },
        initialData: () => {
            const saved = localStorage.getItem(`audio_${reciterId}_${chapterId}`);
            return saved ? JSON.parse(saved) : undefined;
        },
        enabled: !!chapterId,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    // Set audio source when data is loaded
    React.useEffect(() => {
        if (audioRef.current && data?.audio_file?.audio_url) {
            audioRef.current.src = data.audio_file.audio_url;
        }
    }, [data]);

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
        if (audioRef.current && !isDragging) {
            setSliderValue(audioRef.current.currentTime);
            setCurrentTime(audioRef.current.currentTime);
        }
    }, [isDragging, setCurrentTime]);
    // Handle on loadedmetadata
    const handleOnLoadedMetaData = React.useCallback((e) => {
        setDuration(e.target.duration);
    }, []);
    // Handle Progress Change
    const handleProgressChange = React.useCallback((e) => {
        setIsDragging(false);
        const value = e.target.value;
        setSliderValue(value);
        if (audioRef.current) {
            audioRef.current.currentTime = value;
        }
    }, [setSliderValue]);

    // Button Controller Styles
    const btnStyle = `w-10 h-10 rounded-full flex items-center justify-center transition`;

    return (
        <div className={`audio-player bg-card border-2 border-border rounded-lg p-3 mt-auto flex items-center gap-3 ${className}`}>
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
            </div>
            {/* Progress Bar */}
            <div className="progress-bar flex-1 relative group">

                {/* Range */}
                <input
                    min={0}
                    step={0.1}
                    type="range"
                    max={duration}
                    value={sliderValue}
                    name="audio_progress"
                    onMouseUp={handleProgressChange}
                    onTouchEnd={handleProgressChange}
                    onChange={(e) => {
                        setIsDragging(true);
                        setSliderValue(Number(e.target.value));

                    }}
                    className="w-full"
                />

                {/* Tiem Tootip */}
                <div
                    className={`${(!isPlaying && currentTime > 0) ? "" : "opacity-0 group-hover:opacity-100"} absolute top-0 -translate-y-full translate-x-1/2 bg-warning text-background font-medium text-xs px-2 py-1 rounded shadow-lg pointer-events-none transition-opacity`}
                    style={{
                        right: `${(sliderValue / duration) * 100}%`
                    }}
                >
                    {formatTime(Math.floor(sliderValue))}
                </div>
            </div>
        </div>
    )
}

export default AudioPlayer;