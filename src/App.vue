<script setup lang="ts">
import { ref } from 'vue'
import ProductCard from '@/components/ProductCard.vue'
import CartModal from '@/components/CartModal.vue'
import BurgerScrollytelling from '@/components/BurgerScrollytelling.vue'
import { useCart } from '@/composables/useCart'
import { useRestaurantOpen } from '@/composables/useRestaurantOpen'
import { burgers, drinks, type Product } from '@/data/menu'

const { count, addToCart } = useCart()
const { isOpen, horario } = useRestaurantOpen()

const cartOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

function onAdd(product: Product) {
  addToCart(product)
}

function scrollToMenu() {
  menuRef.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <!--HEADER-->
  <header class="w-full h-[420px] bg-zinc-900 bg-home bg-cover bg-center">
    <div class="w-full h-full flex flex-col justify-center items-center">
      <img
        src="/assets/hamb-1.png"
        alt="Ofertas Burguer"
        class="w-32 h-32 rounded-full shadow-lg hover:scale-110 duration-200"
      />
      <h1 class="text-4xl md:text-5xl font-bold text-center mt-4 mb-2 text-white">
        Ofertas Burguer
      </h1>
      <span class="text-white font-medium"> Rua Av. Paulista 542, Nova York Araçatuba-SP</span>

      <div
        class="px-4 py-1 rounded-lg mt-5"
        :class="isOpen ? 'bg-green-600' : 'bg-red-500'"
      >
        <span class="text-white font-medium">{{ horario }}</span>
      </div>
    </div>
  </header>
  <!--FIM HEADER-->

  <!--Montagem do hambúrguer (scrollytelling GSAP)-->
  <BurgerScrollytelling @cta-click="scrollToMenu" />

  <h2 ref="menuRef" class="text-2xl md:text-3xl font-bold text-center mt-9 mb-6">
    Conheça Nosso menu
  </h2>

  <!--Ínicio Menu-->
  <div>
    <main class="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10 mx-auto max-w-7xl px-2 mb-16">
      <ProductCard v-for="burger in burgers" :key="burger.name" :product="burger" @add="onAdd" />
    </main>

    <div class="mx-auto max-w-7xl px-2 my-2">
      <h2 class="text-2xl md:text-3xl font-bold text-center mt-9 mb-6">Bebidas</h2>
    </div>

    <!--Grid Bebidas-->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-10 mx-auto max-w-7xl px-2 mb-16">
      <ProductCard
        v-for="drink in drinks"
        :key="drink.name"
        :product="drink"
        full-width
        @add="onAdd"
      />
    </div>
    <!--Fim Grid Bebidas-->
  </div>
  <!--Fim Menu-->

  <!--MODAL CART-->
  <CartModal :open="cartOpen" @close="cartOpen = false" />
  <!--Fim MODAL CART-->

  <!--BUTTON CART FOOTER-->
  <footer class="w-full bg-red-500 py-2 fixed bottom-0 z-40 flex items-center justify-center">
    <button class="flex items-center gap-2 text-white font-bold" @click="cartOpen = true">
      ({{ count }})
      Veja meu carrinho
      <i class="fa fas fa-cart-plus text-lg text-white"></i>
    </button>
  </footer>
  <!--FIM BUTTON CART FOOTER-->
</template>
