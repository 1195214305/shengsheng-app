import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import SunlightEffect from '../components/SunlightEffect'

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

    // 延迟执行删除，让动画先播放
    setTimeout(() => {
      const value = deleteArchive(id)
      setSunlightValue(value)
      setShowSunlight(true)
      setDeletingId(null)

      // 阳光特效持续时间
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
    <div className="min-h-screen relative z-10 px-4 py-8">
      {/* 顶部导航 */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-ink-400 hover:text-gold-400 transition-colors flex items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-serif">返回</span>
          </button>

          {/* 阳光值 */}
          <motion.div
            className="flex items-center gap-2 text-gold-400"
            animate={showSunlight ? { scale: [1, 1.2, 1] } : {}}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
            <span className="font-serif text-xl">{totalSunlight}</span>
          </motion.div>
        </div>
      </div>

      {/* 标题 */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-calligraphy text-4xl text-gold-400 mb-4">花园</h1>
        <p className="text-ink-400">你的命运探索档案</p>
        <p className="text-ink-500 text-sm mt-2">
          删除档案可以化作阳光，滋养新的探索
        </p>
      </motion.div>

      {/* 档案列表 */}
      <div className="max-w-4xl mx-auto">
        {archives.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-dashed border-ink-700 flex items-center justify-center">
              <svg className="w-12 h-12 text-ink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <p className="text-ink-500 mb-4">花园里还没有档案</p>
            <button
              onClick={() => navigate('/domain')}
              className="btn-gold px-8 py-3 rounded-sm font-serif"
            >
              开始探索
            </button>
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
                  className="card-ink p-6 rounded-sm relative group"
                >
                  {/* 领域标签 */}
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 text-xs bg-gold-500/10 text-gold-400 rounded-sm">
                      {DOMAIN_NAMES[archive.domain] || archive.domain}
                    </span>
                  </div>

                  {/* 标题 */}
                  <h3 className="font-serif text-lg text-ink-100 mb-2 pr-16">
                    {archive.title}
                  </h3>

                  {/* 摘要 */}
                  {archive.summary && (
                    <p className="text-ink-400 text-sm mb-4 line-clamp-2">
                      {archive.summary}
                    </p>
                  )}

                  {/* 统计信息 */}
                  <div className="flex items-center gap-4 text-ink-500 text-xs mb-4">
                    <span>{archive.nodes.length} 个节点</span>
                    <span>{archive.nodes.reduce((sum, n) => sum + n.messages.length, 0)} 条消息</span>
                    <span>{archive.chaosBox.length} 个困惑</span>
                  </div>

                  {/* 日期 */}
                  <p className="text-ink-600 text-xs">
                    {formatDate(archive.createdAt)}
                  </p>

                  {/* 操作按钮 */}
                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/chat/${archive.domain}`)}
                      className="p-2 text-ink-400 hover:text-gold-400 transition-colors"
                      title="继续探索"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDelete(archive.id, e)}
                      className="p-2 text-ink-400 hover:text-vermilion-400 transition-colors"
                      title="化作阳光"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
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
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-500/30" />
          <p className="text-ink-600 text-xs">一象生多相，定数与变数交织</p>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-500/30" />
        </div>
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
