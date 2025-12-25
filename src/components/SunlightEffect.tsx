import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

interface SunlightEffectProps {
  value: number
  position: { x: number; y: number }
  onComplete: () => void
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  color: string
}

export default function SunlightEffect({ value, position, onComplete }: SunlightEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  const createParticles = useCallback(() => {
    const particles: Particle[] = []
    const particleCount = Math.min(value * 3, 100) // 根据阳光值决定粒子数量

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5
      const speed = 2 + Math.random() * 4
      const colors = [
        'rgba(232, 208, 164, 1)',    // 金色
        'rgba(212, 163, 92, 1)',     // 深金
        'rgba(249, 243, 230, 1)',    // 浅金
        'rgba(255, 255, 255, 0.8)',  // 白色
      ]

      particles.push({
        x: position.x,
        y: position.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // 向上偏移
        size: 2 + Math.random() * 4,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    return particles
  }, [position, value])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let activeParticles = 0

    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.vy += 0.05 // 重力
      particle.vx *= 0.99 // 阻力
      particle.life++

      // 计算透明度
      const progress = particle.life / particle.maxLife
      const alpha = progress < 0.2
        ? progress / 0.2
        : progress > 0.7
          ? (1 - progress) / 0.3
          : 1

      if (alpha > 0) {
        activeParticles++

        // 绘制粒子
        ctx.save()
        ctx.globalAlpha = alpha

        // 光晕效果
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        )
        gradient.addColorStop(0, particle.color)
        gradient.addColorStop(0.5, particle.color.replace('1)', '0.5)'))
        gradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // 核心亮点
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.fill()

        ctx.restore()
      }

      return particle.life < particle.maxLife
    })

    if (activeParticles > 0) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      onComplete()
    }
  }, [onComplete])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    particlesRef.current = createParticles()
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, createParticles])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 pointer-events-none z-50"
    >
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* 阳光值提示 */}
      <motion.div
        className="absolute text-gold-400 font-serif text-2xl"
        style={{ left: position.x, top: position.y - 50 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        +{value}
      </motion.div>
    </motion.div>
  )
}
