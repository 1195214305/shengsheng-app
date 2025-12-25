import { motion } from 'framer-motion'

interface ChaosBoxProps {
  items: string[]
  onClose: () => void
}

export default function ChaosBox({ items, onClose }: ChaosBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-ink-900 border border-ink-700 rounded-sm max-w-lg w-full max-h-[80vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="p-4 border-b border-ink-800 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg text-gold-400">混沌回收箱</h2>
            <p className="text-ink-500 text-xs mt-1">
              存放那些让你困惑或不认同的断语
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-ink-400 hover:text-gold-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容 */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-ink-700 flex items-center justify-center">
                <svg className="w-8 h-8 text-ink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
              </div>
              <p className="text-ink-500 text-sm">回收箱是空的</p>
              <p className="text-ink-600 text-xs mt-2">
                使用小剪刀选中文字后<br/>
                可以放入这里
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 bg-ink-800/50 border border-ink-700 rounded-sm"
                >
                  <p className="text-ink-300 text-sm">"{item}"</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* 底部说明 */}
        <div className="p-4 border-t border-ink-800 bg-ink-900/50">
          <p className="text-ink-500 text-xs">
            这些内容代表了你当前的困惑。随着时间推移和经历增长，
            你可能会对它们有新的理解。混沌中蕴含着成长的种子。
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
