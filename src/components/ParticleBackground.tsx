import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  opacity: number
  life: number
  maxLife: number
  hue: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.4 + 0.1,
      life: 0,
      maxLife: Math.random() * 600 + 400,
      hue: 35 + Math.random() * 15, // 金色色调范围
    }
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 添加新粒子
    if (particlesRef.current.length < 40 && Math.random() < 0.05) {
      particlesRef.current.push(createParticle(canvas))
    }

    // 更新和绘制粒子
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.speedX
      particle.y += particle.speedY
      particle.life++

      // 轻微的水平漂移
      particle.speedX += (Math.random() - 0.5) * 0.01

      // 计算透明度（淡入淡出）
      let alpha = particle.opacity
      if (particle.life < 80) {
        alpha = (particle.life / 80) * particle.opacity
      } else if (particle.life > particle.maxLife - 80) {
        alpha = ((particle.maxLife - particle.life) / 80) * particle.opacity
      }

      // 绘制粒子 - 暖色光点
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      )
      gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 70%, ${alpha})`)
      gradient.addColorStop(0.4, `hsla(${particle.hue}, 60%, 60%, ${alpha * 0.5})`)
      gradient.addColorStop(1, `hsla(${particle.hue}, 50%, 50%, 0)`)

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      return particle.life < particle.maxLife && particle.y > -10
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [createParticle])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // 初始化一些粒子
    for (let i = 0; i < 20; i++) {
      const particle = createParticle(canvas)
      particle.y = Math.random() * canvas.height
      particle.life = Math.random() * 300
      particlesRef.current.push(particle)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, createParticle])

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3 }}
    />
  )
}
