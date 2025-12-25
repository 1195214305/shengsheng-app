import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

// 领域定义
const DOMAINS = [
  {
    id: 'career',
    name: '事业',
    icon: '业',
    description: '职业发展、创业选择、工作机遇',
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
  const [customQuestion, setCustomQuestion] = useState('')
  const [isRolling, setIsRolling] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)

  // 骰子随机选择
  const handleDiceRoll = () => {
    setIsRolling(true)
    let count = 0
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * DOMAINS.length)
      setSelectedDomain(DOMAINS[randomIndex].id)
      count++
      if (count > 10) {
        clearInterval(interval)
        setIsRolling(false)
        const finalDomain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)]
        setSelectedDomain(finalDomain.id)
        setTimeout(() => {
          enterDomain(finalDomain.id)
        }, 500)
      }
    }, 100)
  }

  // 进入领域
  const enterDomain = (domainId: string, question?: string) => {
    setCurrentDomain(domainId)

    // 创建新对话
    const newConversation = {
      id: Date.now().toString(),
      title: question || DOMAINS.find(d => d.id === domainId)?.name || '对话',
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
      // 根据问题内容智能匹配领域
      const keywords: Record<string, string[]> = {
        career: ['工作', '事业', '职业', '创业', '跳槽', 'offer', '公司', '老板'],
        wealth: ['钱', '财', '投资', '理财', '收入', '赚'],
        relationship: ['感情', '爱情', '婚姻', '对象', '恋爱', '桃花', '分手'],
        health: ['健康', '身体', '病', '养生', '运动', '睡眠'],
        study: ['学习', '考试', '学业', '专业', '升学', '读书'],
        family: ['家庭', '父母', '孩子', '家人', '亲戚']
      }

      let matchedDomain = 'career' // 默认事业
      for (const [domain, words] of Object.entries(keywords)) {
        if (words.some(word => customQuestion.includes(word))) {
          matchedDomain = domain
          break
        }
      }

      enterDomain(matchedDomain, customQuestion)
    }
  }

  return (
    <div className="min-h-screen relative z-10 flex flex-col">
      {/* 返回按钮 */}
      <motion.button
        className="absolute top-8 left-8 text-neutral-500 hover:text-amber-400 transition-colors"
        onClick={() => navigate('/info')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        {/* 用户信息确认 */}
        {userInfo && (
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-neutral-400 text-sm">
              {userInfo.name}，{userInfo.gender === 'male' ? '乾造' : '坤造'}
            </p>
            <p className="text-neutral-600 text-xs mt-1">
              {userInfo.birthDate} {userInfo.birthTime} · {userInfo.birthPlace}
            </p>
          </motion.div>
        )}

        {/* 标题 */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl text-neutral-200 mb-3" style={{ fontFamily: 'STKaiti, KaiTi, serif' }}>
            选择探索领域
          </h1>
          <p className="text-neutral-500 text-sm">你可以选择一个领域深入探讨，或直接描述你的问题</p>
        </motion.div>

        {/* 骰子和输入框区域 */}
        <motion.div
          className="w-full max-w-xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-4">
            {/* 骰子按钮 */}
            <motion.button
              className={`w-14 h-14 rounded-lg border border-neutral-700 flex items-center justify-center text-2xl hover:border-amber-500/50 transition-colors ${
                isRolling ? 'animate-pulse' : ''
              }`}
              onClick={handleDiceRoll}
              disabled={isRolling}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="随机选择领域"
            >
              <span className="text-amber-400">
                {selectedDomain && isRolling ? DOMAINS.find(d => d.id === selectedDomain)?.icon : '⚅'}
              </span>
            </motion.button>

            {/* 输入框 */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitQuestion()}
                placeholder="描述你的问题，例如：我当前有两份offer，应该如何选择？"
                className="w-full bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-3 text-neutral-200 placeholder-neutral-600 focus:border-amber-500/50 outline-none transition-colors pr-12"
              />
              <motion.button
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-amber-400 transition-colors"
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

        {/* 领域卡片网格 */}
        <motion.div
          className="w-full max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            <AnimatePresence>
              {DOMAINS.map((domain, index) => (
                <motion.button
                  key={domain.id}
                  className={`aspect-square rounded-lg border transition-all duration-300 flex flex-col items-center justify-center ${
                    selectedDomain === domain.id
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/30'
                  }`}
                  onClick={() => enterDomain(domain.id)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(251, 191, 36, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span
                    className="text-3xl text-amber-400/80 mb-2"
                    style={{ fontFamily: 'STKaiti, KaiTi, serif' }}
                  >
                    {domain.icon}
                  </span>
                  <span className="text-neutral-400 text-sm">{domain.name}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 底部提示 */}
        <motion.p
          className="text-neutral-600 text-xs mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          点击骰子随机选择 · 输入问题智能匹配 · 点击卡片直接进入
        </motion.p>
      </div>
    </div>
  )
}
