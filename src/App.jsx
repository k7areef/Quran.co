import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      {/* Routes */}
      <Routes>
        <Route index element={<Navigate to={`/chapter/1`} replace />} />
        <Route path="/chapter/:chapterId" element={<div className="app-content">
          السلام عليكم ورحمة الله وبركاته
        </div>} />
      </Routes>
    </div>
  )
}

export default App;