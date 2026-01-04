"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

// Particle class for cursor trail
class CursorParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: THREE.Color

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 2 + 1
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed
    this.maxLife = Math.random() * 60 + 30
    this.life = this.maxLife
    this.size = Math.random() * 3 + 1
    this.color = new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.6)
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.05 // gravity
    this.life--
    return this.life > 0
  }

  get alpha() {
    return this.life / this.maxLife
  }
}

export default function InteractivePortrait() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationFrameRef = useRef<number>(0)
  const particlesRef = useRef<CursorParticle[]>([])
  const lastMouseRef = useRef({ x: 0, y: 0 })
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [interactionCount, setInteractionCount] = useState(0)

  // Hide hint after first interaction
  useEffect(() => {
    if (interactionCount > 0) {
      const timer = setTimeout(() => setShowHint(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [interactionCount])

  // Audio setup
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.loop = true
    audioRef.current.volume = 0.3
    // Using a data URL for a simple ambient tone (you can replace with actual audio file)
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.pause()
      } else {
        // Create ambient audio context
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        oscillator.start()

        // Store reference for cleanup
        audioRef.current = { pause: () => oscillator.stop() } as unknown as HTMLAudioElement
      }
      setAudioEnabled(!audioEnabled)
    }
  }, [audioEnabled])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!containerRef.current) {
      setIsLoaded(true)
      return
    }

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const gu = {
      time: { value: 0 },
      dTime: { value: 0 },
      aspect: { value: width / height },
    }

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1e3a5f)

    const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 1000)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Particle system for background ambiance
    const particleCount = 100
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleSizes = new Float32Array(particleCount)
    const particleAlphas = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * width * 1.5
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * height * 1.5
      particlePositions[i * 3 + 2] = 0.2
      particleSizes[i] = Math.random() * 3 + 1
      particleAlphas[i] = Math.random() * 0.5 + 0.2
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1))
    particleGeometry.setAttribute('alpha', new THREE.BufferAttribute(particleAlphas, 1))

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        time: gu.time,
        color: { value: new THREE.Color(0x4dd9e8) }
      },
      vertexShader: `
        attribute float size;
        attribute float alpha;
        varying float vAlpha;
        uniform float time;
        void main() {
          vAlpha = alpha;
          vec3 pos = position;
          pos.y += sin(time * 0.5 + position.x * 0.01) * 20.0;
          pos.x += cos(time * 0.3 + position.y * 0.01) * 15.0;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        void main() {
          float r = distance(gl_PointCoord, vec2(0.5));
          if (r > 0.5) discard;
          float alpha = vAlpha * (1.0 - r * 2.0);
          gl_FragColor = vec4(color, alpha * 0.6);
        }
      `
    })

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    particleSystem.position.z = -0.1
    scene.add(particleSystem)

    class Blob {
      renderer: THREE.WebGLRenderer
      fbTexture: { value: THREE.FramebufferTexture }
      rtOutput: THREE.WebGLRenderTarget
      uniforms: {
        pointer: { value: THREE.Vector2 }
        pointerDown: { value: number }
        pointerRadius: { value: number }
        pointerDuration: { value: number }
        velocity: { value: number }
      }
      rtScene: THREE.Mesh
      rtCamera: THREE.Camera

      constructor(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer
        this.fbTexture = { value: new THREE.FramebufferTexture(width, height) }
        this.rtOutput = new THREE.WebGLRenderTarget(width, height)
        this.uniforms = {
          pointer: { value: new THREE.Vector2().setScalar(10) },
          pointerDown: { value: 1 },
          pointerRadius: { value: 0.4 },
          pointerDuration: { value: 2.0 },
          velocity: { value: 0 }
        }

        const handlePointerMove = (clientX: number, clientY: number) => {
          const rect = container.getBoundingClientRect()
          const newX = ((clientX - rect.left) / width) * 2 - 1
          const newY = -((clientY - rect.top) / height) * 2 + 1

          // Calculate velocity for dynamic radius
          const dx = newX - this.uniforms.pointer.value.x
          const dy = newY - this.uniforms.pointer.value.y
          const velocity = Math.sqrt(dx * dx + dy * dy)
          this.uniforms.velocity.value = Math.min(velocity * 10, 2)

          this.uniforms.pointer.value.x = newX
          this.uniforms.pointer.value.y = newY

          // Spawn particles on movement
          if (velocity > 0.01) {
            const screenX = clientX - rect.left
            const screenY = clientY - rect.top
            for (let i = 0; i < Math.min(velocity * 50, 5); i++) {
              particlesRef.current.push(new CursorParticle(screenX, screenY))
            }
            setInteractionCount(c => c + 1)
          }

          lastMouseRef.current = { x: clientX - rect.left, y: clientY - rect.top }
        }

        const handleMouseMove = (event: MouseEvent) => {
          handlePointerMove(event.clientX, event.clientY)
        }

        const handleTouchMove = (event: TouchEvent) => {
          if (event.touches.length > 0) {
            event.preventDefault()
            handlePointerMove(event.touches[0].clientX, event.touches[0].clientY)
          }
        }

        const handleMouseLeave = () => {
          this.uniforms.pointer.value.setScalar(10)
        }

        container.addEventListener("mousemove", handleMouseMove)
        container.addEventListener("touchmove", handleTouchMove, { passive: false })
        container.addEventListener("touchstart", handleTouchMove as EventListener, { passive: false })
        container.addEventListener("mouseleave", handleMouseLeave)

        const rtMaterial = new THREE.MeshBasicMaterial({
          color: 0x000000,
        })
        rtMaterial.onBeforeCompile = (shader) => {
          shader.uniforms.dTime = gu.dTime
          shader.uniforms.aspect = gu.aspect
          shader.uniforms.pointer = this.uniforms.pointer
          shader.uniforms.pointerDown = this.uniforms.pointerDown
          shader.uniforms.pointerRadius = this.uniforms.pointerRadius
          shader.uniforms.pointerDuration = this.uniforms.pointerDuration
          shader.uniforms.velocity = this.uniforms.velocity
          shader.uniforms.fbTexture = this.fbTexture
          shader.uniforms.time = gu.time
          shader.fragmentShader = `
            uniform float dTime, aspect, pointerDown, pointerRadius, pointerDuration, time, velocity;
            uniform vec2 pointer;
            uniform sampler2D fbTexture;

            float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
            float noise(vec2 p) {
              vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
              float a = hash(i); float b = hash(i + vec2(1.,0.));
              float c = hash(i + vec2(0.,1.)); float d = hash(i + vec2(1.,1.));
              return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
            }
            float fbm(vec2 p) {
              float v = 0.0, a = 0.5;
              for(int i = 0; i < 4; i++) {
                v += a * noise(p);
                p *= 2.0;
                a *= 0.5;
              }
              return v;
            }
            ${shader.fragmentShader}
          `.replace(
            `#include <color_fragment>`,
            `#include <color_fragment>
            float rVal = texture2D(fbTexture, vUv).r;
            rVal -= clamp(dTime / pointerDuration, 0., 0.04);
            rVal = clamp(rVal, 0., 1.);
            float f = 0.;
            if (pointerDown > 0.5) {
              vec2 uv = (vUv - 0.5) * 2. * vec2(aspect, 1.);
              vec2 mouse = pointer * vec2(aspect, 1.);
              vec2 toMouse = uv - mouse;
              float angle = atan(toMouse.y, toMouse.x);
              float dist = length(toMouse);

              // Multi-layered organic noise
              float noiseVal = fbm(vec2(angle*4. + time*0.5, dist*6.));
              float noiseVal2 = fbm(vec2(angle*6. - time*0.4, dist*4. + time*0.5));
              float noiseVal3 = noise(vec2(time*2., angle*2.)) * 0.3;

              // Dynamic radius based on velocity
              float dynamicRadius = pointerRadius * (1.0 + velocity * 0.5);
              float radiusVariation = 0.6 + noiseVal*0.5 + noiseVal2*0.4 + noiseVal3;
              float organicRadius = dynamicRadius * radiusVariation;

              // Smoother falloff
              f = 1. - smoothstep(organicRadius*0.03, organicRadius*1.3, dist);
              f *= 0.85 + noiseVal*0.15;

              // Add pulsing effect
              f *= 1.0 + sin(time * 3.0) * 0.05;
            }
            rVal += f * 0.28;
            rVal = clamp(rVal, 0., 1.);
            diffuseColor.rgb = vec3(rVal);
            `,
          )
        };
        (rtMaterial as THREE.MeshBasicMaterial & { defines?: Record<string, string> }).defines = { USE_UV: "" }
        this.rtScene = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          rtMaterial
        )
        this.rtCamera = new THREE.Camera()
      }

      render() {
        this.renderer.setRenderTarget(this.rtOutput)
        this.renderer.render(this.rtScene, this.rtCamera)
        this.renderer.copyFramebufferToTexture(this.fbTexture.value)
        this.renderer.setRenderTarget(null)
      }
    }

    const blob = new Blob(renderer)

    // Loading manager for progress
    const loadingManager = new THREE.LoadingManager()
    let loadedCount = 0
    const totalItems = 2

    loadingManager.onProgress = () => {
      loadedCount++
      setLoadProgress((loadedCount / totalItems) * 100)
    }

    const textureLoader = new THREE.TextureLoader(loadingManager)
    const baseTexture = textureLoader.load("/images/hero-off.png", (texture) => {
      const img = texture.image
      const imgAspect = img.width / img.height
      const containerAspect = width / height
      let planeWidth, planeHeight
      if (imgAspect > containerAspect) {
        planeHeight = height
        planeWidth = height * imgAspect
      } else {
        planeWidth = width
        planeHeight = width / imgAspect
      }
      baseImage.geometry.dispose()
      baseImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
      helmetImage.geometry.dispose()
      helmetImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
      bgPlane.geometry.dispose()
      bgPlane.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)

      setTimeout(() => setIsLoaded(true), 500)
    })

    const helmetTexture = textureLoader.load("/images/hero-on.png")

    baseTexture.colorSpace = THREE.SRGBColorSpace
    helmetTexture.colorSpace = THREE.SRGBColorSpace

    const baseImageMaterial = new THREE.MeshBasicMaterial({ map: baseTexture, transparent: true, alphaTest: 0.0 })
    const baseImage = new THREE.Mesh(new THREE.PlaneGeometry(width, height), baseImageMaterial)
    scene.add(baseImage)

    const bgPlaneMaterial = new THREE.MeshBasicMaterial({ color: 0x1e3a5f, transparent: true });
    (bgPlaneMaterial as THREE.MeshBasicMaterial & { defines?: Record<string, string> }).defines = { USE_UV: "" }

    bgPlaneMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.texBlob = { value: blob.rtOutput.texture }
      shader.uniforms.time = gu.time

      let vertexShader = shader.vertexShader
      vertexShader = vertexShader.replace("void main() {", "varying vec4 vPosProj;\nvoid main() {")
      vertexShader = vertexShader.replace(
        "#include <project_vertex>",
        "#include <project_vertex>\nvPosProj = gl_Position;",
      )
      shader.vertexShader = vertexShader

      shader.fragmentShader = `
        uniform sampler2D texBlob;
        uniform float time;
        varying vec4 vPosProj;

        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
        float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.-2.*f);float a=hash(i);float b=hash(i+vec2(1.,0.));float c=hash(i+vec2(0.,1.));float d=hash(i+vec2(1.,1.));return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}

        float fbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 5; i++) {
                value += amplitude * noise(p);
                p *= 2.2;
                amplitude *= 0.45;
            }
            return value;
        }

        ${shader.fragmentShader}
      `.replace(
        `#include <clipping_planes_fragment>`,
        `
        vec2 blobUV=((vPosProj.xy/vPosProj.w)+1.)*0.5;
        vec4 blobData=texture(texBlob,blobUV);
        if(blobData.r<0.02)discard;

        // Enhanced color palette
        vec3 colorBg = vec3(0.10, 0.20, 0.35);
        vec3 colorCyan = vec3(0.3, 0.85, 0.95);
        vec3 colorPurple = vec3(0.5, 0.25, 0.7);
        vec3 colorPink = vec3(0.9, 0.4, 0.6);
        vec3 colorGold = vec3(1.0, 0.8, 0.3);

        vec2 uv = vUv * 4.0;
        vec2 distortionField = vUv * 2.5;
        float distortion = fbm(distortionField + time * 0.15);
        float distortionStrength = 0.8;
        vec2 warpedUv = uv + (distortion - 0.5) * distortionStrength;
        float n = fbm(warpedUv + time * 0.1);

        // Multi-color gradient
        float softShapeMix = smoothstep(0.15, 0.85, sin(n * 3.5 + time * 0.2));
        vec3 baseColor = mix(colorBg, colorCyan, softShapeMix);
        baseColor = mix(baseColor, colorPurple, smoothstep(0.3, 0.7, cos(n * 2.0 - time * 0.15)));

        // Chromatic aberration effect
        float chromaOffset = 0.003;
        float rOffset = fbm(warpedUv + vec2(chromaOffset, 0.0));
        float bOffset = fbm(warpedUv - vec2(chromaOffset, 0.0));
        baseColor.r *= 0.9 + rOffset * 0.2;
        baseColor.b *= 0.9 + bOffset * 0.2;

        // Line patterns with glow
        float linePattern = fract(n * 12.0);
        float lineMix = 1.0 - smoothstep(0.47, 0.53, linePattern);
        vec3 lineColor = mix(colorPurple, colorPink, sin(time + n * 5.0) * 0.5 + 0.5);
        vec3 finalColor = mix(baseColor, lineColor, lineMix * 0.8);

        // Add sparkle highlights
        float sparkle = pow(noise(vUv * 50.0 + time * 2.0), 8.0);
        finalColor += colorGold * sparkle * 0.5;

        // Vignette glow at edges of reveal
        float edgeGlow = smoothstep(0.02, 0.15, blobData.r) * (1.0 - smoothstep(0.7, 1.0, blobData.r));
        finalColor += colorCyan * edgeGlow * 0.3;

        diffuseColor.rgb = finalColor;
        #include <clipping_planes_fragment>
        `,
      )
    }

    const bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(width, height), bgPlaneMaterial)
    scene.add(bgPlane)

    const helmetImageMaterial = new THREE.MeshBasicMaterial({ map: helmetTexture, transparent: true, alphaTest: 0.0 })

    helmetImageMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.texBlob = { value: blob.rtOutput.texture }
      shader.uniforms.time = gu.time

      let vertexShader = shader.vertexShader
      vertexShader = vertexShader.replace("void main() {", "varying vec4 vPosProj;\nvoid main() {")
      vertexShader = vertexShader.replace(
        "#include <project_vertex>",
        "#include <project_vertex>\nvPosProj = gl_Position;",
      )
      shader.vertexShader = vertexShader
      shader.fragmentShader = `
        uniform sampler2D texBlob;
        uniform float time;
        varying vec4 vPosProj;
        ${shader.fragmentShader}
      `.replace(
        `#include <clipping_planes_fragment>`,
        `
        vec2 blobUV=((vPosProj.xy/vPosProj.w)+1.)*0.5;
        vec4 blobData=texture(texBlob,blobUV);
        if(blobData.r<0.02)discard;

        // Subtle glow effect on revealed image
        float glowIntensity = smoothstep(0.02, 0.2, blobData.r);
        diffuseColor.rgb *= 1.0 + glowIntensity * 0.15;

        #include <clipping_planes_fragment>
        `,
      )
    }

    const helmetImage = new THREE.Mesh(new THREE.PlaneGeometry(width, height), helmetImageMaterial)
    scene.add(helmetImage)

    baseImage.position.z = 0.0
    bgPlane.position.z = 0.05
    helmetImage.position.z = 0.1

    // 2D canvas overlay for cursor particles
    const canvas2d = document.createElement('canvas')
    canvas2d.width = width
    canvas2d.height = height
    canvas2d.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;'
    container.appendChild(canvas2d)
    const ctx = canvas2d.getContext('2d')!

    const clock = new THREE.Clock()
    let t = 0

    const animate = () => {
      const dt = clock.getDelta()
      t += dt
      gu.time.value = t
      gu.dTime.value = dt
      blob.render()
      renderer.render(scene, camera)

      // Update and render cursor particles
      ctx.clearRect(0, 0, width, height)
      particlesRef.current = particlesRef.current.filter(p => {
        if (p.update()) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * p.alpha, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${180 + Math.random() * 40}, 80%, 60%, ${p.alpha * 0.8})`
          ctx.fill()
          return true
        }
        return false
      })

      // Limit particles
      if (particlesRef.current.length > 100) {
        particlesRef.current = particlesRef.current.slice(-100)
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.left = newWidth / -2
      camera.right = newWidth / 2
      camera.top = newHeight / 2
      camera.bottom = newHeight / -2
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
      canvas2d.width = newWidth
      canvas2d.height = newHeight
      gu.aspect.value = newWidth / newHeight
      if (baseTexture.image) {
        const img = baseTexture.image
        const imgAspect = img.width / img.height
        const containerAspect = newWidth / newHeight
        let planeWidth, planeHeight
        if (imgAspect > containerAspect) {
          planeHeight = newHeight
          planeWidth = newHeight * imgAspect
        } else {
          planeWidth = newWidth
          planeHeight = newWidth / imgAspect
        }
        baseImage.geometry.dispose()
        baseImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
        helmetImage.geometry.dispose()
        helmetImage.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
        bgPlane.geometry.dispose()
        bgPlane.geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
      if (canvas2d.parentNode) {
        canvas2d.parentNode.removeChild(canvas2d)
      }
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose())
            } else {
              object.material.dispose()
            }
          }
        }
      })
      baseTexture.dispose()
      helmetTexture.dispose()
      blob.rtOutput.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
    }
  }, [isMobile])

  // Mobile touch-enabled version
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #4dd9e8 0%, #1e3a5f 50%, #6b4c9e 100%)",
        }}
      >
        {/* Loading state */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#1e3a5f]"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-cyan-400 text-lg font-light"
              >
                Loading experience...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src="/images/hero-off.png"
            alt="Interactive Portrait"
            fill
            className="object-contain"
            priority
            onLoad={() => setIsLoaded(true)}
          />

          {/* Touch hint for mobile */}
          <AnimatePresence>
            {isLoaded && showHint && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-white/80 text-sm backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full"
                >
                  Touch and drag to explore
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Loading overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1e3a5f]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Animated loading ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-4 border-purple-400/30 border-b-purple-400 rounded-full"
              />
            </motion.div>

            {/* Progress bar */}
            <div className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${loadProgress}%` }}
                className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-cyan-400/80 text-sm font-light tracking-wider"
            >
              Initializing experience...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main interactive container */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-none overflow-hidden"
        style={{
          touchAction: "none",
          background: "linear-gradient(135deg, #4dd9e8 0%, #1e3a5f 50%, #6b4c9e 100%)",
        }}
      />

      {/* UI Overlays */}
      <AnimatePresence>
        {isLoaded && (
          <>
            {/* Interaction hint */}
            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
              >
                <motion.div
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.98, 1.02, 0.98]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-white/70 text-sm backdrop-blur-md bg-black/20 px-6 py-3 rounded-full border border-white/10"
                >
                  <span className="mr-2">✨</span>
                  Move your cursor to reveal the magic
                  <span className="ml-2">✨</span>
                </motion.div>
              </motion.div>
            )}

            {/* Audio toggle */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              onClick={toggleAudio}
              className="fixed top-6 right-6 z-20 p-3 backdrop-blur-md bg-black/20 rounded-full border border-white/10 hover:bg-black/30 transition-colors group"
              aria-label={audioEnabled ? "Mute audio" : "Enable audio"}
            >
              <motion.div
                animate={audioEnabled ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: audioEnabled ? Infinity : 0 }}
              >
                {audioEnabled ? (
                  <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white/60 group-hover:text-white/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                )}
              </motion.div>
            </motion.button>

            {/* Branding/title overlay */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="fixed top-6 left-6 z-20 pointer-events-none"
            >
              <h1 className="text-2xl font-bold text-white/90 tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Discover
                </span>
              </h1>
              <p className="text-white/50 text-sm mt-1">Interactive Experience</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
