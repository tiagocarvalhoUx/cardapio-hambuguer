<script setup lang="ts">
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import CartModal from '@/components/CartModal.vue'
import BurgerScrollytelling from '@/components/BurgerScrollytelling.vue'
import SmokeCursor from '@/components/SmokeCursor.vue'
import { useCart } from '@/composables/useCart'
import { useRestaurantOpen } from '@/composables/useRestaurantOpen'
import { burgers, drinks, type Product } from '@/data/menu'
const { count, addToCart } = useCart(); const { isOpen, horario } = useRestaurantOpen()
const cartOpen = ref(false); const menuRef = ref<HTMLElement | null>(null)
function scrollToMenu() { menuRef.value?.scrollIntoView({ behavior: 'smooth' }) }; function onAdd(product: Product) { addToCart(product) }
</script>
<template>
  <div class="site-shell">
    <SmokeCursor />
    <header id="top" class="hero">
      <nav class="topbar" aria-label="Navegação principal">
        <a class="brand" href="#top" aria-label="Ofertas Burger, início"><span>O</span>FERTAS<br />BURGER</a>
        <div class="topbar-info"><i class="fa-solid fa-location-dot"></i> Araçatuba, SP</div>
        <button class="cart-pill" type="button" @click="cartOpen = true" aria-label="Abrir carrinho"><i class="fa-solid fa-bag-shopping"></i><b>{{ count }}</b><span>Meu pedido</span></button>
      </nav>
      <div class="hero-content"><p class="eyebrow">SMASHED DAILY · DESDE 2024</p><h1>O burger que<br /><em>vale a fome.</em></h1><p class="hero-copy">Blend na chapa, brioche dourado e ingredientes sem atalhos. Seu novo vício começa aqui.</p><div class="hero-actions"><button class="button button-primary" type="button" @click="scrollToMenu">Pedir agora <i class="fa-solid fa-arrow-down"></i></button><a class="button button-ghost" href="https://www.google.com/maps/search/?api=1&query=Av.+Paulista+542+Ara%C3%A7atuba+SP" target="_blank" rel="noreferrer"><i class="fa-solid fa-location-arrow"></i> Como chegar</a></div></div>
      <div class="open-status" :class="{ closed: !isOpen }"><span></span><b>{{ isOpen ? 'Aberto agora' : 'Fechado agora' }}</b> · {{ horario }}</div><div class="hero-stamp" aria-hidden="true"><span>100%<br />SABOR</span></div>
    </header>
    <BurgerScrollytelling @cta-click="scrollToMenu" />
    <main ref="menuRef" class="menu-section"><div class="section-intro"><div><p class="eyebrow">O ESSENCIAL</p><h2>Feitos pra<br /><em>devorar.</em></h2></div><p>Escolha seu favorito. Todos acompanham nosso molho secreto e aquele smash com casquinha inesquecível.</p></div><div class="menu-grid"><ProductCard v-for="burger in burgers" :key="burger.name" :product="burger" @add="onAdd" /></div><div class="drinks-heading"><p class="eyebrow">PRA ACOMPANHAR</p><h2>Geladas <em>no ponto.</em></h2></div><div class="drink-grid"><ProductCard v-for="drink in drinks" :key="drink.name" :product="drink" @add="onAdd" /></div></main>
    <section class="visit-section"><p class="eyebrow">A SUA MESA ESTÁ AQUI</p><h2>Chega mais.<br /><em>A chapa tá quente.</em></h2><p>Av. Paulista, 542 · Nova York<br />Araçatuba — SP</p></section>
    <CartModal :open="cartOpen" @close="cartOpen = false" /><button v-if="count" class="floating-cart" type="button" @click="cartOpen = true"><i class="fa-solid fa-bag-shopping"></i> Ver pedido <b>{{ count }}</b></button>
  </div>
</template>
