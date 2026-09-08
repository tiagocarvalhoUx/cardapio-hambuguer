export interface Product { name: string; price: number; image: string; description?: string; tag?: string; category?: 'drink' }
const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=88`
// Imagens servidas da pasta public/; BASE_URL cobre deploy em subpasta.
const local = (arquivo: string) => `${import.meta.env.BASE_URL}assets/${arquivo}`
export const burgers: Product[] = [
  { name: 'Classic Smash', tag: 'O MAIS PEDIDO', price: 24.9, image: photo('photo-1568901346375-23c9450c58cd'), description: '2 smash burgers, cheddar cremoso, picles e molho da casa.' },
  { name: 'Double Trouble', price: 32.9, image: photo('photo-1550547660-d9450f859349'), description: '2 carnes de 90g, bacon crocante, cheddar e cebola caramelizada.' },
  { name: 'Fire House', tag: 'PICANTE', price: 29.9, image: photo('photo-1594212699903-ec8a3eca50f5'), description: 'Smash 160g, pepper jack, jalapeño, cebola roxa e maionese spicy.' },
  { name: 'Green Machine', price: 27.9, image: photo('photo-1596662951482-0c4ba74a6df6'), description: 'Smash 160g, queijo prato, alface crocante, tomate e molho verde.' },
  { name: 'Bacon Bourbon', tag: 'INTENSO', price: 34.9, image: photo('photo-1553979459-d2229ba7433b'), description: 'Blend 180g, bacon defumado, cheddar, cebola crispy e barbecue bourbon.' },
  { name: 'Truffle Melt', tag: 'EXPERIÊNCIA', price: 39.9, image: photo('photo-1561758033-d89a9ad46330'), description: 'Blend 180g, queijo gouda, cogumelos na manteiga e maionese trufada.' },
  { name: 'Onion Supreme', price: 31.9, image: photo('photo-1586816001966-79b736744398'), description: '2 smash burgers, cheddar duplo, onion rings e molho especial de cebola.' },
  { name: 'Blue Moon', price: 36.9, image: photo('photo-1606756790138-261d2b21cd75'), description: 'Blend 180g, gorgonzola cremoso, bacon, rúcula e geleia de pimenta.' },
  { name: 'Crispy Chicken', tag: 'CROCANTE', price: 29.9, image: photo('photo-1601050690597-df0568f70950'), description: 'Frango empanado crocante, coleslaw, picles e maionese de limão.' },
  { name: 'Parmegiana Smash', price: 33.9, image: photo('photo-1613514785940-daed07799d9b'), description: 'Smash 160g, muçarela, molho de tomate rústico e parmesão gratinado.' },
]
export const drinks: Product[] = [
  { name: 'Coca-Cola Lata', tag: 'REFRIGERANTE', price: 6, category: 'drink', image: photo('photo-1554866585-cd94860890b7'), description: '350 ml, bem gelada.' },
  { name: 'Guaraná Antarctica', tag: 'REFRIGERANTE', price: 6, category: 'drink', image: 'https://cdn.jsdelivr.net/gh/tiagocarvalhoUx/cardapio-hambuguer@master/public/assets/refri-2.webp', description: '350 ml, bem gelado.' },
  { name: 'Coca-Cola Zero', tag: 'REFRIGERANTE', price: 6, category: 'drink', image: local('coca-zero.webp'), description: '350 ml, sem açúcar e bem gelada.' },
  { name: 'H2OH! Limão', tag: 'REFRIGERANTE', price: 7, category: 'drink', image: local('h2o.webp'), description: '500 ml, leve e refrescante.' },
  { name: 'Suco de Laranja', tag: 'NATURAL', price: 10, category: 'drink', image: photo('photo-1613478223719-2ab802602423'), description: '300 ml, preparado na hora.' },
  { name: 'Suco de Maracujá', tag: 'NATURAL', price: 10, category: 'drink', image: local('suco-maracuja.webp'), description: '300 ml, cremoso e refrescante.' },
  { name: 'Limonada da Casa', tag: 'ESPECIAL', price: 12, category: 'drink', image: photo('photo-1621263764928-df1444c5e859'), description: '400 ml, limão siciliano, hortelã e gelo.' },
  { name: 'Heineken Long Neck', tag: 'CERVEJA PREMIUM', price: 12, category: 'drink', image: photo('photo-1608270586620-248524c67de9'), description: '330 ml, puro malte e trincando.' },
  { name: 'Corona Extra', tag: 'CERVEJA PREMIUM', price: 13, category: 'drink', image: photo('photo-1674770637078-22980292371f'), description: '330 ml, com limão se quiser.' },
  { name: 'IPA Artesanal', tag: 'CERVEJA PREMIUM', price: 16, category: 'drink', image: photo('photo-1608270586620-248524c67de9'), description: '355 ml, notas cítricas e amargor equilibrado.' },
]
