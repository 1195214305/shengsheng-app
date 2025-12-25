import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import InfoInputPage from './pages/InfoInputPage'
import DomainSelectPage from './pages/DomainSelectPage'
import ChatRoomPage from './pages/ChatRoomPage'
import GardenPage from './pages/GardenPage'
import ParticleBackground from './components/ParticleBackground'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen relative">
        <ParticleBackground />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/info" element={<InfoInputPage />} />
            <Route path="/domain" element={<DomainSelectPage />} />
            <Route path="/chat/:domain" element={<ChatRoomPage />} />
            <Route path="/garden" element={<GardenPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  )
}

export default App
