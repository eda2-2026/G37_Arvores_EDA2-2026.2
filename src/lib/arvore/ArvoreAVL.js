/**
 * Árvore AVL — estrutura base.
 *
 * Convenções usadas em todo o arquivo:
 * - Altura: um nó folha tem altura 1; uma subárvore vazia (null) tem altura 0.
 * - Fator de balanceamento = altura(esquerda) − altura(direita).
 *   Positivo: o nó pende para a esquerda. Negativo: pende para a direita.
 *   Numa AVL válida, todo nó tem fator −1, 0 ou 1.
 * - Tamanho: quantidade de nós da subárvore, contando o próprio nó. É o que
 *   permite achar o k-ésimo elemento e a posição de uma chave em O(log n).
 *
 * As funções de nó (alturaDe, tamanhoDe, fatorBalanceamento, atualizar e as
 * rotações) ficam fora da classe para poderem ser testadas e reaproveitadas
 * pelo visualizador sem depender de uma árvore inteira.
 */

export class NoAVL {
  /**
   * @param {*} chave
   * @param {*} valor
   */
  constructor(chave, valor) {
    this.chave = chave;
    this.valor = valor;
    /** @type {NoAVL | null} */
    this.esquerda = null;
    /** @type {NoAVL | null} */
    this.direita = null;
    this.altura = 1;
    this.tamanho = 1;
  }
}

/** @param {NoAVL | null} no */
export function alturaDe(no) {
  return no ? no.altura : 0;
}

/** @param {NoAVL | null} no */
export function tamanhoDe(no) {
  return no ? no.tamanho : 0;
}

/** @param {NoAVL | null} no */
export function fatorBalanceamento(no) {
  return no ? alturaDe(no.esquerda) - alturaDe(no.direita) : 0;
}

/**
 * Recalcula a altura e o tamanho de `no` a partir dos filhos. Os filhos
 * precisam estar atualizados, por isso é sempre chamada de baixo para cima.
 *
 * @param {NoAVL} no
 */
export function atualizar(no) {
  no.altura = 1 + Math.max(alturaDe(no.esquerda), alturaDe(no.direita));
  no.tamanho = 1 + tamanhoDe(no.esquerda) + tamanhoDe(no.direita);
}

/**
 * Rotação simples à direita em torno de `y`. Corrige um nó que pende para a
 * esquerda (caso LL). Combinada com uma rotação à esquerda no filho, resolve
 * o caso LR.
 *
 *         y                x
 *        / \              / \
 *       x   C    ──►     A   y
 *      / \                  / \
 *     A   B                B   C
 *
 * A sequência em ordem (A, x, B, y, C) não muda; só a forma da árvore muda.
 * Devolve a nova raiz da subárvore (`x`), que quem chamou precisa religar
 * ao pai.
 *
 * @param {NoAVL} y
 * @returns {NoAVL}
 */
export function rotacaoDireita(y) {
  const x = y.esquerda;
  if (!x) throw new Error('rotacaoDireita: o nó não tem filho à esquerda');

  y.esquerda = x.direita;
  x.direita = y;

  // y desceu para baixo de x, então é atualizado primeiro.
  atualizar(y);
  atualizar(x);
  return x;
}

/**
 * Rotação simples à esquerda em torno de `x`. Espelho de `rotacaoDireita`:
 * corrige um nó que pende para a direita (caso RR) e, combinada com uma
 * rotação à direita no filho, resolve o caso RL.
 *
 *       x                    y
 *      / \                  / \
 *     A   y      ──►       x   C
 *        / \              / \
 *       B   C            A   B
 *
 * @param {NoAVL} x
 * @returns {NoAVL}
 */
export function rotacaoEsquerda(x) {
  const y = x.direita;
  if (!y) throw new Error('rotacaoEsquerda: o nó não tem filho à direita');

  x.direita = y.esquerda;
  y.esquerda = x;

  // x desceu para baixo de y, então é atualizado primeiro.
  atualizar(x);
  atualizar(y);
  return y;
}

/**
 * Comparador padrão: ordena com `<` e `>`. Para strings, isso é a ordem dos
 * códigos de caractere (não `localeCompare`), a mesma que a busca por
 * prefixo vai assumir.
 *
 * @returns {number} negativo se a < b, zero se iguais, positivo se a > b
 */
export function compararPadrao(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export class ArvoreAVL {
  /**
   * @param {(a: *, b: *) => number} [comparar] negativo se a < b, zero se
   *   iguais, positivo se a > b.
   */
  constructor(comparar = compararPadrao) {
    this.comparar = comparar;
    /** @type {NoAVL | null} */
    this.raiz = null;
  }

  /** Altura da árvore (0 se vazia). O(1). */
  altura() {
    return alturaDe(this.raiz);
  }

  /** Quantidade de chaves guardadas. O(1). */
  tamanho() {
    return tamanhoDe(this.raiz);
  }

  estaVazia() {
    return this.raiz === null;
  }
}
