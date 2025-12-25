// 八字排盘工具 - 基于中华传统命理学

// 天干
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

// 地支
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// 五行
export const FIVE_ELEMENTS = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水'
}

// 天干五行对应
export const STEM_ELEMENTS: Record<string, string> = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water'
}

// 地支五行对应
export const BRANCH_ELEMENTS: Record<string, string> = {
  '子': 'water', '丑': 'earth',
  '寅': 'wood', '卯': 'wood',
  '辰': 'earth', '巳': 'fire',
  '午': 'fire', '未': 'earth',
  '申': 'metal', '酉': 'metal',
  '戌': 'earth', '亥': 'water'
}

// 地支藏干
export const BRANCH_HIDDEN_STEMS: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
}

// 十神
export const TEN_GODS = {
  '比肩': '与日主同性同五行',
  '劫财': '与日主异性同五行',
  '食神': '日主所生同性',
  '伤官': '日主所生异性',
  '偏财': '日主所克同性',
  '正财': '日主所克异性',
  '七杀': '克日主同性',
  '正官': '克日主异性',
  '偏印': '生日主同性',
  '正印': '生日主异性'
}

// 五行相生
export const ELEMENT_GENERATES: Record<string, string> = {
  wood: 'fire',   // 木生火
  fire: 'earth',  // 火生土
  earth: 'metal', // 土生金
  metal: 'water', // 金生水
  water: 'wood'   // 水生木
}

// 五行相克
export const ELEMENT_OVERCOMES: Record<string, string> = {
  wood: 'earth',  // 木克土
  earth: 'water', // 土克水
  water: 'fire',  // 水克火
  fire: 'metal',  // 火克金
  metal: 'wood'   // 金克木
}

// 时辰对应地支
export const HOUR_TO_BRANCH: Record<string, string> = {
  '23:00': '子', '01:00': '丑', '03:00': '寅', '05:00': '卯',
  '07:00': '辰', '09:00': '巳', '11:00': '午', '13:00': '未',
  '15:00': '申', '17:00': '酉', '19:00': '戌', '21:00': '亥'
}

// 计算年柱
export function getYearPillar(year: number): { stem: string; branch: string } {
  // 以1984年甲子年为基准
  const baseYear = 1984
  const diff = year - baseYear
  const stemIndex = ((diff % 10) + 10) % 10
  const branchIndex = ((diff % 12) + 12) % 12

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex]
  }
}

// 计算月柱（简化版，实际需要考虑节气）
export function getMonthPillar(year: number, month: number): { stem: string; branch: string } {
  // 月支固定：正月寅，二月卯...
  const monthBranches = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑']
  const branch = monthBranches[(month - 1) % 12]

  // 月干根据年干推算（五虎遁）
  const yearStem = getYearPillar(year).stem
  const yearStemIndex = HEAVENLY_STEMS.indexOf(yearStem)
  const monthStemStart = [2, 4, 6, 8, 0][Math.floor(yearStemIndex / 2)] // 甲己之年丙作首
  const stemIndex = (monthStemStart + month - 1) % 10

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch
  }
}

// 计算日柱（简化版，实际需要查万年历）
export function getDayPillar(year: number, month: number, day: number): { stem: string; branch: string } {
  // 使用简化算法，实际应用中应查询万年历
  const baseDate = new Date(1900, 0, 31) // 1900年1月31日是甲子日
  const targetDate = new Date(year, month - 1, day)
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))

  const stemIndex = ((diffDays % 10) + 10) % 10
  const branchIndex = ((diffDays % 12) + 12) % 12

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex]
  }
}

// 计算时柱
export function getHourPillar(dayStem: string, hour: string): { stem: string; branch: string } {
  const branch = HOUR_TO_BRANCH[hour] || '子'
  const branchIndex = EARTHLY_BRANCHES.indexOf(branch)

  // 时干根据日干推算（五鼠遁）
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem)
  const hourStemStart = [0, 2, 4, 6, 8][Math.floor(dayStemIndex / 2)] // 甲己还加甲
  const stemIndex = (hourStemStart + branchIndex) % 10

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch
  }
}

// 计算五行平衡
export function calculateFiveElements(pillars: { stem: string; branch: string }[]): Record<string, number> {
  const elements: Record<string, number> = {
    wood: 0, fire: 0, earth: 0, metal: 0, water: 0
  }

  pillars.forEach(pillar => {
    // 天干五行
    const stemElement = STEM_ELEMENTS[pillar.stem]
    if (stemElement) elements[stemElement]++

    // 地支五行
    const branchElement = BRANCH_ELEMENTS[pillar.branch]
    if (branchElement) elements[branchElement]++

    // 藏干五行
    const hiddenStems = BRANCH_HIDDEN_STEMS[pillar.branch] || []
    hiddenStems.forEach(stem => {
      const hiddenElement = STEM_ELEMENTS[stem]
      if (hiddenElement) elements[hiddenElement] += 0.5
    })
  })

  return elements
}

// 完整排盘
export function calculateBazi(birthDate: string, birthTime: string) {
  const [year, month, day] = birthDate.split('-').map(Number)

  const yearPillar = getYearPillar(year)
  const monthPillar = getMonthPillar(year, month)
  const dayPillar = getDayPillar(year, month, day)
  const hourPillar = getHourPillar(dayPillar.stem, birthTime)

  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar]
  const fiveElements = calculateFiveElements(pillars)

  return {
    yearPillar: {
      heavenlyStem: yearPillar.stem,
      earthlyBranch: yearPillar.branch,
      hiddenStems: BRANCH_HIDDEN_STEMS[yearPillar.branch] || []
    },
    monthPillar: {
      heavenlyStem: monthPillar.stem,
      earthlyBranch: monthPillar.branch,
      hiddenStems: BRANCH_HIDDEN_STEMS[monthPillar.branch] || []
    },
    dayPillar: {
      heavenlyStem: dayPillar.stem,
      earthlyBranch: dayPillar.branch,
      hiddenStems: BRANCH_HIDDEN_STEMS[dayPillar.branch] || []
    },
    hourPillar: {
      heavenlyStem: hourPillar.stem,
      earthlyBranch: hourPillar.branch,
      hiddenStems: BRANCH_HIDDEN_STEMS[hourPillar.branch] || []
    },
    dayMaster: dayPillar.stem,
    fiveElements: {
      wood: fiveElements.wood,
      fire: fiveElements.fire,
      earth: fiveElements.earth,
      metal: fiveElements.metal,
      water: fiveElements.water
    }
  }
}

// 格式化八字显示
export function formatBazi(bazi: ReturnType<typeof calculateBazi>): string {
  return `${bazi.yearPillar.heavenlyStem}${bazi.yearPillar.earthlyBranch} ${bazi.monthPillar.heavenlyStem}${bazi.monthPillar.earthlyBranch} ${bazi.dayPillar.heavenlyStem}${bazi.dayPillar.earthlyBranch} ${bazi.hourPillar.heavenlyStem}${bazi.hourPillar.earthlyBranch}`
}

// 获取日主五行
export function getDayMasterElement(dayMaster: string): string {
  return FIVE_ELEMENTS[STEM_ELEMENTS[dayMaster] as keyof typeof FIVE_ELEMENTS] || ''
}

// 判断日主强弱（简化版）
export function analyzeDayMasterStrength(bazi: ReturnType<typeof calculateBazi>): 'strong' | 'weak' | 'neutral' {
  const dayMasterElement = STEM_ELEMENTS[bazi.dayMaster]
  const elements = bazi.fiveElements

  // 计算日主得分（本气 + 生我）
  const selfScore = elements[dayMasterElement as keyof typeof elements] || 0
  const generateMe = Object.entries(ELEMENT_GENERATES).find(([, v]) => v === dayMasterElement)?.[0]
  const generateScore = generateMe ? (elements[generateMe as keyof typeof elements] || 0) : 0

  // 计算克泄耗得分
  const iOvercome = ELEMENT_OVERCOMES[dayMasterElement]
  const overcomeMe = Object.entries(ELEMENT_OVERCOMES).find(([, v]) => v === dayMasterElement)?.[0]
  const iGenerate = ELEMENT_GENERATES[dayMasterElement]

  const weakenScore =
    (elements[iOvercome as keyof typeof elements] || 0) +
    (elements[overcomeMe as keyof typeof elements] || 0) +
    (elements[iGenerate as keyof typeof elements] || 0)

  const totalSelf = selfScore + generateScore
  const ratio = totalSelf / (totalSelf + weakenScore)

  if (ratio > 0.55) return 'strong'
  if (ratio < 0.45) return 'weak'
  return 'neutral'
}
