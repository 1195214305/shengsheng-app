import { motion } from 'framer-motion'
import type { FateNode } from '../types'

interface FateTreeProps {
  nodes: FateNode[]
  currentNodeId: string
  onNodeClick: (nodeId: string) => void
}

export default function FateTree({ nodes, currentNodeId, onNodeClick }: FateTreeProps) {
  if (nodes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-ink-700 flex items-center justify-center">
          <svg className="w-8 h-8 text-ink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v8M8 12h8"/>
          </svg>
        </div>
        <p className="text-ink-500 text-sm">开始对话后</p>
        <p className="text-ink-500 text-sm">推演树将在此生长</p>
      </div>
    )
  }

  // 构建树形结构
  const buildTree = (nodeId: string, depth: number = 0): JSX.Element | null => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return null

    const isActive = nodeId === currentNodeId
    const hasChildren = node.children.length > 0

    return (
      <div key={nodeId} className="relative">
        {/* 节点 */}
        <motion.button
          onClick={() => onNodeClick(nodeId)}
          className={`fate-node w-full p-3 rounded-sm text-left mb-2 ${isActive ? 'active' : ''}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: depth * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start gap-2">
            {/* 节点图标 */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              isActive ? 'bg-gold-500/30' : 'bg-ink-700'
            }`}>
              {nodeId === 'root' ? (
                <svg className="w-4 h-4 text-gold-400" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="4"/>
                </svg>
              ) : (
                <span className="text-xs text-ink-400">{depth}</span>
              )}
            </div>

            {/* 节点内容 */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${isActive ? 'text-gold-400' : 'text-ink-300'}`}>
                {node.question || '开始'}
              </p>
              {node.summary && (
                <p className="text-xs text-ink-500 truncate mt-1">
                  {node.summary}
                </p>
              )}
              <p className="text-xs text-ink-600 mt-1">
                {node.messages.length} 条消息
              </p>
            </div>
          </div>
        </motion.button>

        {/* 子节点 */}
        {hasChildren && (
          <div className="pl-6 border-l border-ink-700 ml-3">
            {node.children.map(childId => buildTree(childId, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  // 找到根节点
  const rootNode = nodes.find(n => n.parentId === null)

  return (
    <div className="space-y-2">
      {/* 图例 */}
      <div className="flex items-center gap-4 mb-4 text-xs text-ink-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gold-500/30" />
          <span>当前节点</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-ink-700" />
          <span>历史节点</span>
        </div>
      </div>

      {/* 树形结构 */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
        {rootNode && buildTree(rootNode.id)}
      </div>

      {/* 操作提示 */}
      <div className="pt-4 border-t border-ink-800">
        <p className="text-ink-500 text-xs mb-2">提示：</p>
        <ul className="text-ink-600 text-xs space-y-1">
          <li>• 点击节点可查看该分支的对话</li>
          <li>• 每次提问都会创建新的分支</li>
          <li>• 可以回到任意节点继续探索</li>
        </ul>
      </div>
    </div>
  )
}
