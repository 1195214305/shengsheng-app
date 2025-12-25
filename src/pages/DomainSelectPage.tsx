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
    navigate(`/chat/${domainId}${question ? `?q=${encodeURIComponent(question)}` : ''}`)
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
    <div className="min-h-screen relative z-10 px-4 py-8">
      {/* 返回按钮 */}
      <motion.button
        className="absolute top-6 left-6 text-ink-400 hover:text-gold-400 transition-colors"
        onClick={() => navigate('/info')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* 用户信息确认 */}
      {userInfo && (
        <motion.div
          className="max-w-2xl mx-auto mt-16 mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-ink-400 text-sm mb-2">
            {userInfo.name}，{userInfo.gender === 'male' ? '乾造' : '坤造'}
          </p>
          <p className="text-ink-500 text-xs">
            {userInfo.birthDate} {userInfo.birthTime} · {userInfo.birthPlace}
          </p>
        </motion.div>
      )}

      {/* 标题 */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="font-serif text-3xl text-gold-400 mb-4">选择探索领域</h1>
        <p className="text-ink-400">你可以选择一个领域深入探讨，或直接描述你的问题</p>
      </motion.div>

      {/* 三种选择方式 */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 方式一：骰子随机 */}
        <motion.div
          className="card-ink p-6 rounded-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg text-gold-400 mb-1">随机探索</h3>
              <p className="text-ink-500 text-sm">让命运为你选择一个领域</p>
            </div>
            <motion.button
              className={`w-16 h-16 rounded-sm border-2 border-gold-500/50 flex items-center justify-center text-3xl ${
                isRolling ? 'dice-roll' : ''
              }`}
              onClick={handleDiceRoll}
              disabled={isRolling}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-gold-400">
                {selectedDomain ? DOMAINS.find(d => d.id === selectedDomain)?.icon : '⚅'}
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* 方式二：自定义问题 */}
        <motion.div
          className="card-ink p-6 rounded-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-serif text-lg text-gold-400 mb-3">描述你的问题</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitQuestion()}
              placeholder="例如：我当前有两份offer，应该如何选择？"
              className="input-ink flex-1 rounded-sm"
            />
            <motion.button
              className="px-6 py-3 bg-gold-500/20 border border-gold-500/50 text-gold-400 rounded-sm hover:bg-gold-500/30 transition-colors"
              onClick={handleSubmitQuestion}
              disabled={!customQuestion.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
          </div>
        </motion.div>

        {/* 方式三：领域卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-serif text-lg text-gold-400 mb-4 text-center">或选择一个领域</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence>
              {DOMAINS.map((domain, index) => (
                <motion.button
                  key={domain.id}
                  className={`card-ink p-6 rounded-sm text-left transition-all ${
                    selectedDomain === domain.id ? 'border-gold-500' : ''
                  }`}
                  onClick={() => enterDomain(domain.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, borderColor: 'rgba(212, 163, 92, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-calligraphy text-4xl text-gold-400 mb-3">
                    {domain.icon}
                  </div>
                  <h4 className="font-serif text-lg text-ink-100 mb-1">{domain.name}</h4>
                  <p className="text-ink-500 text-xs">{domain.description}</p>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
