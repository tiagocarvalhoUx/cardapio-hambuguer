// Resolve caminhos da pasta public/ considerando o base path do deploy
// (ex.: GitHub Pages serve o site em /cardapio-hambuguer/, não na raiz).
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
