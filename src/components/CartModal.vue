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
    class="bg-black/75 backdrop-blur-sm w-full h-full fixed top-0 left-0 z-[99] flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div class="bg-[#fffaf0] text-[#181713] p-7 rounded-sm w-full max-w-[600px] border border-[#e8dfcf] shadow-2xl">
      <div class="flex items-start justify-between mb-6"><div><p class="text-[#e95a2c] text-[10px] font-bold tracking-[.18em] mb-2">SEU PEDIDO</p><h2 class="font-['Barlow_Condensed'] uppercase font-black text-4xl leading-none">Meu carrinho</h2></div><button class="text-[#746c5e]" aria-label="Fechar carrinho" @click="emit('close')"><i class="fa-solid fa-xmark text-xl"></i></button></div>

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
              <p class="font-medium mt-2">R$ {{ item.price.toFixed(2).replace('.', ',') }}</p>
            </div>

            <button class="remove-from-cart-btn" @click="removeFromCart(item.name)">
              Remover
            </button>
          </div>
        </div>
      </div>

      <p class="font-bold border-t border-[#e8dfcf] pt-4">Total: <span>{{ totalFormatado }}</span></p>

      <p class="font-bold mt-4">Endereço de entrega</p>
      <input
        v-model="address"
        type="text"
        placeholder="Digite seu endereço completo..."
        class="w-full border border-[#d8cdbb] bg-white p-3 rounded-sm my-2 outline-none focus:border-[#e95a2c]"
        :class="{ 'border-red-500': addressWarn }"
        @input="onAddressInput"
      />
      <p v-if="addressWarn" class="text-red-500">Digite seu endereço completo!</p>

      <div class="flex items-center justify-between mt-5 w-full">
        <button class="font-medium" @click="emit('close')">Fechar</button>
        <button class="bg-[#f15b2a] text-[#181713] font-bold px-5 py-3 rounded-full" @click="checkout">
          Finalizar Pedido
        </button>
      </div>
    </div>
  </div>
</template>
