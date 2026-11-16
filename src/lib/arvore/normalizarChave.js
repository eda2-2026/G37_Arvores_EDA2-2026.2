/**
 * Normalização usada nas chaves do índice de profecias: tira os espaços das
 * pontas, passa para minúsculas e remove os acentos. O `normalize('NFD')`
 * separa cada letra do seu acento, e a faixa U+0300–U+036F são os acentos
 * soltos que sobram.
 *
 * Ex.: "  Íris " → "iris", "Zé-do-Olimpo" → "ze-do-olimpo".
 *
 * @param {string} texto
 * @returns {string}
 */
export function normalizarTexto(texto) {
  return texto.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Separa, dentro da chave, o username normalizado do original. U+0000 é menor
 * que qualquer outro caractere, então a chave composta ordena primeiro pelo
 * username normalizado e só depois pelo original.
 */
export const SEPARADOR_CHAVE = '\u0000';

/**
 * Chave de uma profecia na árvore: username normalizado + separador +
 * username original. "Ana" e "ana" viram "ana\0Ana" e "ana\0ana": ficam
 * vizinhas na ordem alfabética, mas não colidem (no banco do site original
 * elas também são usernames diferentes).
 *
 * @param {string} username
 * @returns {string}
 */
export function chaveDaProfecia(username) {
  return normalizarTexto(username) + SEPARADOR_CHAVE + username.trim();
}
