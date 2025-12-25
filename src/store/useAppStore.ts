import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserInfo, ConversationArchive, FateNode, ChatMessage } from '../types'

interface AppStore {
  // 用户信息
  userInfo: UserInfo | null
  setUserInfo: (info: UserInfo) => void

  // 当前领域
  currentDomain: string | null
  setCurrentDomain: (domain: string | null) => void

  // 当前对话
  currentConversation: ConversationArchive | null
  setCurrentConversation: (conv: ConversationArchive | null) => void
  addMessage: (nodeId: string, message: ChatMessage) => void
  addFateNode: (node: FateNode) => void

  // 档案
  archives: ConversationArchive[]
  saveToArchive: () => void
  deleteArchive: (id: string) => number // 返回阳光值

  // 阳光值
  totalSunlight: number
  addSunlight: (value: number) => void

  // 混沌回收箱
  addToChaosBox: (text: string) => void

  // 小剪刀模式
  scissorsMode: boolean
  toggleScissorsMode: () => void

  // 重置
  reset: () => void
}

const initialState = {
  userInfo: null,
  currentDomain: null,
  currentConversation: null,
  archives: [],
  totalSunlight: 100, // 初始阳光值
  scissorsMode: false,
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUserInfo: (info) => set({ userInfo: info }),

      setCurrentDomain: (domain) => set({ currentDomain: domain }),

      setCurrentConversation: (conv) => set({ currentConversation: conv }),

      addMessage: (nodeId, message) => {
        const { currentConversation } = get()
        if (!currentConversation) return

        const updatedNodes = currentConversation.nodes.map(node => {
          if (node.id === nodeId) {
            return { ...node, messages: [...node.messages, message] }
          }
          return node
        })

        set({
          currentConversation: {
            ...currentConversation,
            nodes: updatedNodes
          }
        })
      },

      addFateNode: (node) => {
        const { currentConversation } = get()
        if (!currentConversation) return

        // 更新父节点的children
        const updatedNodes = currentConversation.nodes.map(n => {
          if (n.id === node.parentId) {
            return { ...n, children: [...n.children, node.id] }
          }
          return n
        })

        set({
          currentConversation: {
            ...currentConversation,
            nodes: [...updatedNodes, node]
          }
        })
      },

      saveToArchive: () => {
        const { currentConversation, archives } = get()
        if (!currentConversation) return

        const existingIndex = archives.findIndex(a => a.id === currentConversation.id)
        if (existingIndex >= 0) {
          const updatedArchives = [...archives]
          updatedArchives[existingIndex] = currentConversation
          set({ archives: updatedArchives })
        } else {
          set({ archives: [...archives, currentConversation] })
        }
      },

      deleteArchive: (id) => {
        const { archives } = get()
        const archive = archives.find(a => a.id === id)
        if (!archive) return 0

        // 计算阳光值：基于对话深度和内容量
        const sunlightValue = Math.floor(
          archive.nodes.length * 5 +
          archive.nodes.reduce((sum, n) => sum + n.messages.length, 0) * 2 +
          archive.chaosBox.length * 3
        )

        set({
          archives: archives.filter(a => a.id !== id),
          totalSunlight: get().totalSunlight + sunlightValue
        })

        return sunlightValue
      },

      addSunlight: (value) => {
        set({ totalSunlight: get().totalSunlight + value })
      },

      addToChaosBox: (text) => {
        const { currentConversation } = get()
        if (!currentConversation) return

        set({
          currentConversation: {
            ...currentConversation,
            chaosBox: [...currentConversation.chaosBox, text]
          }
        })
      },

      toggleScissorsMode: () => {
        set({ scissorsMode: !get().scissorsMode })
      },

      reset: () => set(initialState),
    }),
    {
      name: 'shengsheng-storage',
      partialize: (state) => ({
        userInfo: state.userInfo,
        archives: state.archives,
        totalSunlight: state.totalSunlight,
      }),
    }
  )
)
