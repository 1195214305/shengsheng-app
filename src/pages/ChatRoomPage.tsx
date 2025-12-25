import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { MASTERS } from '../utils/masters'
import { calculateBazi, formatBazi, getDayMasterElement, analyzeDayMasterStrength } from '../utils/bazi'
import FateTree from '../components/FateTree'
import ChaosBox from '../components/ChaosBox'

// 领域名称映射
const DOMAIN_NAMES: Record<string, string> = {
  career: '事业',
  wealth: '财运',
  relationship: '感情',
  health: '健康',
  study: '学业',
  family: '家庭'
}

// 随机话题
const RANDOM_TOPICS: Record<string, string[]> = {
  career: [
    '我是要独立创业、合伙经营，还是在平台上打工？',
    '我适合什么类型的工作？',
    '今年的事业运势如何？',
    '我应该跳槽吗？',
    '如何提升我的职场竞争力？'
  ],
  wealth: [
    '我的财运何时会好转？',
    '我适合投资还是储蓄？',
    '如何提升我的财运？',
    '我的正财和偏财哪个更旺？'
  ],
  relationship: [
    '我的正缘何时会出现？',
    '我和TA适合在一起吗？',
    '如何改善我的感情运？',
    '我的婚姻会幸福吗？'
  ],
  health: [
    '我需要注意哪些健康问题？',
    '如何调理我的身体？',
    '我的精神状态如何改善？'
  ],
  study: [
    '我适合学什么专业？',
    '考试运势如何？',
    '如何提升学习效率？'
  ],
  family: [
    '如何改善家庭关系？',
    '我适合什么时候要孩子？',
    '如何与父母更好相处？'
  ]
}

interface Message {
  id: string
  masterId: string
  content: string
  timestamp: number
  isUser?: boolean
}

export default function ChatRoomPage() {
  const { domain } = useParams<{ domain: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { userInfo, currentConversation, setCurrentConversation, addToChaosBox, scissorsMode, toggleScissorsMode, saveToArchive } = useAppStore()

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeMasters, setActiveMasters] = useState<string[]>(['fang']) // 默认方长老
  const [showMasterSelect, setShowMasterSelect] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [showChaosBox, setShowChaosBox] = useState(false)
  const [currentNodeId, setCurrentNodeId] = useState('root')
  const [baziInfo, setBaziInfo] = useState<ReturnType<typeof calculateBazi> | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // 计算八字
  useEffect(() => {
    if (userInfo) {
      const bazi = calculateBazi(userInfo.birthDate, userInfo.birthTime)
      setBaziInfo(bazi)
    }
  }, [userInfo])

  // 初始化对话
  useEffect(() => {
    const initialQuestion = searchParams.get('q')
    if (initialQuestion && messages.length === 0) {
      handleSendMessage(initialQuestion)
    }
  }, [searchParams])

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 模拟AI回复
  const simulateAIResponse = useCallback(async (masterId: string, question: string): Promise<string> => {
    const master = MASTERS.find(m => m.id === masterId)
    if (!master || !baziInfo) return ''

    // 这里应该调用后端API，现在用模拟数据
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    const dayMasterElement = getDayMasterElement(baziInfo.dayMaster)
    const strength = analyzeDayMasterStrength(baziInfo)
    const strengthText = strength === 'strong' ? '身旺' : strength === 'weak' ? '身弱' : '中和'

    // 根据不同宗师生成不同风格的回复
    const responses: Record<string, string[]> = {
      fang: [
        `从格局来看，${userInfo?.name}的命盘呈现出${strengthText}的特点。日主${baziInfo.dayMaster}${dayMasterElement}，${strength === 'strong' ? '需要泄耗来平衡' : strength === 'weak' ? '需要生扶来增强' : '五行较为平衡'}。\n\n关于"${question}"这个问题，我认为需要从整体格局来分析...`,
        `看这个八字：${formatBazi(baziInfo)}，整体格局还是不错的。${strengthText}之人，${strength === 'strong' ? '适合开拓进取' : strength === 'weak' ? '宜稳扎稳打' : '可攻可守'}。\n\n针对你的问题，我的建议是...`
      ],
      zhang: [
        `${formatBazi(baziInfo)}，${strengthText}，${strength === 'weak' ? '富屋贫人之象' : strength === 'strong' ? '有魄力但易冲动' : '平平无奇'}。\n\n你问"${question}"？直说吧，${strength === 'weak' ? '先把自己养好再说其他的' : '有这个命，但得看你敢不敢拼'}。`,
        `我看你这八字，${baziInfo.dayMaster}日主${strengthText}。${strength === 'weak' ? '别想太多，先活下来' : '有点本事，但别太飘'}。\n\n关于你的问题，我只说一句：${strength === 'strong' ? '敢干就干，别婆婆妈妈' : '稳着点，别瞎折腾'}。`
      ],
      li: [
        `从心理学角度来看，${strengthText}的命格特质反映在性格上，往往表现为${strength === 'strong' ? '自信、主动、有领导力' : strength === 'weak' ? '敏感、细腻、善于合作' : '适应性强、灵活变通'}。\n\n关于"${question}"，我建议你从以下几个方面思考...`,
        `你的八字显示出${dayMasterElement}的特质，这在现代心理学中对应着${dayMasterElement === '木' ? '成长型思维' : dayMasterElement === '火' ? '热情外向' : dayMasterElement === '土' ? '稳重务实' : dayMasterElement === '金' ? '理性果断' : '灵活适应'}的性格倾向。\n\n针对你的问题，我的建议是...`
      ],
      chen: [
        `道法自然，${userInfo?.name}的命盘中${dayMasterElement}气为主，当顺应${dayMasterElement}之性。${strength === 'strong' ? '阳盛则宜收敛' : strength === 'weak' ? '阴盛则宜培养' : '阴阳调和，顺其自然'}。\n\n关于"${question}"，老道以为，不必强求，顺势而为即可。`,
        `《道德经》云："知人者智，自知者明。"你这八字${strengthText}，${strength === 'strong' ? '当学水之柔' : strength === 'weak' ? '当养浩然之气' : '守中为上'}。\n\n你所问之事，关键在于...`
      ],
      wang: [
        `孩子啊，奶奶看了你的八字，${strengthText}的命，${strength === 'strong' ? '是个有主见的' : strength === 'weak' ? '心思细腻' : '挺好的'}。\n\n你问"${question}"，奶奶跟你说啊，这事儿得看你自己怎么想。命是死的，人是活的...`,
        `来来来，让奶奶看看。${formatBazi(baziInfo)}，嗯，${strengthText}。${strength === 'strong' ? '你这孩子有股子冲劲' : strength === 'weak' ? '你这孩子心善' : '你这孩子挺稳当'}。\n\n关于你说的事儿，奶奶觉得...`
      ]
    }

    const masterResponses = responses[masterId] || responses.fang
    return masterResponses[Math.floor(Math.random() * masterResponses.length)]
  }, [baziInfo, userInfo])

  // 发送消息
  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText || isLoading) return

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      masterId: 'user',
      content: messageText,
      timestamp: Date.now(),
      isUser: true
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // 获取第一个宗师的回复
    const firstMasterId = activeMasters[0]
    const response = await simulateAIResponse(firstMasterId, messageText)

    const masterMessage: Message = {
      id: (Date.now() + 1).toString(),
      masterId: firstMasterId,
      content: response,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, masterMessage])
    setIsLoading(false)
  }

  // 引发群辨
  const handleGroupDebate = async () => {
    if (isLoading || messages.length === 0) return

    setIsLoading(true)
    const lastUserMessage = [...messages].reverse().find(m => m.isUser)
    if (!lastUserMessage) {
      setIsLoading(false)
      return
    }

    // 获取其他宗师的回复
    for (const masterId of activeMasters.slice(1)) {
      const response = await simulateAIResponse(masterId, lastUserMessage.content)
      const masterMessage: Message = {
        id: Date.now().toString() + masterId,
        masterId,
        content: response,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, masterMessage])
    }

    setIsLoading(false)
  }

  // 处理文本选择（小剪刀功能）
  const handleTextSelection = () => {
    if (!scissorsMode) return

    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim())
    }
  }

  // 添加到混沌回收箱
  const handleAddToChaos = () => {
    if (selectedText) {
      addToChaosBox(selectedText)
      setSelectedText('')
      toggleScissorsMode()
    }
  }

  // 众师再辨
  const handleReDebate = async () => {
    if (!selectedText || isLoading) return

    setIsLoading(true)

    // 添加系统消息
    const systemMessage: Message = {
      id: Date.now().toString(),
      masterId: 'system',
      content: `用户对以下内容有疑问：\n"${selectedText}"`,
      timestamp: Date.now()
    }
    setMessages(prev => [...prev, systemMessage])

    // 获取所有宗师的再辨
    for (const masterId of activeMasters) {
      const response = await simulateAIResponse(masterId, `请解释这句话的含义：${selectedText}`)
      const masterMessage: Message = {
        id: Date.now().toString() + masterId,
        masterId,
        content: response,
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, masterMessage])
    }

    setSelectedText('')
    toggleScissorsMode()
    setIsLoading(false)
  }

  // 结束圆桌会
  const handleEndSession = () => {
    saveToArchive()
    navigate('/garden')
  }

  // 选择随机话题
  const handleRandomTopic = () => {
    const topics = RANDOM_TOPICS[domain || 'career'] || RANDOM_TOPICS.career
    const randomTopic = topics[Math.floor(Math.random() * topics.length)]
    setInputValue(randomTopic)
  }

  if (!userInfo) {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen flex relative z-10">
      {/* 左侧：对话区域 */}
      <div className="flex-1 flex flex-col max-w-3xl">
        {/* 顶部导航 */}
        <div className="p-4 border-b border-ink-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/domain')}
              className="text-ink-400 hover:text-gold-400 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="font-serif text-lg text-gold-400">
                {DOMAIN_NAMES[domain || ''] || '对话'}
              </h1>
              <p className="text-ink-500 text-xs">
                {userInfo.name} · {baziInfo ? formatBazi(baziInfo) : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 小剪刀按钮 */}
            <button
              onClick={toggleScissorsMode}
              className={`p-2 rounded-sm transition-colors ${
                scissorsMode ? 'bg-gold-500/20 text-gold-400' : 'text-ink-400 hover:text-gold-400'
              }`}
              title="我还有一些疑问"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="6" cy="6" r="3"/>
                <circle cx="6" cy="18" r="3"/>
                <line x1="20" y1="4" x2="8.12" y2="15.88"/>
                <line x1="14.47" y1="14.48" x2="20" y2="20"/>
                <line x1="8.12" y1="8.12" x2="12" y2="12"/>
              </svg>
            </button>

            {/* 混沌回收箱 */}
            <button
              onClick={() => setShowChaosBox(true)}
              className="p-2 text-ink-400 hover:text-gold-400 transition-colors"
              title="混沌回收箱"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </button>

            {/* 结束圆桌会 */}
            <button
              onClick={handleEndSession}
              className="px-3 py-1 text-sm border border-ink-700 text-ink-400 hover:border-gold-500 hover:text-gold-400 rounded-sm transition-colors"
            >
              结束圆桌会
            </button>
          </div>
        </div>

        {/* 宗师选择 */}
        <div className="p-4 border-b border-ink-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-ink-500 text-sm">参与宗师：</span>
            <button
              onClick={() => setShowMasterSelect(!showMasterSelect)}
              className="text-gold-400 text-sm hover:underline"
            >
              {showMasterSelect ? '收起' : '管理'}
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {MASTERS.filter(m => activeMasters.includes(m.id)).map(master => (
              <div
                key={master.id}
                className="flex items-center gap-2 px-3 py-1 rounded-sm"
                style={{ backgroundColor: `${master.color}20`, borderLeft: `3px solid ${master.color}` }}
              >
                <span className="font-serif text-sm" style={{ color: master.color }}>
                  {master.avatar}
                </span>
                <span className="text-ink-200 text-sm">{master.name}</span>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {showMasterSelect && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 overflow-hidden"
              >
                {MASTERS.map(master => (
                  <button
                    key={master.id}
                    onClick={() => {
                      if (activeMasters.includes(master.id)) {
                        if (activeMasters.length > 1) {
                          setActiveMasters(activeMasters.filter(id => id !== master.id))
                        }
                      } else {
                        setActiveMasters([...activeMasters, master.id])
                      }
                    }}
                    className={`p-3 rounded-sm border text-left transition-all ${
                      activeMasters.includes(master.id)
                        ? 'border-gold-500/50 bg-gold-500/10'
                        : 'border-ink-700 hover:border-ink-500'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-serif text-lg" style={{ color: master.color }}>
                        {master.avatar}
                      </span>
                      <span className="text-ink-200 text-sm">{master.name}</span>
                    </div>
                    <p className="text-ink-500 text-xs">{master.title}</p>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 消息列表 */}
        <div
          ref={chatContainerRef}
          className={`flex-1 overflow-y-auto p-4 space-y-4 ${scissorsMode ? 'scissors-cursor' : ''}`}
          onMouseUp={handleTextSelection}
        >
          {messages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-ink-500 mb-4">选择一个话题开始对话</p>
              <div className="flex flex-wrap justify-center gap-2">
                {(RANDOM_TOPICS[domain || 'career'] || []).slice(0, 3).map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(topic)}
                    className="px-4 py-2 text-sm border border-ink-700 text-ink-300 hover:border-gold-500 hover:text-gold-400 rounded-sm transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            if (message.isUser) {
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[80%] px-4 py-3 bg-gold-500/20 border border-gold-500/30 rounded-sm">
                    <p className="text-ink-100">{message.content}</p>
                  </div>
                </motion.div>
              )
            }

            if (message.masterId === 'system') {
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-2"
                >
                  <p className="text-ink-500 text-sm">{message.content}</p>
                </motion.div>
              )
            }

            const master = MASTERS.find(m => m.id === message.masterId)
            if (!master) return null

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="chat-bubble"
                style={{ borderLeftColor: master.color }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-8 h-8 rounded-sm flex items-center justify-center font-serif"
                    style={{ backgroundColor: `${master.color}30`, color: master.color }}
                  >
                    {master.avatar}
                  </span>
                  <span className="text-ink-300 text-sm">{master.name}</span>
                  <span className="text-ink-600 text-xs">{master.title}</span>
                </div>
                <p className="text-ink-200 whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
              </motion.div>
            )
          })}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-ink-500"
            >
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gold-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gold-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gold-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm">宗师正在思考...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 选中文本操作 */}
        <AnimatePresence>
          {selectedText && scissorsMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-4 border-t border-ink-800 bg-ink-900/80"
            >
              <p className="text-ink-400 text-sm mb-2">已选中：</p>
              <p className="text-gold-400 text-sm mb-3 p-2 bg-gold-500/10 rounded-sm">
                "{selectedText}"
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleReDebate}
                  className="flex-1 py-2 bg-gold-500/20 border border-gold-500/50 text-gold-400 rounded-sm hover:bg-gold-500/30 transition-colors text-sm"
                >
                  引发众师再辨
                </button>
                <button
                  onClick={handleAddToChaos}
                  className="flex-1 py-2 border border-ink-700 text-ink-400 rounded-sm hover:border-ink-500 transition-colors text-sm"
                >
                  放入混沌回收箱
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 输入区域 */}
        <div className="p-4 border-t border-ink-800">
          <div className="flex gap-2 mb-2">
            <button
              onClick={handleRandomTopic}
              className="px-3 py-1 text-xs border border-ink-700 text-ink-400 hover:border-gold-500 hover:text-gold-400 rounded-sm transition-colors"
            >
              随机话题
            </button>
            {activeMasters.length > 1 && messages.length > 0 && (
              <button
                onClick={handleGroupDebate}
                disabled={isLoading}
                className="px-3 py-1 text-xs border border-gold-500/50 text-gold-400 hover:bg-gold-500/10 rounded-sm transition-colors disabled:opacity-50"
              >
                引发群辨
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="输入你的问题..."
              className="input-ink flex-1 rounded-sm"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="px-6 py-3 bg-gold-500/20 border border-gold-500/50 text-gold-400 rounded-sm hover:bg-gold-500/30 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 右侧：命运推演术 */}
      <div className="hidden lg:block w-96 border-l border-ink-800 p-4">
        <h2 className="font-serif text-lg text-gold-400 mb-4">命运推演术</h2>
        <FateTree
          nodes={currentConversation?.nodes || []}
          currentNodeId={currentNodeId}
          onNodeClick={setCurrentNodeId}
        />
      </div>

      {/* 混沌回收箱弹窗 */}
      <AnimatePresence>
        {showChaosBox && (
          <ChaosBox
            items={currentConversation?.chaosBox || []}
            onClose={() => setShowChaosBox(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
