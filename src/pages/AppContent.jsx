import AudioPlayer from "@components/AudioPlayer";
import TafsirModal from "@components/Modals/TafsirModal";
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import VersesSection from "@components/Verses/VersesSection";
import { useSettings } from "@contexts/SettingsContext";
import { TafsirContextProvider } from "@contexts/TafsirContext";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

function AppContent() {

    const { chapterId } = useParams();
    const { translator: { key: translatorId } } = useSettings();

    const { data, isLoading } = useQuery({
        queryKey: [`VERSES_CHAPTERS_${chapterId}_${translatorId}`, chapterId, translatorId],
        queryFn: async () => {
            const params = {
                fields: "text_indopak,text_imlaei_simple,text_imlaei,text_uthmani",
                translations: translatorId
            };
            const res = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${chapterId}?fields=${params.fields}&translations=${params.translations}&per_page=1000`);
            const data = await res.json();
            localStorage.setItem(`verses_chapter_${chapterId}_${translatorId}`, JSON.stringify(data?.verses));
            return data;
        },
        initialData: () => {
            const saved = localStorage.getItem(`verses_chapter_${chapterId}_${translatorId}`);
            return saved ? { verses: JSON.parse(saved) } : undefined;
        },
        enabled: !!chapterId,
        staleTime: Infinity,
        refetchOnWindowFocus: false
    });

    return (
        <div className="app-content h-dvh bg-background text-white flex flex-col py-3 md:py-5 gap-3 md:gap-5">
            {/* Navbar */}
            <Navbar isLoading={isLoading} />
            {/* Layout */}
            <div className="layout h-full min-h-0">
                {/* Layout Container */}
                <div className="container h-full">
                    {/* Layout Content */}
                    <div className="layout-content h-full flex gap-3 md:gap-5">
                        {/* Sidebar */}
                        <Sidebar />
                        {/* Main */}
                        <main className="flex-1 h-full flex flex-col gap-3 md:gap-5">
                            {/* Tafsir Context Provider */}
                            <TafsirContextProvider>
                                {/* Verses */}
                                <VersesSection data={data} isLoading={isLoading} />
                                {/* Tafsir Modal */}
                                <TafsirModal />
                            </TafsirContextProvider>
                            {/* Audio Palyer */}
                            <AudioPlayer />
                        </main>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppContent;