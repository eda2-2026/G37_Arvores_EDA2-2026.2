export function normalizarTexto(texto) {
  return texto.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export const SEPARADOR_CHAVE = '\u0000';

export function chaveDaProfecia(username) {
  return normalizarTexto(username) + SEPARADOR_CHAVE + username.trim();
}
