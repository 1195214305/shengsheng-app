import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

interface InfoInputModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export default function InfoInputModal({ isOpen, onClose, onComplete }: InfoInputModalProps) {
  const { setUserInfo } = useAppStore()
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  })

  const handleSubmit = () => {
    if (formData.name && formData.birthDate && formData.birthTime && formData.birthPlace) {
      setUserInfo(formData)
      onComplete()
    }
  }

  const isFormValid = formData.name && formData.birthDate && formData.birthTime && formData.birthPlace

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* 背景遮罩 */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 弹窗内容 */}
          <motion.div
            className="relative w-full max-w-md mx-4 bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-blue-500/20 rounded-2xl p-8 shadow-2xl shadow-blue-500/10"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 标题 */}
            <div className="text-center mb-8">
              <h2 className="text-2xl text-white mb-2" style={{ fontFamily: 'STKaiti, KaiTi, serif' }}>
                录入信息
              </h2>
              <p className="text-slate-400 text-sm">请输入您的基本信息以开始探索</p>
            </div>

            {/* 表单 */}
            <div className="space-y-5">
              {/* 姓名 */}
              <div>
                <label className="block text-slate-400 text-sm mb-2">姓名</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入您的姓名"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              {/* 性别 */}
              <div>
                <label className="block text-slate-400 text-sm mb-2">性别</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                    className={`flex-1 py-3 rounded-lg border transition-all ${
                      formData.gender === 'male'
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    男 (乾造)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                    className={`flex-1 py-3 rounded-lg border transition-all ${
                      formData.gender === 'female'
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    女 (坤造)
                  </button>
                </div>
              </div>

              {/* 出生日期 */}
              <div>
                <label className="block text-slate-400 text-sm mb-2">出生日期</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>

              {/* 出生时辰 */}
              <div>
                <label className="block text-slate-400 text-sm mb-2">出生时辰</label>
                <select
                  value={formData.birthTime}
                  onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                >
                  <option value="">请选择时辰</option>
                  <option value="子时">子时 (23:00-01:00)</option>
                  <option value="丑时">丑时 (01:00-03:00)</option>
                  <option value="寅时">寅时 (03:00-05:00)</option>
                  <option value="卯时">卯时 (05:00-07:00)</option>
                  <option value="辰时">辰时 (07:00-09:00)</option>
                  <option value="巳时">巳时 (09:00-11:00)</option>
                  <option value="午时">午时 (11:00-13:00)</option>
                  <option value="未时">未时 (13:00-15:00)</option>
                  <option value="申时">申时 (15:00-17:00)</option>
                  <option value="酉时">酉时 (17:00-19:00)</option>
                  <option value="戌时">戌时 (19:00-21:00)</option>
                  <option value="亥时">亥时 (21:00-23:00)</option>
                </select>
              </div>

              {/* 出生地点 */}
              <div>
                <label className="block text-slate-400 text-sm mb-2">出生地点</label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  placeholder="请输入出生城市"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* 提交按钮 */}
            <motion.button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-full mt-8 py-4 rounded-xl font-medium transition-all ${
                isFormValid
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              whileHover={isFormValid ? { scale: 1.02 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
            >
              开始探索
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
