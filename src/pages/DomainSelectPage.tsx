import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import LightRaysBackground from '../components/LightRaysBackground'

// 领域定义
const DOMAINS = [
  {
    id: 'career',
    name: '事业',
    icon: '业',
    description: '职业发展、创业选择、工作机遇',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    suggestedTopics: [
      '我是要独立创业、合伙经营，还是在平台上打工？',
      '我适合什么类型的工作？',
      '今年的事业运势如何？',
      '我应该跳槽吗？'
    ]
  },
  {
    id: 'wealth',
    name: '财运',
    icon: '财',
    description: '财富积累、投资理财、收入来源',
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    suggestedTopics: [
      '我的财运何时会好转？',
      '我适合投资还是储蓄？',
      '如何提升我的财运？',
      '我的正财和偏财哪个更旺？'
    ]
  },
  {
    id: 'relationship',
    name: '感情',
    icon: '缘',
    description: '姻缘桃花、婚姻关系、人际交往',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    suggestedTopics: [
      '我的正缘何时会出现？',
      '我和TA适合在一起吗？',
      '如何改善我的感情运？',
      '我的婚姻会幸福吗？'
    ]
  },
  {
    id: 'health',
    name: '健康',
    icon: '康',
    description: '身体状况、养生调理、精神状态',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    suggestedTopics: [
      '我需要注意哪些健康问题？',
      '如何调理我的身体？',
      '我的精神状态如何改善？',
      '什么运动适合我？'
    ]
  },
  {
    id: 'study',
    name: '学业',
    icon: '学',
    description: '考试升学、技能学习、知识积累',
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    suggestedTopics: [
      '我适合学什么专业？',
      '考试运势如何？',
      '如何提升学习效率？',
      '我应该继续深造吗？'
    ]
  },
  {
    id: 'family',
    name: '家庭',
    icon: '家',
    description: '家庭关系、子女教育、长辈相处',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    suggestedTopics: [
      '如何改善家庭关系？',
      '我适合什么时候要孩子？',
      '如何与父母更好相处？',
      '家庭运势如何？'
    ]
  }
]

export default function DomainSelectPage() {
  const navigate = useNavigate()
  const { userInfo, setCurrentDomain, setCurrentConversation } = useAppStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [customQuestion, setCustomQuestion] = useState('')
  const [isRolling, setIsRolling] = useState(false)
  const [direction, setDirection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentDomain = DOMAINS[currentIndex]

  // 滑动到下一个
  const slideNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % DOMAINS.length)
  }

  // 滑动到上一个
  const slidePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + DOMAINS.length) % DOMAINS.length)
  }

  // 骰子随机选择
  const handleDiceRoll = () => {
    setIsRolling(true)
    let count = 0
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex(Math.floor(Math.random() * DOMAINS.length))
      count++
      if (count > 15) {
        clearInterval(interval)
        setIsRolling(false)
        const finalIndex = Math.floor(Math.random() * DOMAINS.length)
        setCurrentIndex(finalIndex)
      }
    }, 80)
  }

  // 进入领域
  const enterDomain = (domainId: string, question?: string) => {
    setCurrentDomain(domainId)

    const domain = DOMAINS.find(d => d.id === domainId)
    const newConversation = {
      id: Date.now().toString(),
      title: question || domain?.name || '对话',
      domain: domainId,
      summary: '',
      nodes: [{
        id: 'root',
        question: question || '开始探索',
        summary: '',
        parentId: null,
        children: [],
        messages: [],
        createdAt: Date.now()
      }],
      chaosBox: [],
      createdAt: Date.now(),
      sunlightValue: 0
    }

    setCurrentConversation(newConversation)
    navigate(`/masters/${domainId}${question ? `?q=${encodeURIComponent(question)}` : ''}`)
  }

  // 提交自定义问题
  const handleSubmitQuestion = () => {
    if (customQuestion.trim()) {
      const keywords: Record<string, string[]> = {
        career: ['工作', '事业', '职业', '创业', '跳槽', 'offer', '公司', '老板'],
        wealth: ['钱', '财', '投资', '理财', '收入', '赚'],
        relationship: ['感情', '爱情', '婚姻', '对象', '恋爱', '桃花', '分手'],
        health: ['健康', '身体', '病', '养生', '运动', '睡眠'],
        study: ['学习', '考试', '学业', '专业', '升学', '读书'],
        family: ['家庭', '父母', '孩子', '家人', '亲戚']
      }

      let matchedDomain = 'career'
      for (const [domain, words] of Object.entries(keywords)) {
        if (words.some(word => customQuestion.includes(word))) {
          matchedDomain = domain
          break
        }
      }

      enterDomain(matchedDomain, customQuestion)
    }
  }

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') slidePrev()
      if (e.key === 'ArrowRight') slideNext()
      if (e.key === 'Enter' && !customQuestion) enterDomain(currentDomain.id)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentDomain, customQuestion])

  // 触摸滑动
  const touchStartX = useRef(0)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) slideNext()
      else slidePrev()
    }
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8
    })
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      <LightRaysBackground />

      {/* 返回按钮 */}
      <motion.button
        className="absolute top-6 left-6 z-20 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
        onClick={() => navigate('/')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm">返回</span>
      </motion.button>

      {/* 用户信息 */}
      {userInfo && (
        <motion.div
          className="absolute top-6 right-6 z-20 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-slate-300 text-sm">{userInfo.name}</p>
          <p className="text-slate-500 text-xs">{userInfo.birthDate} {userInfo.birthTime}</p>
        </motion.div>
      )}

      {/* 主内容区域 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* 标题 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl text-white mb-2" style={{ fontFamily: 'STKaiti, KaiTi, serif' }}>
            选择探索领域
          </h1>
          <p className="text-slate-400 text-sm">左右滑动选择，或直接输入你的问题</p>
        </motion.div>

        {/* 输入框区域 */}
        <motion.div
          className="w-full max-w-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            {/* 骰子按钮 */}
            <motion.button
              className={`w-14 h-14 rounded-xl border border-slate-700 bg-slate-900/50 flex items-center justify-center text-2xl hover:border-blue-500/50 transition-colors ${
                isRolling ? 'animate-pulse' : ''
              }`}
              onClick={handleDiceRoll}
              disabled={isRolling}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="随机选择领域"
            >
              <span className="text-blue-400">⚅</span>
            </motion.button>

            {/* 输入框 */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitQuestion()}
                placeholder="描述你的问题，例如：我当前有两份offer，应该如何选择？"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all pr-12"
              />
              <motion.button
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-400 transition-colors"
                onClick={handleSubmitQuestion}
                disabled={!customQuestion.trim()}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* 轮播卡片区域 */}
        <div
          ref={containerRef}
          className="relative w-full max-w-lg h-80 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* 左箭头 */}
          <motion.button
            className="absolute left-0 z-10 w-12 h-12 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
            onClick={slidePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          {/* 卡片 */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`w-72 h-72 rounded-2xl border ${currentDomain.borderColor} ${currentDomain.bgColor} backdrop-blur-sm p-6 flex flex-col items-center justify-center cursor-pointer`}
              onClick={() => enterDomain(currentDomain.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* 图标 */}
              <span
                className={`text-6xl mb-4 bg-gradient-to-br ${currentDomain.color} bg-clip-text text-transparent`}
                style={{ fontFamily: 'STKaiti, KaiTi, serif' }}
              >
                {currentDomain.icon}
              </span>

              {/* 名称 */}
              <h2 className="text-2xl text-white mb-2" style={{ fontFamily: 'STKaiti, KaiTi, serif' }}>
                {currentDomain.name}
              </h2>

              {/* 描述 */}
              <p className="text-slate-400 text-sm text-center">
                {currentDomain.description}
              </p>

              {/* 点击提示 */}
              <div className="mt-4 flex items-center gap-1 text-slate-500 text-xs">
                <span>点击进入</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 右箭头 */}
          <motion.button
            className="absolute right-0 z-10 w-12 h-12 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
            onClick={slideNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* 指示器 */}
        <div className="flex items-center gap-2 mt-6">
          {DOMAINS.map((domain, index) => (
            <button
              key={domain.id}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-6 bg-blue-500'
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* 推荐话题 */}
        <motion.div
          className="mt-8 w-full max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-slate-500 text-xs text-center mb-3">推荐话题</p>
          <div className="flex flex-wrap justify-center gap-2">
            {currentDomain.suggestedTopics.slice(0, 3).map((topic, index) => (
              <motion.button
                key={index}
                onClick={() => enterDomain(currentDomain.id, topic)}
                className="px-4 py-2 text-xs border border-slate-700 text-slate-400 hover:border-blue-500/30 hover:text-blue-400 rounded-full transition-colors bg-slate-900/30"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {topic}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 底部提示 */}
        <motion.p
          className="absolute bottom-6 text-slate-600 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          使用方向键或滑动切换 · 按 Enter 确认选择
        </motion.p>
      </div>
    </div>
  )
}
