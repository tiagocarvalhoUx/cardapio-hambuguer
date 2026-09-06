import { asset } from '@/utils/asset'

export interface Product {
  name: string
  price: number
  image: string
  description?: string
}

export const burgers: Product[] = [
  {
    name: 'Hamburger Smash',
    price: 18.9,
    image: asset('/assets/hamb-1.png'),
    description: 'Pão de brioche, Burger 160g, queijo prato e maionese da casa',
  },
  {
    name: 'Hamburger Duplo',
    price: 32.9,
    image: asset('/assets/hamb-2.png'),
    description: 'Pão de brioche, Burger 160g, queijo prato e maionese da casa',
  },
  {
    name: 'Hamburger Salad',
    price: 35.9,
    image: asset('/assets/hamb-3.png'),
    description: 'Pão de brioche, Burger 160g, queijo prato e maionese da casa',
  },
  {
    name: 'Hamburger da Casa',
    price: 25.9,
    image: asset('/assets/hamb-4.png'),
    description: 'Pão de brioche, Burger 160g, queijo prato e maionese da casa',
  },
]

export const drinks: Product[] = [
  { name: 'Coca Lata', price: 6.0, image: asset('/assets/refri-1.png') },
  { name: 'Guaraná Lata', price: 6.0, image: asset('/assets/refri-2.png') },
]
