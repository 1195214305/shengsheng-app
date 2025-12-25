import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'

// 中国主要城市列表
const CITIES = [
  '北京', '上海', '广州', '深圳', '杭州', '南京', '苏州', '成都', '重庆', '武汉',
  '西安', '天津', '长沙', '郑州', '青岛', '大连', '宁波', '厦门', '福州', '济南',
  '合肥', '昆明', '贵阳', '南宁', '海口', '三亚', '哈尔滨', '长春', '沈阳', '石家庄',
  '太原', '呼和浩特', '乌鲁木齐', '兰州', '银川', '西宁', '拉萨', '香港', '澳门', '台北'
]

// 时辰对照
const SHICHEN = [
  { label: '子时', time: '23:00-01:00', value: '23:00' },
  { label: '丑时', time: '01:00-03:00', value: '01:00' },
  { label: '寅时', time: '03:00-05:00', value: '03:00' },
  { label: '卯时', time: '05:00-07:00', value: '05:00' },
  { label: '辰时', time: '07:00-09:00', value: '07:00' },
  { label: '巳时', time: '09:00-11:00', value: '09:00' },
  { label: '午时', time: '11:00-13:00', value: '11:00' },
  { label: '未时', time: '13:00-15:00', value: '13:00' },
  { label: '申时', time: '15:00-17:00', value: '15:00' },
  { label: '酉时', time: '17:00-19:00', value: '17:00' },
  { label: '戌时', time: '19:00-21:00', value: '19:00' },
  { label: '亥时', time: '21:00-23:00', value: '21:00' },
]

export default function InfoInputPage() {
  const navigate = useNavigate()
  const { setUserInfo } = useAppStore()

  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    gender: '' as 'male' | 'female' | '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthTime: '',
    birthPlace: '',
  })

  const [showCityDropdown, setShowCityDropdown] = useState(false)
  const [citySearch, setCitySearch] = useState('')

  const filteredCities = CITIES.filter(city =>
    city.includes(citySearch)
  )

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // 提交信息
      if (formData.name && formData.gender && formData.birthYear && formData.birthMonth && formData.birthDay && formData.birthTime && formData.birthPlace) {
        setUserInfo({
          name: formData.name,
          gender: formData.gender as 'male' | 'female',
          birthDate: `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
        })
        navigate('/domain')
      }
    }
  }

  const canProceed = () => {
    switch (step) {
      case 0: return formData.name.length > 0
      case 1: return formData.gender !== ''
      case 2: return formData.birthYear && formData.birthMonth && formData.birthDay
      case 3: return formData.birthTime !== ''
      case 4: return formData.birthPlace !== ''
      default: return false
    }
  }

  // 生成年份选项 (1940-2024)
  const years = Array.from({ length: 85 }, (_, i) => 2024 - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="font-serif text-2xl text-gold-400">请告诉我你的名字</h2>
            <p className="text-ink-400 text-sm">名字承载着父母的期望与祝福</p>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="输入你的名字"
              className="input-ink w-full text-lg rounded-sm"
              autoFocus
            />
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            key="gender"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="font-serif text-2xl text-gold-400">你的性别是</h2>
            <p className="text-ink-400 text-sm">阴阳之道，乾坤有别</p>
            <div className="flex gap-4">
              <button
                onClick={() => setFormData({ ...formData, gender: 'male' })}
                className={`flex-1 py-6 rounded-sm border transition-all ${
                  formData.gender === 'male'
                    ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                    : 'border-ink-700 hover:border-ink-500 text-ink-300'
                }`}
              >
                <div className="font-serif text-3xl mb-2">乾</div>
                <div className="text-sm">男</div>
              </button>
              <button
                onClick={() => setFormData({ ...formData, gender: 'female' })}
                className={`flex-1 py-6 rounded-sm border transition-all ${
                  formData.gender === 'female'
                    ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                    : 'border-ink-700 hover:border-ink-500 text-ink-300'
                }`}
              >
                <div className="font-serif text-3xl mb-2">坤</div>
                <div className="text-sm">女</div>
              </button>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="birthdate"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="font-serif text-2xl text-gold-400">你的出生日期</h2>
            <p className="text-ink-400 text-sm">年月日定四柱之三</p>
            <div className="grid grid-cols-3 gap-3">
              <select
                value={formData.birthYear}
                onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                className="input-ink rounded-sm"
              >
                <option value="">年</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}年</option>
                ))}
              </select>
              <select
                value={formData.birthMonth}
                onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                className="input-ink rounded-sm"
              >
                <option value="">月</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}月</option>
                ))}
              </select>
              <select
                value={formData.birthDay}
                onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                className="input-ink rounded-sm"
              >
                <option value="">日</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}日</option>
                ))}
              </select>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="birthtime"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="font-serif text-2xl text-gold-400">你的出生时辰</h2>
            <p className="text-ink-400 text-sm">时辰定时柱，一日十二时</p>
            <div className="grid grid-cols-3 gap-2">
              {SHICHEN.map((shi) => (
                <button
                  key={shi.value}
                  onClick={() => setFormData({ ...formData, birthTime: shi.value })}
                  className={`py-3 px-2 rounded-sm border transition-all text-center ${
                    formData.birthTime === shi.value
                      ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                      : 'border-ink-700 hover:border-ink-500 text-ink-300'
                  }`}
                >
                  <div className="font-serif text-lg">{shi.label}</div>
                  <div className="text-xs text-ink-500">{shi.time}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            key="birthplace"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="font-serif text-2xl text-gold-400">你的出生地点</h2>
            <p className="text-ink-400 text-sm">地理方位影响真太阳时</p>
            <div className="relative">
              <input
                type="text"
                value={citySearch || formData.birthPlace}
                onChange={(e) => {
                  setCitySearch(e.target.value)
                  setShowCityDropdown(true)
                }}
                onFocus={() => setShowCityDropdown(true)}
                placeholder="搜索或选择城市"
                className="input-ink w-full rounded-sm"
              />
              {showCityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-ink-900 border border-ink-700 rounded-sm z-10">
                  {filteredCities.map(city => (
                    <button
                      key={city}
                      onClick={() => {
                        setFormData({ ...formData, birthPlace: city })
                        setCitySearch('')
                        setShowCityDropdown(false)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-ink-800 text-ink-200 transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {formData.birthPlace && (
              <div className="text-gold-400 text-sm">
                已选择：{formData.birthPlace}
              </div>
            )}
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4">
      {/* 返回按钮 */}
      <motion.button
        className="absolute top-6 left-6 text-ink-400 hover:text-gold-400 transition-colors"
        onClick={() => step > 0 ? setStep(step - 1) : navigate('/')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* 步骤指示器 */}
      <motion.div
        className="absolute top-6 right-6 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === step ? 'bg-gold-500 w-6' : i < step ? 'bg-gold-500/50' : 'bg-ink-700'
            }`}
          />
        ))}
      </motion.div>

      {/* 表单内容 */}
      <div className="w-full max-w-md">
        {renderStep()}

        {/* 下一步按钮 */}
        <motion.button
          className={`btn-gold w-full mt-8 py-4 rounded-sm font-serif tracking-wider ${
            !canProceed() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleNext}
          disabled={!canProceed()}
          whileHover={canProceed() ? { scale: 1.02 } : {}}
          whileTap={canProceed() ? { scale: 0.98 } : {}}
        >
          {step < 4 ? '继续' : '开始探索'}
        </motion.button>
      </div>
    </div>
  )
}
