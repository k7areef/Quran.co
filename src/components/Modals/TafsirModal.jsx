import { useTafsir } from "@contexts/TafsirContext";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createPortal } from "react-dom";
import parse from 'html-react-parser';

function TafsirModal() {

    const { verseKey, isOpen, closeModal, data } = useTafsir();

    if (!isOpen) return;

    return (createPortal(<div
        onClick={closeModal}
        className="fixed h-screen w-full top-0 left-0 z-50 bg-black/50 backdrop-blur-sm flex items-center"
    >
        <div className="container h-3/4 flex items-center">
            <div
                onClick={e => e.stopPropagation()}
                className="w-full bg-card text-white border-2 border-border rounded-lg p-3 md:p-5 flex flex-col gap-3 md:gap-5 max-h-3/4 min-h-0 relative"
            >
                {/* Close Btn */}
                <button
                    type="button"
                    title="أغلاق التفسير"
                    onClick={closeModal}
                    aria-label="أغلاق التفسير"
                    className="close-tafsir-btn flex items-center gap-2 py-2 px-4 rounded-md bg-card border-2 border-border absolute top-0 right-0 -translate-y-full -mt-3 transition sm:hover:bg-item"
                >
                    <FontAwesomeIcon icon={faXmark} />
                    <span>أغلاق التفسير</span>
                </button>
                {/* Modal Header */}
                <div className="modal-header flex items-center justify-between flex-wrap gap-3">
                    <h2 className="font-bold text-warning">تفسير الايه</h2>
                    <p className="leading-loose">{data?.tafsir?.verses?.[verseKey].text_imlaei}</p>
                </div>
                {/* Separator */}
                <hr className="border-border" />
                {/* Tafsir Text */}
                <div className="tafsir-text leading-loose max-h-full min-h-0 overflow-y-auto pe-2" style={{ scrollbarColor: "var(--color-warning) var(--color-border)" }}>
                    {data?.tafsir?.text ? parse(data.tafsir.text) : ''}
                </div>
            </div>
        </div>
    </div>, document.getElementById("modal-root")))
}

export default TafsirModal;