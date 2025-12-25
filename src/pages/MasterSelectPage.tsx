import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { MASTERS } from '../utils/masters'

export default function MasterSelectPage() {
  const navigate = useNavigate()
  const { domain } = useParams<{ domain: string }>()
  const [searchParams] = useSearchParams()
  const { userInfo } = useAppStore()
  const [selectedMasters, setSelectedMasters] = useState<string[]>(['fang']) // 默认选择方长老

  const question = searchParams.get('q')

  const toggleMaster = (masterId: string) => {
    if (selectedMasters.includes(masterId)) {
      // 至少保留一个宗师
      if (selectedMasters.length > 1) {
        setSelectedMasters(selectedMasters.filter(id => id !== masterId))
      }
    } else {
      setSelectedMasters([...selectedMasters, masterId])
    }
  }

  const handleStart = () => {
    // 将选中的宗师信息传递到聊天页面
    const mastersParam = selectedMasters.join(',')
    const queryParams = new URLSearchParams()
    queryParams.set('masters', mastersParam)
    if (question) {
      queryParams.set('q', question)
    }
    navigate(`/chat/${domain}?${queryParams.toString()}`)
  }

  if (!userInfo) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen relative z-10 flex flex-col">
      {/* 返回按钮 */}
      <motion.button
        className="absolute top-8 left-8 text-neutral-500 hover:text-amber-400 transition-colors"
        onClick={() => navigate('/domain')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        {/* 标题 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl text-neutral-200 mb-3" style={{ fontFamily: 'STKaiti, KaiTi, serif' }}>
            选择参与的宗师
          </h1>
          <p className="text-neutral-500 text-sm">
            不同宗师有不同的视角和方法论，可选择多位宗师进行群辨
          </p>
        </motion.div>

        {/* 宗师卡片列表 */}
        <motion.div
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MASTERS.map((master, index) => (
              <motion.button
                key={master.id}
                className={`p-5 rounded-lg border text-left transition-all duration-300 ${
                  selectedMasters.includes(master.id)
                    ? 'border-amber-500/50 bg-amber-500/5'
                    : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/30'
                }`}
                onClick={() => toggleMaster(master.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-4">
                  {/* 头像 */}
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl shrink-0"
                    style={{
                      backgroundColor: `${master.color}20`,
                      color: master.color,
                      fontFamily: 'STKaiti, KaiTi, serif'
                    }}
                  >
                    {master.avatar}
                  </div>

                  {/* 信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-neutral-200 font-medium">{master.name}</span>
                      <span className="text-neutral-600 text-xs">{master.title}</span>
                    </div>
                    <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2">
                      {master.personality}
                    </p>
                  </div>

                  {/* 选中标记 */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    selectedMasters.includes(master.id)
                      ? 'border-amber-500 bg-amber-500'
                      : 'border-neutral-700'
                  }`}>
                    {selectedMasters.includes(master.id) && (
                      <svg className="w-3 h-3 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* 详细描述 */}
                <p className="text-neutral-600 text-xs mt-3 leading-relaxed">
                  {master.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 已选择的宗师 */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-neutral-600 text-sm mb-4">
            已选择 {selectedMasters.length} 位宗师
            {selectedMasters.length > 1 && '，可进行群辨'}
          </p>

          <div className="flex items-center justify-center gap-2 mb-6">
            {selectedMasters.map(masterId => {
              const master = MASTERS.find(m => m.id === masterId)
              if (!master) return null
              return (
                <div
                  key={masterId}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{
                    backgroundColor: `${master.color}20`,
                    color: master.color,
                    fontFamily: 'STKaiti, KaiTi, serif'
                  }}
                >
                  {master.avatar}
                </div>
              )
            })}
          </div>

          {/* 开始按钮 */}
          <button
            className="px-12 py-3 border border-neutral-600 text-neutral-300 hover:border-amber-500/50 hover:text-amber-400 transition-all duration-300 text-sm tracking-widest"
            onClick={handleStart}
          >
            开始对话
          </button>
        </motion.div>
      </div>
    </div>
  )
}
