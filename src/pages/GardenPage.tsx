import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import SunlightEffect from '../components/SunlightEffect'
import LightRaysBackground from '../components/LightRaysBackground'

// 领域名称映射
const DOMAIN_NAMES: Record<string, string> = {
  career: '事业',
  wealth: '财运',
  relationship: '感情',
  health: '健康',
  study: '学业',
  family: '家庭'
}

export default function GardenPage() {
  const navigate = useNavigate()
  const { archives, deleteArchive, totalSunlight } = useAppStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showSunlight, setShowSunlight] = useState(false)
  const [sunlightValue, setSunlightValue] = useState(0)
  const [sunlightPosition, setSunlightPosition] = useState({ x: 0, y: 0 })

  // 删除档案并触发阳光特效
  const handleDelete = useCallback((id: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    setSunlightPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    })

    setDeletingId(id)

    setTimeout(() => {
      const value = deleteArchive(id)
      setSunlightValue(value)
      setShowSunlight(true)
      setDeletingId(null)

      setTimeout(() => {
        setShowSunlight(false)
      }, 2000)
    }, 500)
  }, [deleteArchive])

  // 格式化日期
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      <LightRaysBackground />

      {/* 顶部导航 */}
      <div className="relative z-20 h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-sm">
        <button
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">返回</span>
        </button>

        {/* 阳光值 */}
        <motion.div
          className="flex items-center gap-2 text-blue-400"
          animate={showSunlight ? { scale: [1, 1.2, 1] } : {}}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
          <span className="text-sm">{totalSunlight}</span>
        </motion.div>
      </div>

      {/* 主内容区域 */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* 标题 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl text-white mb-3" style={{ fontFamily: 'STKaiti, KaiTi, serif' }}>
            花园
          </h1>
          <p className="text-slate-400 text-sm">你的命运探索档案</p>
          <p className="text-slate-500 text-xs mt-2">
            删除档案可以化作阳光，滋养新的探索
          </p>
        </motion.div>

        {/* 档案列表 */}
        {archives.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-xl border border-dashed border-slate-700 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <p className="text-slate-500 mb-6">花园里还没有档案</p>
            <motion.button
              onClick={() => navigate('/domain')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-full text-white transition-all hover:shadow-lg hover:shadow-blue-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              开始探索
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence>
              {archives.map((archive, index) => (
                <motion.div
                  key={archive.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: deletingId === archive.id ? 0 : 1,
                    y: 0,
                    scale: deletingId === archive.id ? 0.8 : 1
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm relative group hover:border-slate-600 transition-colors"
                >
                  {/* 领域标签 */}
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 text-xs bg-blue-500/10 text-blue-400/80 rounded">
                      {DOMAIN_NAMES[archive.domain] || archive.domain}
                    </span>
                  </div>

                  {/* 标题 */}
                  <h3 className="text-white mb-2 pr-16">
                    {archive.title}
                  </h3>

                  {/* 摘要 */}
                  {archive.summary && (
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {archive.summary}
                    </p>
                  )}

                  {/* 统计信息 */}
                  <div className="flex items-center gap-4 text-slate-500 text-xs mb-3">
                    <span>{archive.nodes.length} 个节点</span>
                    <span>{archive.nodes.reduce((sum, n) => sum + n.messages.length, 0)} 条消息</span>
                    <span>{archive.chaosBox.length} 个困惑</span>
                  </div>

                  {/* 日期 */}
                  <p className="text-slate-600 text-xs">
                    {formatDate(archive.createdAt)}
                  </p>

                  {/* 操作按钮 */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/chat/${archive.domain}`)}
                      className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                      title="继续探索"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDelete(archive.id, e)}
                      className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                      title="化作阳光"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 底部装饰 */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-slate-600 text-xs">一象生多相，定数与变数交织</p>
      </motion.div>

      {/* 阳光特效 */}
      <AnimatePresence>
        {showSunlight && (
          <SunlightEffect
            value={sunlightValue}
            position={sunlightPosition}
            onComplete={() => setShowSunlight(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
