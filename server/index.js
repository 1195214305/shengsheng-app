import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import OpenAI from 'openai'
import { createClient } from '@libsql/client'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())

// 阿里云通义千问 API 客户端
// 使用 OpenAI 兼容接口
const qwen = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY || '',
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
})

// 获取当前使用的模型
const QWEN_MODEL = process.env.QWEN_MODEL || 'qwen-plus'

console.log(`Using Qwen model: ${QWEN_MODEL}`)

// Turso 数据库客户端
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN
})

// 初始化数据库
async function initDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      domain TEXT,
      title TEXT,
      summary TEXT,
      created_at INTEGER,
      updated_at INTEGER
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT,
      node_id TEXT,
      master_id TEXT,
      content TEXT,
      is_user INTEGER,
      created_at INTEGER,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS chaos_items (
      id TEXT PRIMARY KEY,
      conversation_id TEXT,
      content TEXT,
      created_at INTEGER,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    )
  `)

  console.log('Database initialized')
}

// 宗师系统提示词
const MASTER_PROMPTS = {
  fang: `你是方长老，格局派宗师。你稳重、有大局观、循循善诱。
你善于从整体格局分析命盘，注重五行平衡与十神配置。
说话稳重有条理，擅长给出宏观建议。
分析时会先看格局（正官格、食神格等），再看五行流通，最后给出建议。`,

  zhang: `你是瞎眼张，盲派宗师。你犀利、毒舌、直言不讳。
你是盲派传人，铁口直断，说话犀利且毒舌。
不绕弯子，直指要害。虽然言辞尖锐，但往往一针见血。
使用盲派特有的口诀和断语，但要在尖锐之后给出建设性意见。`,

  li: `你是李博士，现代心理学家。你理性、温和、善于转化。
你擅长将古代命理语境转述为现代生活中的心理学策略。
去糟粕取精华，给出建设性建议。
从性格分析、行为模式角度解读，给出具体可操作的心理学建议。`,

  chen: `你是陈道长，道家修行者。你超然、玄妙、重视修行。
你注重天人合一，强调顺应自然规律。
常从道家哲学角度解读命运，重视内在修行。
会引用道德经、庄子等经典，给出超然物外的视角。`,

  wang: `你是王奶奶，民间智者。你慈祥、接地气、充满生活智慧。
你有几十年看相算命经验，说话接地气。
善于用生活中的例子解释道理，充满人情味。
像长辈一样关心用户，给出接地气的实用建议。`
}

// 通用规则
const COMMON_RULES = `
重要规则：
1. 始终保持你的角色特点和说话风格
2. 基于用户的八字信息进行分析，但要结合现代语境
3. 不要给出过于绝对的断语，要留有余地
4. 强调"象"与"相"的区别：象是规律，相是变数
5. 鼓励用户发挥主观能动性，而不是宿命论
6. 回答要有深度，但也要通俗易懂
7. 适当引用古籍或经典，但要解释其含义
8. 回复控制在200-400字之间
`

// API 路由

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), model: QWEN_MODEL })
})

// 聊天接口
app.post('/api/chat', async (req, res) => {
  try {
    const { masterId, message, userInfo, conversationHistory } = req.body

    if (!masterId || !message) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const masterPrompt = MASTER_PROMPTS[masterId] || MASTER_PROMPTS.fang

    // 构建用户信息上下文
    let userContext = ''
    if (userInfo) {
      userContext = `
用户信息：
- 姓名：${userInfo.name}
- 性别：${userInfo.gender === 'male' ? '男（乾造）' : '女（坤造）'}
- 出生日期：${userInfo.birthDate}
- 出生时辰：${userInfo.birthTime}
- 出生地点：${userInfo.birthPlace}
${userInfo.bazi ? `- 八字：${userInfo.bazi}` : ''}
`
    }

    // 构建消息历史
    const messages = [
      {
        role: 'system',
        content: masterPrompt + userContext + COMMON_RULES
      }
    ]

    // 添加对话历史
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.slice(-10).forEach(msg => {
        messages.push({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        })
      })
    }

    // 添加当前消息
    messages.push({
      role: 'user',
      content: message
    })

    // 调用通义千问 API
    const completion = await qwen.chat.completions.create({
      model: QWEN_MODEL,
      messages,
      temperature: 0.8,
      max_tokens: 1000
    })

    const reply = completion.choices[0]?.message?.content || ''

    res.json({
      masterId,
      content: reply,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 群辨接口
app.post('/api/group-debate', async (req, res) => {
  try {
    const { masterIds, topic, userInfo, previousResponses } = req.body

    if (!masterIds || !Array.isArray(masterIds) || !topic) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const responses = []

    for (const masterId of masterIds) {
      const masterPrompt = MASTER_PROMPTS[masterId] || MASTER_PROMPTS.fang

      // 构建群辨上下文
      let debateContext = `
现在进行群辨环节。讨论的话题是：${topic}

之前的发言：
${previousResponses?.map(r => `${r.masterName}说：${r.content}`).join('\n\n') || '（暂无）'}

请根据你的派系特点和性格，对这个话题发表你的看法。你可以：
1. 补充其他宗师没有提到的角度
2. 对其他宗师的观点表示认同或提出不同意见
3. 从你的专业角度给出独特见解

注意：保持你的角色特点，但要尊重其他宗师的观点。
`

      const messages = [
        {
          role: 'system',
          content: masterPrompt + COMMON_RULES
        },
        {
          role: 'user',
          content: debateContext
        }
      ]

      const completion = await qwen.chat.completions.create({
        model: QWEN_MODEL,
        messages,
        temperature: 0.9,
        max_tokens: 800
      })

      const reply = completion.choices[0]?.message?.content || ''

      responses.push({
        masterId,
        content: reply,
        timestamp: Date.now()
      })

      // 更新 previousResponses 供下一个宗师参考
      previousResponses?.push({
        masterId,
        masterName: getMasterName(masterId),
        content: reply
      })
    }

    res.json({ responses })
  } catch (error) {
    console.error('Group debate error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 众师再辨接口
app.post('/api/re-debate', async (req, res) => {
  try {
    const { masterIds, selectedText, originalMasterId, userInfo } = req.body

    if (!masterIds || !Array.isArray(masterIds) || !selectedText) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const originalMasterName = getMasterName(originalMasterId)

    const reDebatePrompt = `
用户对以下内容有疑问，请重新解读：

"${selectedText}"

这是${originalMasterName}之前的断语。用户可能：
1. 不理解这句话的含义
2. 不认同这个观点
3. 觉得这与自己的经历不符

请从你的角度：
1. 解释这句话的深层含义
2. 说明在什么情况下这个断语成立
3. 指出可能的变数和例外
4. 给出如何应对或转化的建议

记住：很多断语没有好坏之分，只是特质的不同。帮助用户理解"象"与"相"的区别。
`

    const responses = []

    for (const masterId of masterIds) {
      const masterPrompt = MASTER_PROMPTS[masterId] || MASTER_PROMPTS.fang

      const messages = [
        {
          role: 'system',
          content: masterPrompt + COMMON_RULES
        },
        {
          role: 'user',
          content: reDebatePrompt
        }
      ]

      const completion = await qwen.chat.completions.create({
        model: QWEN_MODEL,
        messages,
        temperature: 0.8,
        max_tokens: 600
      })

      const reply = completion.choices[0]?.message?.content || ''

      responses.push({
        masterId,
        content: reply,
        timestamp: Date.now()
      })
    }

    res.json({ responses })
  } catch (error) {
    console.error('Re-debate error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 保存对话
app.post('/api/conversations', async (req, res) => {
  try {
    const { id, userId, domain, title, summary, nodes, chaosBox } = req.body

    await db.execute({
      sql: `INSERT OR REPLACE INTO conversations (id, user_id, domain, title, summary, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [id, userId, domain, title, summary, Date.now(), Date.now()]
    })

    // 保存消息
    if (nodes && Array.isArray(nodes)) {
      for (const node of nodes) {
        for (const msg of node.messages || []) {
          await db.execute({
            sql: `INSERT OR REPLACE INTO messages (id, conversation_id, node_id, master_id, content, is_user, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
            args: [msg.id, id, node.id, msg.masterId, msg.content, msg.isUser ? 1 : 0, msg.timestamp]
          })
        }
      }
    }

    // 保存混沌回收箱
    if (chaosBox && Array.isArray(chaosBox)) {
      for (const item of chaosBox) {
        await db.execute({
          sql: `INSERT INTO chaos_items (id, conversation_id, content, created_at)
                VALUES (?, ?, ?, ?)`,
          args: [Date.now().toString() + Math.random(), id, item, Date.now()]
        })
      }
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Save conversation error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 获取对话列表
app.get('/api/conversations', async (req, res) => {
  try {
    const { userId } = req.query

    const result = await db.execute({
      sql: 'SELECT * FROM conversations WHERE user_id = ? ORDER BY updated_at DESC',
      args: [userId]
    })

    res.json({ conversations: result.rows })
  } catch (error) {
    console.error('Get conversations error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// 辅助函数
function getMasterName(masterId) {
  const names = {
    fang: '方长老',
    zhang: '瞎眼张',
    li: '李博士',
    chen: '陈道长',
    wang: '王奶奶'
  }
  return names[masterId] || '宗师'
}

// 启动服务器
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}).catch(err => {
  console.error('Failed to initialize database:', err)
  process.exit(1)
})
