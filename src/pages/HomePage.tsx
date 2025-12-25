import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

export default function HomePage() {
  const navigate = useNavigate()
  const { totalSunlight } = useAppStore()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative z-10">
      {/* 右上角阳光值 */}
      {totalSunlight > 0 && (
        <motion.div
          className="absolute top-8 right-8 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
          <span className="text-amber-400 text-sm">{totalSunlight}</span>
        </motion.div>
      )}

      {/* 左上角花园入口 */}
      <motion.button
        className="absolute top-8 left-8 text-neutral-500 hover:text-amber-400 transition-colors text-sm"
        onClick={() => navigate('/garden')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        花园
      </motion.button>

      {/* 主内容区域 */}
      <div className="flex flex-col items-center">
        {/* 生生 标题 */}
        <motion.h1
          className="text-[120px] md:text-[160px] font-serif text-amber-100 tracking-[0.3em] leading-none select-none"
          style={{
            fontFamily: 'STKaiti, KaiTi, serif',
            textShadow: '0 0 60px rgba(251, 191, 36, 0.15)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          生生
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          className="text-neutral-400 text-base tracking-[0.5em] mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          命运可能性模拟器
        </motion.p>
      </div>

      {/* 即刻探索按钮 */}
      <motion.button
        className="absolute bottom-24 left-1/2 -translate-x-1/2 px-8 py-3 border border-neutral-700 text-neutral-400 hover:border-amber-500/50 hover:text-amber-400 transition-all duration-300 text-sm tracking-widest"
        onClick={() => navigate('/info')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        即刻探索
      </motion.button>
    </div>
  )
}
