<script setup lang="ts">
import type { Product } from '@/data/menu'
defineProps<{ product: Product }>(); const emit = defineEmits<{ add: [product: Product] }>()
</script>
<template><article class="product-card" :class="{ 'is-drink': product.category === 'drink' }"><div class="product-image"><img :src="product.image" :alt="product.name" loading="lazy" /></div><div class="product-body"><div><p v-if="product.tag" class="product-tag">{{ product.tag }}</p><h3>{{ product.name }}</h3></div><p class="product-description">{{ product.description }}</p><div class="product-footer"><strong>R$ {{ product.price.toFixed(2).replace('.', ',') }}</strong><button type="button" :aria-label="`Adicionar ${product.name}`" @click="emit('add', product)">Adicionar <i class="fa-solid fa-plus"></i></button></div></div></article></template>
