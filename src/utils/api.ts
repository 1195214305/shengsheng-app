// 生产环境使用Render后端，开发环境使用本地代理
const API_BASE = import.meta.env.PROD
  ? 'https://shengsheng-api.onrender.com/api'
  : '/api'

interface ChatRequest {
  masterId: string
  message: string
  userInfo?: {
    name: string
    gender: string
    birthDate: string
    birthTime: string
    birthPlace: string
    bazi?: string
  }
  conversationHistory?: Array<{
    content: string
    isUser: boolean
  }>
}

interface ChatResponse {
  masterId: string
  content: string
  timestamp: number
}

interface GroupDebateRequest {
  masterIds: string[]
  topic: string
  userInfo?: ChatRequest['userInfo']
  previousResponses?: Array<{
    masterId: string
    masterName: string
    content: string
  }>
}

interface ReDebateRequest {
  masterIds: string[]
  selectedText: string
  originalMasterId: string
  userInfo?: ChatRequest['userInfo']
}

// 单个宗师对话
export async function chat(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    throw new Error('Chat request failed')
  }

  return response.json()
}

// 群辨
export async function groupDebate(request: GroupDebateRequest): Promise<{ responses: ChatResponse[] }> {
  const response = await fetch(`${API_BASE}/group-debate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    throw new Error('Group debate request failed')
  }

  return response.json()
}

// 众师再辨
export async function reDebate(request: ReDebateRequest): Promise<{ responses: ChatResponse[] }> {
  const response = await fetch(`${API_BASE}/re-debate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    throw new Error('Re-debate request failed')
  }

  return response.json()
}

// 保存对话
export async function saveConversation(conversation: {
  id: string
  userId: string
  domain: string
  title: string
  summary: string
  nodes: unknown[]
  chaosBox: string[]
}): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(conversation)
  })

  if (!response.ok) {
    throw new Error('Save conversation failed')
  }

  return response.json()
}

// 获取对话列表
export async function getConversations(userId: string): Promise<{ conversations: unknown[] }> {
  const response = await fetch(`${API_BASE}/conversations?userId=${encodeURIComponent(userId)}`)

  if (!response.ok) {
    throw new Error('Get conversations failed')
  }

  return response.json()
}

// 健康检查
export async function healthCheck(): Promise<{ status: string; timestamp: number }> {
  const response = await fetch(`${API_BASE}/health`)

  if (!response.ok) {
    throw new Error('Health check failed')
  }

  return response.json()
}
