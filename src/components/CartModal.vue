<script setup lang="ts">
import { ref } from 'vue'
import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'
import { useCart } from '@/composables/useCart'
import { isRestaurantOpen } from '@/composables/useRestaurantOpen'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { items, totalFormatado, removeFromCart, clearCart } = useCart()

const address = ref('')
const addressWarn = ref(false)
const WHATSAPP_PHONE = '18981142927'

function onAddressInput() {
  if (address.value !== '') addressWarn.value = false
}

function checkout() {
  if (!isRestaurantOpen()) {
    Toastify({
      text: 'Ops o Restaurante está fechado',
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true,
      style: { background: '#ef4444' },
    }).showToast()
    return
  }

  if (items.value.length === 0) return

  if (address.value === '') {
    addressWarn.value = true
    return
  }

  const cartItems = items.value
    .map((item) => `${item.name} Quantidade:(${item.quantity}) Preço: R$${item.price} `)
    .join('')

  const message = encodeURIComponent(cartItems)
  window.open(
    `https://wa.me/${WHATSAPP_PHONE}?text=${message} Endereço: ${address.value}`,
    '_blank',
  )

  clearCart()
  address.value = ''
  emit('close')
}
</script>

<template>
  <div
    v-if="open"
    class="bg-black/60 w-full h-full fixed top-0 left-0 z-[99] flex items-center justify-center"
    @click.self="emit('close')"
  >
    <div class="bg-white p-5 rounded-md min-w-[90%] md:min-w-[600px]">
      <h2 class="text-center font-bold text-2xl mb-2">Meu Carrinho</h2>

      <div class="flex justify-between mb-2 flex-col">
        <div
          v-for="item in items"
          :key="item.name"
          class="flex justify-between mb-4 flex-col"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ item.name }}</p>
              <p class="mt-2">Qtd: {{ item.quantity }}</p>
              <p class="font-medium mt-2">R$ {{ item.price.toFixed(2) }}</p>
            </div>

            <button class="remove-from-cart-btn" @click="removeFromCart(item.name)">
              Remover
            </button>
          </div>
        </div>
      </div>

      <p class="font-bold">Total: <span>{{ totalFormatado }}</span></p>

      <p class="font-bold mt-4">Endereço de entrega</p>
      <input
        v-model="address"
        type="text"
        placeholder="Digite seu endereço completo..."
        class="w-full border-2 p-1 rounded my-1"
        :class="{ 'border-red-500': addressWarn }"
        @input="onAddressInput"
      />
      <p v-if="addressWarn" class="text-red-500">Digite seu endereço completo!</p>

      <div class="flex items-center justify-between mt-5 w-full">
        <button class="font-medium" @click="emit('close')">Fechar</button>
        <button class="bg-green-500 text-white px-4 py-1 rounded" @click="checkout">
          Finalizar Pedido
        </button>
      </div>
    </div>
  </div>
</template>
