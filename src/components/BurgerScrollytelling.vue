<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { asset } from '@/utils/asset'

gsap.registerPlugin(ScrollTrigger)

interface Camada {
  arquivo: string
  bottom: number
  width: number
  nome: string
  descricao: string
}

const camadas: Camada[] = [
  { arquivo: 'pao-inferior', bottom: 128, width: 290, nome: 'Pão inferior', descricao: 'brioche tostado' },
  { arquivo: 'blend', bottom: 198, width: 302, nome: 'Blend 180g', descricao: 'na brasa' },
  { arquivo: 'cheddar', bottom: 252, width: 322, nome: 'Cheddar', descricao: 'derretido' },
  { arquivo: 'cebola', bottom: 284, width: 240, nome: 'Cebola', descricao: 'caramelizada' },
  { arquivo: 'tomate', bottom: 352, width: 278, nome: 'Tomate', descricao: 'fatiado fresco' },
  { arquivo: 'alface', bottom: 402, width: 352, nome: 'Alface', descricao: 'crocante' },
  { arquivo: 'pao-superior', bottom: 474, width: 302, nome: 'Pão superior', descricao: 'com gergelim' },
]

// De onde cada camada entra: pão vem de baixo, recheios pelas laterais, tampa de cima
const entradas = [
  { x: 0, y: 340, r: 0 },
  { x: -560, y: 0, r: -16 },
  { x: 560, y: 0, r: 16 },
  { x: 0, y: -380, r: 0 },
  { x: -560, y: 0, r: -14 },
  { x: 560, y: 0, r: 14 },
  { x: 0, y: -500, r: 6 },
]

const emit = defineEmits<{ ctaClick: [] }>()

const smokeCanvas = ref<HTMLCanvasElement | null>(null)
let mm: gsap.MatchMedia | null = null

// Fumaça em partículas, com emissores nas laterais do prato
function makeSmoke(canvas: HTMLCanvasElement, emitters: { x: number; y: number; bias: number }[]) {
  const ctx = canvas.getContext('2d')!
  const CW = +canvas.getAttribute('width')!
  const CH = +canvas.getAttribute('height')!
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  canvas.width = CW * dpr
  canvas.height = CH * dpr
  ctx.scale(dpr, dpr)

  interface Particula {
    x: number
    y: number
    vx: number
    vy: number
    r: number
    life: number
    max: number
    sw: number
  }

  const ps: Particula[] = []
  let raf: number | null = null
  let active = false
  let t = 0

  function frame() {
    t++
    ctx.clearRect(0, 0, CW, CH)

    if (active) {
      emitters.forEach((em) => {
        const n = 1 + (Math.random() < 0.6 ? 1 : 0)
        for (let k = 0; k < n; k++) {
          ps.push({
            x: em.x + (Math.random() * 2 - 1) * 11,
            y: em.y,
            vx: em.bias + (Math.random() * 2 - 1) * 0.18,
            vy: -(0.42 + Math.random() * 0.55),
            r: 7 + Math.random() * 8,
            life: 0,
            max: 150 + Math.random() * 110,
            sw: Math.random() * 6.28,
          })
        }
      })
    }

    for (let i = ps.length - 1; i >= 0; i--) {
      const pp = ps[i]
      pp.life++
      if (pp.life >= pp.max) {
        ps.splice(i, 1)
        continue
      }

      const k = pp.life / pp.max
      pp.x += (pp.vx + Math.sin(t * 0.02 + pp.sw) * 0.3) * (1 + k * 1.4)
      pp.y += pp.vy
      pp.vy *= 0.997

      const rad = pp.r * (1 + k * 3.0)
      const a = Math.sin(k * Math.PI) * 0.22
      const g = ctx.createRadialGradient(pp.x, pp.y, 0, pp.x, pp.y, rad)
      g.addColorStop(0, `rgba(172,172,184,${a})`)
      g.addColorStop(1, 'rgba(172,172,184,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.arc(pp.x, pp.y, rad, 0, 6.283)
      ctx.fill()
    }

    raf = active || ps.length ? requestAnimationFrame(frame) : null
  }

  return {
    start: () => {
      if (!active) {
        active = true
        if (!raf) raf = requestAnimationFrame(frame)
      }
    },
    stop: () => {
      active = false
    },
    destroy: () => {
      active = false
      if (raf) cancelAnimationFrame(raf)
    },
  }
}

let smokeControls: ReturnType<typeof makeSmoke> | null = null
let resizeHandler: (() => void) | null = null

onMounted(() => {
  gsap.to('.bs-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
  })

  // O palco tem 720x780 fixos; aqui ele é reduzido para caber na viewport
  function fit() {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const s = Math.min(1, (vw * (vw < 640 ? 0.98 : 0.62)) / 720, (vh * 0.74) / 780)
    document.documentElement.style.setProperty('--bs-s', s.toFixed(3))
  }
  fit()
  resizeHandler = fit
  window.addEventListener('resize', resizeHandler)

  const ings = gsap.utils.toArray<HTMLElement>('.bs-ing')
  const labels = gsap.utils.toArray<HTMLElement>('.bs-lbl')

  mm = gsap.matchMedia()

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.set('.bs-plate', { opacity: 0, scale: 0.6, y: 30, transformOrigin: '50% 80%' })
    gsap.set('.bs-fries', { opacity: 0, x: 230, y: 170, rotation: 10 })
    gsap.set('.bs-juice', { opacity: 0, x: -230, y: 170, rotation: -10 })
    ings.forEach((el, i) => {
      gsap.set(el, { x: entradas[i].x, y: entradas[i].y, rotation: entradas[i].r, opacity: 0, scale: 0.85 })
    })

    if (!smokeCanvas.value) return

    const smoke = makeSmoke(smokeCanvas.value, [
      { x: 212, y: 470, bias: -0.5 },
      { x: 508, y: 470, bias: 0.5 },
    ])
    smokeControls = smoke

    let smoking = false
    const setSmoke = (on: boolean) => {
      if (on !== smoking) {
        smoking = on
        on ? smoke.start() : smoke.stop()
      }
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.bs-assembly',
        start: 'top top',
        end: '+=4200',
        scrub: 1,
        pin: '.bs-scene',
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (st) => {
          const ct = st.progress * tl.duration()
          const act = Math.floor((ct - 0.8) / 0.9)
          labels.forEach((l, idx) => l.classList.toggle('bs-on', idx <= act))
          setSmoke(ct > 6.0)
        },
      },
    })

    tl.to('.bs-plate', { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)' }, 0)

    ings.forEach((el, i) => {
      const pos = 0.8 + i * 0.9
      tl.to(el, { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.3)' }, pos).to(
        el,
        { scale: 0.99, duration: 0.14, yoyo: true, repeat: 1, ease: 'sine.inOut' },
        pos + 0.8,
      )
    })

    tl.to('.bs-juice', { opacity: 1, x: 0, y: 0, rotation: 0, duration: 1, ease: 'back.out(1.2)' }, 6.4)
    tl.to('.bs-fries', { opacity: 1, x: 0, y: 0, rotation: 0, duration: 1, ease: 'back.out(1.2)' }, 6.7)

    gsap.to('.bs-glow', {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: { trigger: '.bs-assembly', start: 'top top', end: 'bottom top', scrub: true },
    })

    // O pin só mede certo depois que fontes e imagens carregam
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const t1 = window.setTimeout(() => ScrollTrigger.refresh(), 300)
    Promise.all(
      Array.from(document.images).map(
        (im) => (im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r })),
      ),
    ).then(() => ScrollTrigger.refresh())

    return () => {
      window.removeEventListener('load', onLoad)
      window.clearTimeout(t1)
    }
  })

  // Acessibilidade: com movimento reduzido a cena já aparece montada, sem pin
  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set('.bs-ing,.bs-plate,.bs-fries,.bs-juice', { opacity: 1 })
    labels.forEach((l) => l.classList.add('bs-on'))
  })
})

onUnmounted(() => {
  mm?.revert()
  smokeControls?.destroy()
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<template>
  <div>
    <!-- Barra de progresso da rolagem -->
    <div class="bs-progress"></div>

    <section class="bs-assembly">
      <div class="bs-scene">
        <div class="bs-glow"></div>

        <div class="bs-stitle">
          <span>a montagem</span>
          <h2>Camada por camada</h2>
        </div>

        <div class="bs-scaler">
          <div class="bs-stage">
            <div class="bs-prop bs-plate" style="bottom: 60px; width: 470px; left: 50%">
              <img :src="asset('/assets/burger/prato.png')" alt="" aria-hidden="true" />
            </div>

            <div
              v-for="camada in camadas"
              :key="camada.arquivo"
              class="bs-ing"
              :style="{ bottom: camada.bottom + 'px', width: camada.width + 'px' }"
            >
              <img
                :src="asset('/assets/burger/' + camada.arquivo + '.png')"
                :alt="camada.nome + ' — ' + camada.descricao"
              />
            </div>

            <div class="bs-prop bs-fries" style="bottom: 84px; width: 190px; left: calc(50% + 232px)">
              <img :src="asset('/assets/burger/batata.png')" alt="Porção de batata frita" />
            </div>
            <div class="bs-prop bs-juice" style="bottom: 70px; width: 140px; left: calc(50% - 232px)">
              <img :src="asset('/assets/burger/suco.png')" alt="Copo de suco" />
            </div>

            <canvas ref="smokeCanvas" class="bs-smoke" width="720" height="780"></canvas>
          </div>
        </div>

        <div class="bs-rail">
          <div v-for="camada in camadas" :key="camada.arquivo" class="bs-lbl">
            <span class="bs-dot"></span>
            <span><b>{{ camada.nome }}</b><small>{{ camada.descricao }}</small></span>
          </div>
        </div>
      </div>
    </section>

    <section class="bs-cta">
      <h2>Pronto pra <span class="bs-a">devorar?</span></h2>
      <p>Montou aqui, agora é só escolher o seu.</p>
      <button class="bs-btn" type="button" @click="emit('ctaClick')">Ver cardápio</button>
    </section>
  </div>
</template>

<style>
/* Paleta compartilhada com o redesign: carvão, creme e laranja queimado. */
:root {
  --bs-primary: #f15b2a;
  --bs-accent: #c6bba8;
  --bs-accent-b: #181713;
  --bs-bg: #181713;
  --bs-bg-2: #2a2119;
  --bs-fg: #fff9ec;
  --bs-border: rgba(255, 249, 236, 0.2);
  --bs-s: 1;
}

/* barra de progresso da rolagem */
.bs-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  width: 100%;
  z-index: 60;
  transform-origin: 0 50%;
  transform: scaleX(0);
  pointer-events: none;
  background: linear-gradient(90deg, var(--bs-primary), var(--bs-accent-b));
}

/* seção da montagem */
.bs-assembly {
  position: relative;
  min-height: 100vh;
  background: var(--bs-bg);
}
.bs-scene {
  height: 100vh;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 54%, rgba(241, 91, 42, 0.13), transparent 31%),
    radial-gradient(circle at 0% 100%, rgba(119, 72, 34, 0.20), transparent 45%),
    linear-gradient(135deg, #181713 0%, #211a15 52%, #181713 100%);
}
.bs-glow {
  position: absolute;
  width: min(86vw, 760px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(241, 91, 42, 0.24), transparent 62%);
}

.bs-stitle {
  position: absolute;
  top: min(6vh, 50px);
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 4;
  width: 100%;
  padding: 0 16px;
}
.bs-stitle h2 {
  font-size: clamp(1.4rem, 4.2vw, 2.4rem);
  font-weight: 700;
  color: var(--bs-fg);
  margin: 0;
}
.bs-stitle span {
  display: block;
  margin-bottom: 6px;
  color: var(--bs-primary);
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-size: 0.7rem;
}

/* palco das camadas */
.bs-scaler {
  /* Centraliza via left/top + translate (imune ao "safe centering" do
     CSS Grid, que empurraria a caixa de 720px pra esquerda em telas
     menores em vez de centralizar de verdade). */
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: center center;
  transform: translate(-50%, -50%) scale(var(--bs-s, 1));
}
.bs-stage {
  position: relative;
  width: 720px;
  height: 780px;
}
.bs-ing,
.bs-prop {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  will-change: transform, opacity;
}
.bs-ing img,
.bs-prop img {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 10px 12px rgba(24, 24, 27, 0.18));
}
.bs-smoke {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 6;
}

/* trilha de rótulos */
.bs-rail {
  position: absolute;
  right: min(5vw, 52px);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 13px;
  z-index: 7;
}
.bs-lbl {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0.28;
  transition: opacity 0.3s;
}
.bs-lbl .bs-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--bs-border);
  transition: all 0.3s;
  flex: none;
}
.bs-lbl b {
  display: block;
  font-size: 0.98rem;
  color: var(--bs-fg);
}
.bs-lbl small {
  color: var(--bs-accent);
  font-weight: 600;
}
.bs-lbl.bs-on {
  opacity: 1;
}
.bs-lbl.bs-on .bs-dot {
  background: var(--bs-primary);
  box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.18);
}

/* chamada final da seção - emenda no cardápio abaixo */
.bs-cta {
  padding: 80px 24px 60px;
  text-align: center;
  background: linear-gradient(180deg, #211a15, #181713);
}
.bs-cta h2 {
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 700;
  margin: 0;
  color: #fff9ec;
}
.bs-cta h2 .bs-a {
  color: var(--bs-primary);
}
.bs-cta p {
  max-width: 34rem;
  margin: 16px auto 28px;
  color: #c6bba8;
  font-size: 1.05rem;
}
.bs-btn {
  cursor: pointer;
  background: var(--bs-primary);
  color: #181713;
  border: none;
  border-radius: 999px;
  font-family: inherit;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 16px 38px;
  box-shadow: 0 14px 30px -8px rgba(241, 91, 42, 0.55);
  transition: transform 0.2s;
}
.bs-btn:hover {
  transform: scale(1.05);
}

@media (max-width: 640px) {
  .bs-rail {
    right: 8px;
    gap: 7px;
  }
  .bs-lbl b {
    font-size: 0.78rem;
  }
  .bs-lbl small {
    font-size: 0.68rem;
  }
  .bs-lbl .bs-dot {
    width: 9px;
    height: 9px;
  }
  .bs-stitle {
    top: 12px;
  }
}
</style>
