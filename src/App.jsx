import AudioPlayer from "@components/AudioPlayer";
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import VersesSection from "@components/Verses/VersesSection";
import { Navigate, Route, Routes } from "react-router-dom";
import TafsirModal from "@components/Modals/TafsirModal";
import { TafsirContextProvider } from "@contexts/TafsirContext";

function App() {
  return (
    <div className="App">
      {/* Routes */}
      <Routes>
        <Route index element={<Navigate to={`/chapter/1`} replace />} />
        <Route path="/chapter/:chapterId" element={<div className="app-content h-dvh bg-background text-white flex flex-col py-3 md:py-5 gap-3 md:gap-5">
          {/* Navbar */}
          <Navbar />
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
                    <VersesSection />
                    {/* Tafsir Modal */}
                    <TafsirModal />
                  </TafsirContextProvider>
                  {/* Audio Palyer */}
                  <AudioPlayer />
                </main>
              </div>
            </div>
          </div>
        </div>} />
      </Routes>
    </div>
  )
}

export default App;