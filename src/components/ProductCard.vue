<script setup lang="ts">
import type { Product } from '@/data/menu'

defineProps<{ product: Product; fullWidth?: boolean }>()
const emit = defineEmits<{ add: [product: Product] }>()
</script>

<template>
  <div class="flex gap-2" :class="{ 'w-full': fullWidth }">
    <img
      :src="product.image"
      :alt="product.name"
      class="w-28 h-28 rounded-md hover:scale-110 hover:rotate-2 duration-300 object-cover"
    />
    <div :class="{ 'w-full': fullWidth }">
      <p class="font-bold">{{ product.name }}</p>
      <p v-if="product.description" class="text-sm">{{ product.description }}</p>
    </div>

    <div class="flex items-center gap-2 justify-between mt-3">
      <p class="font-bold text-lg">R$ {{ product.price.toFixed(2) }}</p>
      <button
        class="bg-gray-900 px-5 rounded add-to-cart-btn"
        :data-name="product.name"
        :data-price="product.price"
        @click="emit('add', product)"
      >
        <i class="fa fa-cart-plus text-lg text-white"></i>
      </button>
    </div>
  </div>
</template>
