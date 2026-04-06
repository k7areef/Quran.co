import { useSettings } from '@contexts/SettingsContext';
import Sidebar from '@components/Sidebar';
import { createPortal } from 'react-dom';

function ChaptersSidebarModal() {

    const { isChaptersSidebarOpen, setIsChaptersSidebarOpen } = useSettings();

    if (!isChaptersSidebarOpen) return;

    return (createPortal(<div
        onClick={() => setIsChaptersSidebarOpen(false)}
        className='chapters-sidebar-modal h-dvh w-full fixed md:hidden top-0 left-0 z-50 bg-black/50 backdrop-blur-sm'
    >
        <Sidebar className='text-white rounded-none flex-col-reverse max-lg:pt-3' onClick={(e) => e.stopPropagation()} />
    </div>, document.getElementById("modal-root")))
}

export default ChaptersSidebarModal;