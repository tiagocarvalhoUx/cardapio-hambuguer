<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
const canvas = ref<HTMLCanvasElement | null>(null)
const dot = ref<HTMLDivElement | null>(null)
let cleanup = () => {}
onMounted(() => {
  if (!canvas.value || window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return
  const el = canvas.value, ctx = el.getContext('2d')!, particles: { x:number;y:number;r:number;life:number;max:number;drift:number }[] = []
  let x = -100, y = -100, lastX = x, lastY = y, raf = 0
  const resize = () => { const dpr = Math.min(devicePixelRatio, 2); el.width = innerWidth * dpr; el.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
  const move = (event: PointerEvent) => { x = event.clientX; y = event.clientY; dot.value?.style.setProperty('--x', `${x}px`); dot.value?.style.setProperty('--y', `${y}px`) }
  const render = () => { ctx.clearRect(0, 0, innerWidth, innerHeight); const distance = Math.hypot(x-lastX,y-lastY); if(distance>2){ for(let n=0;n<Math.min(3,Math.ceil(distance/12));n++)particles.push({x:x+(Math.random()-.5)*8,y:y+(Math.random()-.5)*8,r:7+Math.random()*10,life:0,max:42+Math.random()*20,drift:(Math.random()-.5)*.7});lastX=x;lastY=y } for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life++;p.y-=.42;p.x+=p.drift;if(p.life>=p.max){particles.splice(i,1);continue}const progress=p.life/p.max,radius=p.r*(1+progress*2.4),alpha=(1-progress)*.14,g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,radius);g.addColorStop(0,`rgba(255,235,205,${alpha})`);g.addColorStop(.45,`rgba(241,91,42,${alpha*.55})`);g.addColorStop(1,'rgba(241,91,42,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fill()}raf=requestAnimationFrame(render) }
  resize(); addEventListener('resize', resize); addEventListener('pointermove', move, { passive:true }); render(); cleanup = () => { cancelAnimationFrame(raf); removeEventListener('resize',resize);removeEventListener('pointermove',move) }
})
onUnmounted(() => cleanup())
</script>
<template><canvas ref="canvas" class="smoke-cursor" aria-hidden="true" /><div ref="dot" class="cursor-dot" aria-hidden="true"></div></template>
<style scoped>
.smoke-cursor{position:fixed;inset:0;z-index:90;width:100%;height:100%;pointer-events:none}
.cursor-dot{--x:-100px;--y:-100px;position:fixed;z-index:91;left:0;top:0;width:18px;height:18px;border:2px solid #fff9ec;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff9ec 0 10%,#f58a61 15%,#f15b2a 56%,#9f2d12 100%);box-shadow:0 0 0 7px rgba(241,91,42,.16),0 0 28px rgba(241,91,42,.85);pointer-events:none;transform:translate3d(calc(var(--x) - 50%),calc(var(--y) - 50%),0);transition:transform .06s linear;will-change:transform}
@media (pointer:fine){:global(body),:global(body *){cursor:none!important}}
@media (pointer:coarse),(prefers-reduced-motion:reduce){.smoke-cursor,.cursor-dot{display:none}}
</style>
