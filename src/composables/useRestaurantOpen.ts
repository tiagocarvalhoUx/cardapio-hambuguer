import { onUnmounted, ref } from 'vue'

const ABERTURA = 18
const FECHAMENTO = 22

export function isRestaurantOpen(): boolean {
  const hora = new Date().getHours()
  return hora >= ABERTURA && hora < FECHAMENTO
}

export function useRestaurantOpen() {
  const isOpen = ref(isRestaurantOpen())

  // Revalida de minuto em minuto para o selo virar sozinho na troca de horário
  const timer = window.setInterval(() => {
    isOpen.value = isRestaurantOpen()
  }, 60_000)

  onUnmounted(() => window.clearInterval(timer))

  return { isOpen, horario: `Seg á Dom - ${ABERTURA}:00 as ${FECHAMENTO}:00` }
}
