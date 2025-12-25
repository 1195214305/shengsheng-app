import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

export default function HomePage() {
  const navigate = useNavigate()
  const { totalSunlight } = useAppStore()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4">
      {/* 阳光值显示 */}
      <motion.div
        className="absolute top-6 right-6 flex items-center gap-2 text-gold-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
        <span className="font-serif">{totalSunlight}</span>
      </motion.div>

      {/* 花园入口 */}
      <motion.button
        className="absolute top-6 left-6 text-gold-400 hover:text-gold-300 transition-colors"
        onClick={() => navigate('/garden')}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <span className="font-serif text-sm">花园</span>
        </div>
      </motion.button>

      {/* 主标题区域 */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* 品牌名 */}
        <motion.h1
          className="font-calligraphy text-8xl md:text-9xl text-gold-400 ink-effect mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          生生
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          className="font-serif text-lg md:text-xl text-ink-200 tracking-widest mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          命运可能性模拟器
        </motion.p>

        {/* 理念文字 */}
        <motion.p
          className="text-ink-400 text-sm max-w-md mx-auto mt-6 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          一象生多相，定数与变数交织
          <br />
          知象、转心、修相、立命
        </motion.p>
      </motion.div>

      {/* 即刻探索按钮 */}
      <motion.button
        className="btn-gold mt-16 px-12 py-4 text-lg font-serif tracking-wider rounded-sm"
        onClick={() => navigate('/info')}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        即刻探索
      </motion.button>

      {/* 底部装饰线 */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-500/50" />
          <div className="w-2 h-2 rounded-full bg-gold-500/50" />
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-500/50" />
        </div>
      </motion.div>

      {/* 八卦装饰 - 淡淡的背景 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        initial={{ opacity: 0, rotate: -30 }}
        animate={{ opacity: 0.03, rotate: 0 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        <svg className="w-[600px] h-[600px]" viewBox="0 0 200 200">
          {/* 太极图 */}
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold-400"/>
          <path d="M100 10 A90 90 0 0 1 100 190 A45 45 0 0 1 100 100 A45 45 0 0 0 100 10" fill="currentColor" className="text-gold-400"/>
          <circle cx="100" cy="55" r="12" fill="currentColor" className="text-ink-950"/>
          <circle cx="100" cy="145" r="12" fill="currentColor" className="text-gold-400"/>

          {/* 八卦符号 - 简化版 */}
          <g className="text-gold-400" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            {/* 乾 - 上 */}
            <line x1="85" y1="20" x2="115" y2="20"/>
            {/* 坤 - 下 */}
            <line x1="85" y1="180" x2="95" y2="180"/>
            <line x1="105" y1="180" x2="115" y2="180"/>
            {/* 离 - 左 */}
            <line x1="15" y1="100" x2="25" y2="100"/>
            {/* 坎 - 右 */}
            <line x1="175" y1="100" x2="185" y2="100"/>
          </g>
        </svg>
      </motion.div>
    </div>
  )
}
