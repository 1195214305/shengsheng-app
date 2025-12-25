import { useEffect, useRef } from 'react'

export default function LightRaysBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // 光线参数
    const rays: { angle: number; width: number; opacity: number; speed: number }[] = []
    const rayCount = 12

    for (let i = 0; i < rayCount; i++) {
      rays.push({
        angle: (Math.PI / rayCount) * i - Math.PI / 2,
        width: Math.random() * 0.15 + 0.05,
        opacity: Math.random() * 0.3 + 0.1,
        speed: (Math.random() - 0.5) * 0.0005
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 绘制渐变背景
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height + 100,
        0,
        canvas.width / 2,
        canvas.height + 100,
        canvas.height * 1.5
      )
      bgGradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)')
      bgGradient.addColorStop(0.3, 'rgba(139, 92, 246, 0.08)')
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 绘制光线
      const centerX = canvas.width / 2
      const centerY = canvas.height + 50

      rays.forEach((ray) => {
        ray.angle += ray.speed

        const length = canvas.height * 1.8
        const startAngle = ray.angle - ray.width / 2
        const endAngle = ray.angle + ray.width / 2

        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          length
        )
        gradient.addColorStop(0, `rgba(147, 197, 253, ${ray.opacity * 0.8})`)
        gradient.addColorStop(0.3, `rgba(139, 92, 246, ${ray.opacity * 0.4})`)
        gradient.addColorStop(0.7, `rgba(59, 130, 246, ${ray.opacity * 0.1})`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, length, startAngle, endAngle)
        ctx.closePath()
        ctx.fillStyle = gradient
        ctx.fill()
      })

      // 绘制中心光晕
      const glowGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        300
      )
      glowGradient.addColorStop(0, 'rgba(147, 197, 253, 0.4)')
      glowGradient.addColorStop(0.3, 'rgba(139, 92, 246, 0.2)')
      glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = glowGradient
      ctx.fillRect(0, canvas.height - 300, canvas.width, 300)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
