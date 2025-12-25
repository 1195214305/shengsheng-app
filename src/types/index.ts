// 用户信息类型
export interface UserInfo {
  name: string
  gender: 'male' | 'female'
  birthDate: string // YYYY-MM-DD
  birthTime: string // HH:mm
  birthPlace: string
  // 八字信息（由后端计算）
  bazi?: BaziInfo
}

// 八字信息
export interface BaziInfo {
  yearPillar: Pillar // 年柱
  monthPillar: Pillar // 月柱
  dayPillar: Pillar // 日柱
  hourPillar: Pillar // 时柱
  dayMaster: string // 日主
  fiveElements: FiveElementsBalance // 五行平衡
}

// 四柱
export interface Pillar {
  heavenlyStem: string // 天干
  earthlyBranch: string // 地支
  hiddenStems: string[] // 藏干
}

// 五行平衡
export interface FiveElementsBalance {
  wood: number // 木
  fire: number // 火
  earth: number // 土
  metal: number // 金
  water: number // 水
}

// 宗师类型
export interface Master {
  id: string
  name: string
  title: string
  school: string // 派系
  personality: string
  avatar: string
  color: string
  description: string
}

// 聊天消息
export interface ChatMessage {
  id: string
  masterId: string
  content: string
  timestamp: number
  highlighted?: boolean // 是否被小剪刀选中
  isUser?: boolean
}

// 命运推演节点
export interface FateNode {
  id: string
  question: string
  summary: string
  parentId: string | null
  children: string[]
  messages: ChatMessage[]
  createdAt: number
}

// 对话档案
export interface ConversationArchive {
  id: string
  title: string
  domain: string
  summary: string
  nodes: FateNode[]
  chaosBox: string[] // 混沌回收箱内容
  createdAt: number
  sunlightValue: number // 阳光值
}

// 领域类型
export interface Domain {
  id: string
  name: string
  icon: string
  description: string
  suggestedTopics: string[]
}

// 应用状态
export interface AppState {
  userInfo: UserInfo | null
  currentDomain: string | null
  currentConversation: ConversationArchive | null
  archives: ConversationArchive[]
  totalSunlight: number
  scissorsMode: boolean
}
