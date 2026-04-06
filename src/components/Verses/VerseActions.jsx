/**
 * @typedef {Object} VerseActionsProps
 * @prop {object} [verse={}]
 * @prop {Function} [openModal=() => {}]
 * @prop {boolean} [isActive=false]
 * 
 */

import React from "react";
import { faBookOpen, faCheck, faCopy, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAudioPlayer } from "@contexts/AudioPlayerContext";

/**
 * @param {VerseActionsProps} props
 */
function VerseActions({ verse, openModal, isActive }) {

    const [copied, setCopied] = React.useState(false);
    const { audioRef, timestamps } = useAudioPlayer();

    const handleCopy = React.useCallback(async () => { // Handle Copy
        if (copied) return;
        try {
            await navigator.clipboard.writeText(verse?.text_imlaei);
            setCopied(true);
        } catch (err) {
            console.error("فشل النسخ: ", err);
        }
    }, [copied, verse]);

    const handleTafsir = React.useCallback(() => { // Handle Tafsir
        openModal(verse?.verse_key);
    }, [verse, openModal]);

    const handlePlay = React.useCallback(() => { // Handle Play
        const verseTimeStamps = timestamps.find(t => t.verse_key === verse.verse_key);
        if (verseTimeStamps && audioRef?.current) {
            const formatedTime = (verseTimeStamps?.timestamp_from / 1000) + 0.1
            audioRef.current.currentTime = formatedTime;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timestamps, verse]);

    // Actions Data:
    const actions = React.useMemo(() => {
        return [
            {
                name: "تفسير هذه الايه",
                icon: faBookOpen,
                onClick: handleTafsir
            },
            {
                name: copied ? "تم النسخ" : "نسخ هذه الايه",
                icon: copied ? faCheck : faCopy,
                onClick: handleCopy
            },
            {
                name: "تشغيل بدئً من هذه الايه",
                icon: isActive ? faPause : faPlay,
                onClick: handlePlay
            },
        ]
    }, [handleTafsir, copied, handleCopy, isActive, handlePlay]);

    return (
        <div className="actions flex items-center gap-2" dir="ltr">
            {
                actions.map((action, index) => (<button
                    key={index}
                    type="button"
                    title={action.name}
                    aria-label={action.name}
                    onClick={action.onClick}
                    className="w-8 h-8 rounded-full transition-colors sm:hover:bg-primary bg-primary/60 text-sm flex items-center justify-center"
                >
                    <FontAwesomeIcon icon={action.icon} />
                    <span className="sr-only">{action.name}</span>
                </button>))
            }
        </div>
    )
}

export default VerseActions;