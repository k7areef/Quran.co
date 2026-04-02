/**
 * @typedef {Object} NavbarProps
 * @prop {boolean} [isLoading=true]
 */

import React from "react";
import Select from "@components/UI/Select";
import { useSettings } from "@contexts/SettingsContext";
import { faBookOpen, faFont, faLanguage, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

/**
 * @param {NavbarProps} props
 */
function Navbar({ isLoading = true }) {

    const {
        textType,
        setTextType,
        translator,
        setTranslator,
        reciter,
        setReciter
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
                <div className="nav-content bg-card p-3 md:p-5 rounded-lg border-2 border-border flex items-center justify-between">
                    {/* App Logo */}
                    <Link
                        to={'/'}
                        className="app-logo text-warning font-semibold flex items-center gap-2"
                    >
                        <FontAwesomeIcon icon={faBookOpen} />
                        <span>Quran.co</span>
                    </Link>
                    {/* Utils */}
                    <div className="nav-utils flex items-center gap-3" dir="rtl">
                        {/* Text Type */}
                        <Select
                            current={textType}
                            setCurrent={setTextType}
                            options={textTypes}
                            disabled={isLoading}
                            icon={<FontAwesomeIcon icon={faFont} />}
                        />
                        {/* Translator */}
                        <Select
                            current={translator}
                            setCurrent={setTranslator}
                            options={translations || []}
                            disabled={isLoading}
                            icon={<FontAwesomeIcon icon={faLanguage} />}
                        />
                        {/* Reciter */}
                        <Select
                            current={reciter}
                            setCurrent={(value) => setReciter(value)}
                            options={(reciterationsData?.recitations || []).map(r => ({ key: r.id, label: r.translated_name?.name }))}
                            disabled={isLoading || isLoadingReciters}
                            icon={<FontAwesomeIcon icon={faMicrophone} />}
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;