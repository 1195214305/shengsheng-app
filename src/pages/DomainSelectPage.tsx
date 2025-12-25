import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import LightRaysBackground from '../components/LightRaysBackground'

// 领域定义
const DOMAINS = [
  {
    id: 'career',
    name: '事业',
    icon: '业',
    description: '职业发展、创业选择、工作机遇',
    color: '#3B82F6',
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
    color: '#F59E0B',
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
    color: '#EC4899',
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
    color: '#10B981',
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
    color: '#8B5CF6',
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
    color: '#F97316',
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
  const [rotation, setRotation] = useState(0)
  const [customQuestion, setCustomQuestion] = useState('')
  const [isRolling, setIsRolling] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)
  const lastAngleRef = useRef(0)
  const velocityRef = useRef(0)
  const animationRef = useRef<number>()

  // 计算当前选中的领域索引
  const anglePerItem = 180 / (DOMAINS.length - 1)
  const normalizedRotation = ((rotation % 360) + 360) % 360
  const currentIndex = Math.round(normalizedRotation / anglePerItem) % DOMAINS.length
  const currentDomain = DOMAINS[Math.min(Math.max(currentIndex, 0), DOMAINS.length - 1)]

  // 计算鼠标相对于轮盘中心的角度
  const getAngleFromCenter = useCallback((clientX: number, clientY: number) => {
    if (!wheelRef.current) return 0
    const rect = wheelRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.bottom // 圆心在底部
    const deltaX = clientX - centerX
    const deltaY = centerY - clientY
    return Math.atan2(deltaX, deltaY) * (180 / Math.PI)
  }, [])

  // 惯性动画
  const animateInertia = useCallback(() => {
    if (Math.abs(velocityRef.current) < 0.1) {
      // 吸附到最近的领域
      const targetRotation = Math.round(rotation / anglePerItem) * anglePerItem
      setRotation(prev => prev + (targetRotation - prev) * 0.2)
      return
    }

    velocityRef.current *= 0.95 // 摩擦力
    setRotation(prev => {
      const newRotation = prev + velocityRef.current
      // 限制旋转范围在 0 到 180 度之间
      return Math.max(0, Math.min(180, newRotation))
    })
    animationRef.current = requestAnimationFrame(animateInertia)
  }, [rotation, anglePerItem])

  // 鼠标/触摸事件处理
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true)
    lastAngleRef.current = getAngleFromCenter(e.clientX, e.clientY)
    velocityRef.current = 0
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [getAngleFromCenter])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return

    const currentAngle = getAngleFromCenter(e.clientX, e.clientY)
    const deltaAngle = currentAngle - lastAngleRef.current

    velocityRef.current = deltaAngle * 0.5

    setRotation(prev => {
      const newRotation = prev + deltaAngle
      // 限制旋转范围
      return Math.max(0, Math.min(180, newRotation))
    })

    lastAngleRef.current = currentAngle
  }, [isDragging, getAngleFromCenter])

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
    animationRef.current = requestAnimationFrame(animateInertia)
  }, [animateInertia])

  // 清理动画
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // 骰子随机选择
  const handleDiceRoll = () => {
    setIsRolling(true)
    const targetIndex = Math.floor(Math.random() * DOMAINS.length)
    const targetRotation = targetIndex * anglePerItem

    // 动画旋转到目标位置
    let currentRotation = rotation
    const animate = () => {
      const diff = targetRotation - currentRotation
      if (Math.abs(diff) < 1) {
        setRotation(targetRotation)
        setIsRolling(false)
        return
      }
      currentRotation += diff * 0.1
      setRotation(currentRotation)
      requestAnimationFrame(animate)
    }
    animate()
  }

  // 点击领域卡片
  const handleDomainClick = (index: number) => {
    const targetRotation = index * anglePerItem
    setRotation(targetRotation)
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
      if (e.key === 'ArrowLeft') {
        setRotation(prev => Math.max(0, prev - anglePerItem))
      }
      if (e.key === 'ArrowRight') {
        setRotation(prev => Math.min(180, prev + anglePerItem))
      }
      if (e.key === 'Enter' && !customQuestion && currentDomain) {
        enterDomain(currentDomain.id)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentDomain, customQuestion, anglePerItem])

  // 轮盘半径和位置参数
  const wheelRadius = 320
  const cardSize = 100

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
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* 顶部区域 */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-8">
          {/* 标题 */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl text-white mb-2" style={{ fontFamily: 'STKaiti, KaiTi, serif' }}>
              选择探索领域
            </h1>
            <p className="text-slate-400 text-sm">拖动轮盘选择，或直接输入你的问题</p>
          </motion.div>

          {/* 输入框区域 */}
          <motion.div
            className="w-full max-w-xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              {/* 骰子按钮 */}
              <motion.button
                className={`w-12 h-12 rounded-xl border border-slate-700 bg-slate-900/50 flex items-center justify-center text-xl hover:border-blue-500/50 transition-colors ${
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
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all pr-12 text-sm"
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

          {/* 当前选中的领域信息 */}
          {currentDomain && (
            <motion.div
              className="text-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={currentDomain.id}
            >
              <h2
                className="text-4xl mb-2"
                style={{
                  fontFamily: 'STKaiti, KaiTi, serif',
                  color: currentDomain.color
                }}
              >
                {currentDomain.name}
              </h2>
              <p className="text-slate-400 text-sm mb-4">{currentDomain.description}</p>
              <motion.button
                onClick={() => enterDomain(currentDomain.id)}
                className="px-8 py-3 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-full text-white font-medium transition-all hover:shadow-lg hover:shadow-blue-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                进入探索
              </motion.button>
            </motion.div>
          )}

          {/* 推荐话题 */}
          {currentDomain && (
            <motion.div
              className="w-full max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={`topics-${currentDomain.id}`}
            >
              <div className="flex flex-wrap justify-center gap-2">
                {currentDomain.suggestedTopics.slice(0, 3).map((topic, index) => (
                  <motion.button
                    key={index}
                    onClick={() => enterDomain(currentDomain.id, topic)}
                    className="px-3 py-1.5 text-xs border border-slate-700 text-slate-400 hover:border-blue-500/30 hover:text-blue-400 rounded-full transition-colors bg-slate-900/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* 半圆轮盘区域 */}
        <div
          ref={wheelRef}
          className="relative h-48 w-full overflow-hidden cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: 'none' }}
        >
          {/* 轮盘容器 */}
          <div
            className="absolute left-1/2 bottom-0 origin-bottom"
            style={{
              transform: `translateX(-50%) rotate(${-rotation + 90}deg)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            {/* 领域卡片 */}
            {DOMAINS.map((domain, index) => {
              const angle = (index * anglePerItem - 90) * (Math.PI / 180)
              const x = Math.cos(angle) * wheelRadius
              const y = -Math.sin(angle) * wheelRadius
              const isSelected = index === currentIndex

              return (
                <motion.div
                  key={domain.id}
                  className={`absolute flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-slate-800/80 border-2 scale-110 z-10'
                      : 'bg-slate-900/60 border border-slate-700/50 hover:bg-slate-800/60'
                  }`}
                  style={{
                    width: cardSize,
                    height: cardSize,
                    left: x - cardSize / 2,
                    top: y - cardSize / 2,
                    borderColor: isSelected ? domain.color : undefined,
                    transform: `rotate(${rotation - 90}deg)`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDomainClick(index)
                  }}
                  whileHover={{ scale: isSelected ? 1.1 : 1.05 }}
                >
                  <span
                    className="text-3xl mb-1"
                    style={{
                      fontFamily: 'STKaiti, KaiTi, serif',
                      color: domain.color
                    }}
                  >
                    {domain.icon}
                  </span>
                  <span className={`text-xs ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                    {domain.name}
                  </span>
                </motion.div>
              )
            })}
          </div>

          {/* 中心指示器 */}
          <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50" />
          </div>

          {/* 弧形轨道指示 */}
          <svg
            className="absolute left-1/2 bottom-0 -translate-x-1/2 pointer-events-none"
            width={wheelRadius * 2 + 40}
            height={wheelRadius + 20}
            style={{ transform: 'translateX(-50%)' }}
          >
            <path
              d={`M 20 ${wheelRadius + 10} A ${wheelRadius} ${wheelRadius} 0 0 1 ${wheelRadius * 2 + 20} ${wheelRadius + 10}`}
              fill="none"
              stroke="rgba(59, 130, 246, 0.2)"
              strokeWidth="2"
              strokeDasharray="8 4"
            />
          </svg>
        </div>

        {/* 底部提示 */}
        <motion.p
          className="text-center text-slate-600 text-xs py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          拖动轮盘选择领域 · 点击卡片快速定位 · 按方向键微调
        </motion.p>
      </div>
    </div>
  )
}
