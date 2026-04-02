import { Navigate, Route, Routes } from "react-router-dom";
import AppContent from "@pages/AppContent";

function App() {
  return (
    <div className="App">
      {/* Routes */}
      <Routes>
        <Route index element={<Navigate to={`/chapter/1`} replace />} />
        <Route path="/chapter/:chapterId" element={<AppContent />} />
      </Routes>
    </div>
  )
}

export default App;