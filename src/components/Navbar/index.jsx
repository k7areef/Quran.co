import React from "react";
import Select from "@components/UI/Select";
import { useSettings } from "@contexts/SettingsContext";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function Navbar() {

    const {
        textType,
        setTextType
    } = useSettings();

    // Text Types
    const textTypes = React.useMemo(() => ([
        { key: "text_uthmani", label: "رسم عثماني (برواية حفص)" },
        { key: "text_imlaei", label: "رسم إملائي (بالتشكيل)" },
        { key: "text_imlaei_simple", label: "رسم إملائي (بسيط)" },
        { key: "text_indopak", label: "خط هندوراسي (Indo-Pak)" },
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
                        />
                        {/* Reciter */}
                        <Select
                            current={{ key: "abdurrahmaan_as_sudais", label: "عبد الباسط عبد الصمد" }}
                            options={[]}
                        />
                        {/* Translator */}
                        <Select
                            current={{ key: "en-haleem", label: "M.A.S. Abdel Haleem" }}
                            options={[]}
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;