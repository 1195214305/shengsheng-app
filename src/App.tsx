import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import DomainSelectPage from './pages/DomainSelectPage'
import MasterSelectPage from './pages/MasterSelectPage'
import ChatRoomPage from './pages/ChatRoomPage'
import GardenPage from './pages/GardenPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen relative bg-slate-950">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/domain" element={<DomainSelectPage />} />
            <Route path="/masters/:domain" element={<MasterSelectPage />} />
            <Route path="/chat/:domain" element={<ChatRoomPage />} />
            <Route path="/garden" element={<GardenPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  )
}

export default App
