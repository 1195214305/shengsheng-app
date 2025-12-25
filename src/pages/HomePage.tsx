import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LightRaysBackground from '../components/LightRaysBackground'
import InfoInputModal from '../components/InfoInputModal'

export default function HomePage() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)

  const handleExplore = () => {
    setShowModal(true)
  }

  const handleModalComplete = () => {
    setShowModal(false)
    navigate('/domain')
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* 光线背景 */}
      <LightRaysBackground />

      {/* 顶部导航 */}
      <motion.nav
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl text-white" style={{ fontFamily: 'STKaiti, KaiTi, serif' }}>
            生生
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/garden')}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            花园
          </button>
          <button className="text-slate-400 hover:text-white transition-colors text-sm">
            关于
          </button>
        </div>
      </motion.nav>

      {/* 主内容区域 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* 英文副标题 */}
        <motion.p
          className="text-slate-500 text-sm tracking-[0.3em] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          DIVE INTO CHAOS, CO-CREATE WITH FATE
        </motion.p>

        {/* 主标题 */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl text-white text-center mb-6"
          style={{ fontFamily: 'STKaiti, KaiTi, serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          探索生命的生成算法
        </motion.h1>

        {/* 描述文字 */}
        <motion.p
          className="text-slate-400 text-center max-w-lg mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          以生成式智能解构命运代码，揭得你独有的生命真义
        </motion.p>

        {/* 探索按钮 */}
        <motion.button
          onClick={handleExplore}
          className="group relative px-12 py-4 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-full text-white font-medium overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* 按钮光效 */}
          <span className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-white/20 to-purple-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <span className="relative flex items-center gap-2">
            即刻探索
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </motion.button>

        {/* 底部装饰文字 */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-slate-600 text-xs tracking-wider">
            一象生多相，定数与变数交织
          </p>
        </motion.div>
      </div>

      {/* 信息录入弹窗 */}
      <InfoInputModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onComplete={handleModalComplete}
      />
    </div>
  )
}
