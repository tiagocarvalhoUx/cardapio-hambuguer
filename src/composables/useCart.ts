import { computed, ref } from 'vue'
import type { Product } from '@/data/menu'

export interface CartItem {
  name: string
  price: number
  quantity: number
}

// Estado compartilhado entre todos os componentes que usarem o composable
const items = ref<CartItem[]>([])

export function useCart() {
  const total = computed(() =>
    items.value.reduce((soma, item) => soma + item.price * item.quantity, 0),
  )

  // Conta itens distintos, igual ao comportamento original do contador
  const count = computed(() => items.value.length)

  const totalFormatado = computed(() =>
    total.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  )

  function addToCart(product: Product) {
    const existente = items.value.find((item) => item.name === product.name)

    if (existente) {
      existente.quantity += 1
      return
    }

    items.value.push({ name: product.name, price: product.price, quantity: 1 })
  }

  // Remove uma unidade por vez; some da lista quando chega a zero
  function removeFromCart(name: string) {
    const index = items.value.findIndex((item) => item.name === name)
    if (index === -1) return

    const item = items.value[index]
    if (item.quantity > 1) {
      item.quantity -= 1
      return
    }

    items.value.splice(index, 1)
  }

  function clearCart() {
    items.value = []
  }

  return { items, total, totalFormatado, count, addToCart, removeFromCart, clearCart }
}
