/**
 * @typedef {Object} NavbarProps
 * @prop {boolean} [isLoading=true]
 */

import React from "react";
import Select from "@components/UI/Select";
import { useSettings } from "@contexts/SettingsContext";
import { faBars, faBookOpen, faFont, faLanguage, faMicrophone, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

/**
 * @param {NavbarProps} props
 */
function Navbar({ isLoading = true }) {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const menuRef = React.useRef(null);
    const menuBtnRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !menuBtnRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const {
        textType,
        setTextType,
        translator,
        setTranslator,
        reciter,
        setReciter,
        isChaptersSidebarOpen,
        setIsChaptersSidebarOpen
    } = useSettings();

    // Recitations
    const { data: reciterationsData, isLoading: isLoadingReciters } = useQuery({
        queryKey: ['RECITATIONS'],
        queryFn: async () => {
            const res = await fetch(`https://api.quran.com/api/v4/resources/recitations?language=ar`);
            const data = await res.json();
            localStorage.setItem('recitations', JSON.stringify(data));
            return data;
        },
        initialData: () => {
            const saved = localStorage.getItem('recitations');
            return saved ? JSON.parse(saved) : undefined;
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    // Text Types
    const textTypes = React.useMemo(() => ([
        { key: "text_uthmani", label: "رسم عثماني (برواية حفص)" },
        { key: "text_imlaei", label: "رسم إملائي (بالتشكيل)" },
        { key: "text_imlaei_simple", label: "رسم إملائي (بسيط)" },
        { key: "text_indopak", label: "خط هندوراسي (Indo-Pak)" },
    ]), []);

    // Translations
    const translations = React.useMemo(() => ([
        { key: 85, label: "عبد الحليم" },
        { key: 84, label: "المفتي تقي عثماني" },
        { key: 203, label: "الهلالي وخان" },
    ]), []);

    return (
        <nav className="navbar shrink-0" dir="ltr">
            <div className="container">
                <div className="nav-content bg-card p-3 md:p-5 rounded-lg border-2 border-border flex items-center justify-between relative">
                    {/* App Logo */}
                    <Link
                        to={'/'}
                        className="app-logo text-warning font-semibold flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faBookOpen} />
                        <span>Quran.co</span>
                    </Link>
                    {/* Utils */}
                    <div className="nav-utils flex items-center gap-1" dir="rtl">
                        {/* Mobile Menu Toggle */}
                        <button
                            ref={menuBtnRef}
                            type="button"
                            title="القائمة"
                            aria-label="فتح القائمة"
                            onClick={() => setIsMobileMenuOpen(prev => !prev)}
                            className={`text-xl w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isMobileMenuOpen ? "bg-muted/30" : "sm:hover:bg-muted/30"} lg:hidden`}
                        >
                            <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} />
                            <span className="sr-only">{isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}</span>
                        </button>
                        {/* Open Chapters Button */}
                        <button
                            type="button"
                            title="السور"
                            aria-label="فتح السور"
                            onClick={() => setIsChaptersSidebarOpen(prev => !prev)}
                            className={`text-xl w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isChaptersSidebarOpen ? "bg-muted/30" : "sm:hover:bg-muted/30"} md:hidden`}
                        >
                            <FontAwesomeIcon icon={faBookOpen} />
                            <span className="sr-only">{isChaptersSidebarOpen ? 'إغلاق السور' : 'فتح السور'}</span>
                        </button>
                        {/* Mobile Menu */}
                        <div
                            ref={menuRef}
                            className={`select-wrapper grid transition-all ${isMobileMenuOpen ? "max-lg:grid-rows-[1fr] max-lg:p-3 max-lg:border-2" : "max-lg:grid-rows-[0fr]"} max-lg:absolute max-lg:top-full max-lg:left-0 max-lg:w-full max-lg:bg-card max-lg:border-warning max-lg:mt-3 max-lg:rounded-lg max-lg:z-40`}
                        >
                            <div className={`max-lg:overflow-hidden flex lg:items-center gap-3 max-lg:flex-col transition-opacity ${isMobileMenuOpen ? "max-lg:opacity-100" : "max-lg:opacity-0"}`}>
                                {/* Text Type */}
                                <Select
                                    className="w-full text-start"
                                    current={textType}
                                    setCurrent={setTextType}
                                    options={textTypes}
                                    disabled={isLoading}
                                    icon={<FontAwesomeIcon icon={faFont} />}
                                    optionsClassName="max-lg:relative max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:mt-0 max-lg:has-[.active]:mt-2"
                                />
                                {/* Translator */}
                                <Select
                                    className="w-full text-start"
                                    current={translator}
                                    setCurrent={setTranslator}
                                    options={translations || []}
                                    disabled={isLoading}
                                    icon={<FontAwesomeIcon icon={faLanguage} />}
                                    optionsClassName="max-lg:relative max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:mt-0 max-lg:has-[.active]:mt-2"
                                />
                                {/* Reciter */}
                                <Select
                                    className="w-full text-start"
                                    current={reciter}
                                    setCurrent={(value) => setReciter(value)}
                                    options={(reciterationsData?.recitations || []).map(r => ({ key: r.id, label: r.translated_name?.name }))}
                                    disabled={isLoading || isLoadingReciters}
                                    icon={<FontAwesomeIcon icon={faMicrophone} />}
                                    optionsClassName="max-lg:relative max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:mt-0 max-lg:has-[.active]:mt-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;