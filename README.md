# 生生 - 命运可能性模拟器

一个基于中华传统命理学的AI对话系统，通过多位"宗师"角色提供多元视角的命运解读。

## 核心理念

- **一象生多相**：同一个命盘特质，在不同情境下会呈现不同的面貌
- **定数与变数交织**：命运既有规律可循，也有变化的空间
- **知象、转心、修相、立命**：了解规律，调整心态，改变表现，掌握命运

## 功能特点

### 多宗师圆桌会
- **方长老**（格局派）：稳重大局观，从整体格局分析
- **瞎眼张**（盲派）：犀利毒舌，铁口直断
- **李博士**（心理学派）：理性温和，现代视角
- **陈道长**（道家）：超然玄妙，重视修行
- **王奶奶**（民间派）：慈祥接地气，生活智慧

### 命运推演术
非线性的对话树结构，可以在任意节点分叉探索不同可能性

### 小剪刀功能
选中任意文字，可以：
- 引发众师再辨：让所有宗师重新解读
- 放入混沌回收箱：存放困惑，日后回顾

### 花园档案系统
- 保存对话档案
- 删除档案化作阳光（粒子特效）
- 阳光值系统

## 技术栈

### 前端
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion（动画）
- Zustand（状态管理）
- React Router

### 后端
- Node.js + Express
- OpenAI API（GPT-4o-mini）
- Turso（SQLite 云数据库）

## 快速开始

### 安装依赖

```bash
cd shengsheng-app
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

需要配置：
- `OPENAI_API_KEY`：OpenAI API 密钥
- `TURSO_DATABASE_URL`：Turso 数据库 URL
- `TURSO_AUTH_TOKEN`：Turso 认证令牌

### 启动开发服务器

```bash
# 启动前端
npm run dev

# 启动后端（新终端）
npm run server
```

访问 http://localhost:3000

## 项目结构

```
shengsheng-app/
├── src/
│   ├── components/       # 组件
│   │   ├── ParticleBackground.tsx  # 粒子背景
│   │   ├── FateTree.tsx           # 命运推演树
│   │   ├── ChaosBox.tsx           # 混沌回收箱
│   │   └── SunlightEffect.tsx     # 阳光粒子特效
│   ├── pages/            # 页面
│   │   ├── HomePage.tsx           # 首页
│   │   ├── InfoInputPage.tsx      # 信息录入
│   │   ├── DomainSelectPage.tsx   # 领域选择
│   │   ├── ChatRoomPage.tsx       # 聊天室
│   │   └── GardenPage.tsx         # 花园档案
│   ├── store/            # 状态管理
│   ├── utils/            # 工具函数
│   │   ├── bazi.ts               # 八字排盘
│   │   ├── masters.ts            # 宗师配置
│   │   └── api.ts                # API 调用
│   └── types/            # 类型定义
├── server/               # 后端服务
│   └── index.js
└── public/               # 静态资源
```

## 设计原则

### 避免"AI味"
- 使用墨色、金色、玉色等中国传统配色
- 避免蓝紫渐变等典型AI设计
- 使用衬线字体营造古典氛围
- 动画效果克制优雅

### 用户体验
- 分步骤信息录入，降低认知负担
- 多种探索方式（骰子随机、直接提问、领域选择）
- 非线性对话，支持回溯和分叉
- 小剪刀功能让用户主动参与

## 许可证

MIT
