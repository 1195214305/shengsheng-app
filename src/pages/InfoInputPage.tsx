import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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

  const stepTitles = ['姓名', '性别', '出生日期', '出生时辰', '出生地点']

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-neutral-200 text-xl mb-2">请告诉我你的名字</h2>
              <p className="text-neutral-500 text-sm">名字承载着父母的期望与祝福</p>
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="输入你的名字"
              className="w-full bg-transparent border-b border-neutral-700 focus:border-amber-500/50 outline-none py-3 text-center text-lg text-neutral-200 placeholder-neutral-600 transition-colors"
              autoFocus
            />
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            key="gender"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-neutral-200 text-xl mb-2">你的性别是</h2>
              <p className="text-neutral-500 text-sm">阴阳之道，乾坤有别</p>
            </div>
            <div className="flex gap-6 justify-center">
              <button
                onClick={() => setFormData({ ...formData, gender: 'male' })}
                className={`w-28 h-28 rounded-lg border transition-all duration-300 flex flex-col items-center justify-center ${
                  formData.gender === 'male'
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                    : 'border-neutral-700 hover:border-neutral-600 text-neutral-400'
                }`}
              >
                <span className="text-3xl mb-1" style={{ fontFamily: 'STKaiti, KaiTi, serif' }}>乾</span>
                <span className="text-sm">男</span>
              </button>
              <button
                onClick={() => setFormData({ ...formData, gender: 'female' })}
                className={`w-28 h-28 rounded-lg border transition-all duration-300 flex flex-col items-center justify-center ${
                  formData.gender === 'female'
                    ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                    : 'border-neutral-700 hover:border-neutral-600 text-neutral-400'
                }`}
              >
                <span className="text-3xl mb-1" style={{ fontFamily: 'STKaiti, KaiTi, serif' }}>坤</span>
                <span className="text-sm">女</span>
              </button>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="birthdate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-neutral-200 text-xl mb-2">你的出生日期</h2>
              <p className="text-neutral-500 text-sm">年月日定四柱之三</p>
            </div>
            <div className="flex gap-4 justify-center">
              <select
                value={formData.birthYear}
                onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                className="bg-neutral-900 border border-neutral-700 rounded px-4 py-3 text-neutral-200 focus:border-amber-500/50 outline-none transition-colors"
              >
                <option value="">年</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select
                value={formData.birthMonth}
                onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                className="bg-neutral-900 border border-neutral-700 rounded px-4 py-3 text-neutral-200 focus:border-amber-500/50 outline-none transition-colors"
              >
                <option value="">月</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select
                value={formData.birthDay}
                onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                className="bg-neutral-900 border border-neutral-700 rounded px-4 py-3 text-neutral-200 focus:border-amber-500/50 outline-none transition-colors"
              >
                <option value="">日</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="birthtime"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-neutral-200 text-xl mb-2">你的出生时辰</h2>
              <p className="text-neutral-500 text-sm">时辰定时柱，一日十二时</p>
            </div>
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
              {SHICHEN.map((shi) => (
                <button
                  key={shi.value}
                  onClick={() => setFormData({ ...formData, birthTime: shi.value })}
                  className={`py-3 px-2 rounded border transition-all duration-300 text-center ${
                    formData.birthTime === shi.value
                      ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                      : 'border-neutral-700 hover:border-neutral-600 text-neutral-400'
                  }`}
                >
                  <div className="text-base" style={{ fontFamily: 'STKaiti, KaiTi, serif' }}>{shi.label}</div>
                  <div className="text-xs text-neutral-500 mt-1">{shi.time}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            key="birthplace"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-neutral-200 text-xl mb-2">你的出生地点</h2>
              <p className="text-neutral-500 text-sm">地理方位影响真太阳时</p>
            </div>
            <div className="relative max-w-xs mx-auto">
              <input
                type="text"
                value={citySearch || formData.birthPlace}
                onChange={(e) => {
                  setCitySearch(e.target.value)
                  setShowCityDropdown(true)
                }}
                onFocus={() => setShowCityDropdown(true)}
                placeholder="搜索或选择城市"
                className="w-full bg-transparent border-b border-neutral-700 focus:border-amber-500/50 outline-none py-3 text-center text-lg text-neutral-200 placeholder-neutral-600 transition-colors"
              />
              {showCityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-neutral-900 border border-neutral-700 rounded z-10">
                  {filteredCities.map(city => (
                    <button
                      key={city}
                      onClick={() => {
                        setFormData({ ...formData, birthPlace: city })
                        setCitySearch('')
                        setShowCityDropdown(false)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-neutral-800 text-neutral-300 transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {formData.birthPlace && !showCityDropdown && (
              <div className="text-center text-amber-400 text-sm">
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
        className="absolute top-8 left-8 text-neutral-500 hover:text-amber-400 transition-colors"
        onClick={() => step > 0 ? setStep(step - 1) : navigate('/')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* 步骤指示器 */}
      <motion.div
        className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {stepTitles.map((title, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`text-xs transition-colors ${
                i === step ? 'text-amber-400' : i < step ? 'text-neutral-500' : 'text-neutral-700'
              }`}
            >
              {title}
            </div>
            {i < stepTitles.length - 1 && (
              <div className={`w-8 h-px mx-2 ${i < step ? 'bg-neutral-600' : 'bg-neutral-800'}`} />
            )}
          </div>
        ))}
      </motion.div>

      {/* 表单内容 */}
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* 下一步按钮 */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            className={`px-12 py-3 border transition-all duration-300 text-sm tracking-widest ${
              canProceed()
                ? 'border-neutral-600 text-neutral-300 hover:border-amber-500/50 hover:text-amber-400'
                : 'border-neutral-800 text-neutral-600 cursor-not-allowed'
            }`}
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {step < 4 ? '继续' : '开始探索'}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
