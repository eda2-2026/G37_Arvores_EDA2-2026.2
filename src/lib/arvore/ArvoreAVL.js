export class NoAVL {
  constructor(chave, valor) {
    this.chave = chave;
    this.valor = valor;
    this.esquerda = null;
    this.direita = null;
    this.altura = 1;
    this.tamanho = 1;
  }
}

export function alturaDe(no) {
  return no ? no.altura : 0;
}

export function tamanhoDe(no) {
  return no ? no.tamanho : 0;
}

export function fatorBalanceamento(no) {
  return no ? alturaDe(no.esquerda) - alturaDe(no.direita) : 0;
}

export function atualizar(no) {
  no.altura = 1 + Math.max(alturaDe(no.esquerda), alturaDe(no.direita));
  no.tamanho = 1 + tamanhoDe(no.esquerda) + tamanhoDe(no.direita);
}

export function rotacaoDireita(y) {
  const x = y.esquerda;
  if (!x) throw new Error('rotacaoDireita: o nó não tem filho à esquerda');

  y.esquerda = x.direita;
  x.direita = y;

  atualizar(y);
  atualizar(x);
  return x;
}

export function rotacaoEsquerda(x) {
  const y = x.direita;
  if (!y) throw new Error('rotacaoEsquerda: o nó não tem filho à direita');

  x.direita = y.esquerda;
  y.esquerda = x;

  atualizar(x);
  atualizar(y);
  return y;
}

export function balancear(no, rotacoes) {
  atualizar(no);
  const fator = fatorBalanceamento(no);

  if (fator > 1) {
    if (fatorBalanceamento(no.esquerda) < 0) {
      rotacoes?.push({ caso: 'LR', chave: no.chave });
      no.esquerda = rotacaoEsquerda(no.esquerda);
    } else {
      rotacoes?.push({ caso: 'LL', chave: no.chave });
    }
    return rotacaoDireita(no);
  }

  if (fator < -1) {
    if (fatorBalanceamento(no.direita) > 0) {
      rotacoes?.push({ caso: 'RL', chave: no.chave });
      no.direita = rotacaoDireita(no.direita);
    } else {
      rotacoes?.push({ caso: 'RR', chave: no.chave });
    }
    return rotacaoEsquerda(no);
  }

  return no;
}

export function minimoNo(no) {
  if (!no) return null;
  while (no.esquerda) no = no.esquerda;
  return no;
}

export function maximoNo(no) {
  if (!no) return null;
  while (no.direita) no = no.direita;
  return no;
}

function entrada(no) {
  return no ? { chave: no.chave, valor: no.valor } : null;
}

function empilharEsquerda(no, pilha) {
  for (; no; no = no.esquerda) pilha.push(no);
}

function* continuarEmOrdem(pilha) {
  while (pilha.length > 0) {
    const no = pilha.pop();
    yield entrada(no);
    empilharEsquerda(no.direita, pilha);
  }
}

export function compararPadrao(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export class ArvoreAVL {
  constructor(comparar = compararPadrao) {
    this.comparar = comparar;
    this.raiz = null;
    this.ultimasRotacoes = [];
  }

  altura() {
    return alturaDe(this.raiz);
  }

  tamanho() {
    return tamanhoDe(this.raiz);
  }

  estaVazia() {
    return this.raiz === null;
  }

  inserir(chave, valor) {
    this.ultimasRotacoes = [];
    const tamanhoAntes = this.tamanho();
    this.raiz = this.#inserirEm(this.raiz, chave, valor);
    return this.tamanho() > tamanhoAntes;
  }

  #inserirEm(no, chave, valor) {
    if (!no) return new NoAVL(chave, valor);

    const cmp = this.comparar(chave, no.chave);
    if (cmp === 0) {
      no.valor = valor;
      return no;
    }

    if (cmp < 0) no.esquerda = this.#inserirEm(no.esquerda, chave, valor);
    else no.direita = this.#inserirEm(no.direita, chave, valor);

    return balancear(no, this.ultimasRotacoes);
  }

  remover(chave) {
    this.ultimasRotacoes = [];
    const tamanhoAntes = this.tamanho();
    this.raiz = this.#removerEm(this.raiz, chave);
    return this.tamanho() < tamanhoAntes;
  }

  #removerEm(no, chave) {
    if (!no) return null;

    const cmp = this.comparar(chave, no.chave);
    if (cmp < 0) {
      no.esquerda = this.#removerEm(no.esquerda, chave);
    } else if (cmp > 0) {
      no.direita = this.#removerEm(no.direita, chave);
    } else {
      if (!no.esquerda) return no.direita;
      if (!no.direita) return no.esquerda;

      const sucessor = minimoNo(no.direita);
      no.chave = sucessor.chave;
      no.valor = sucessor.valor;
      no.direita = this.#removerEm(no.direita, sucessor.chave);
    }

    return balancear(no, this.ultimasRotacoes);
  }

  buscar(chave) {
    const no = this.#buscarNo(chave);
    return no ? no.valor : undefined;
  }

  contem(chave) {
    return this.#buscarNo(chave) !== null;
  }

  minimo() {
    return entrada(minimoNo(this.raiz));
  }

  maximo() {
    return entrada(maximoNo(this.raiz));
  }

  *percorrerEmOrdem() {
    const pilha = [];
    empilharEsquerda(this.raiz, pilha);
    yield* continuarEmOrdem(pilha);
  }

  emOrdem() {
    return [...this.percorrerEmOrdem()];
  }

  [Symbol.iterator]() {
    return this.percorrerEmOrdem();
  }

  *percorrerAPartirDe(chave) {
    const pilha = [];
    let no = this.raiz;
    while (no) {
      if (this.comparar(no.chave, chave) >= 0) {
        pilha.push(no);
        no = no.esquerda;
      } else {
        no = no.direita;
      }
    }
    yield* continuarEmOrdem(pilha);
  }

  buscarPorPrefixo(prefixo, limite = Infinity) {
    const resultado = [];
    if (limite <= 0) return resultado;

    for (const atual of this.percorrerAPartirDe(prefixo)) {
      if (!atual.chave.startsWith(prefixo)) break;
      resultado.push(atual);
      if (resultado.length >= limite) break;
    }
    return resultado;
  }

  kEsimo(k) {
    if (!Number.isInteger(k) || k < 0 || k >= this.tamanho()) return null;

    let no = this.raiz;
    while (no) {
      const naEsquerda = tamanhoDe(no.esquerda);
      if (k < naEsquerda) {
        no = no.esquerda;
      } else if (k === naEsquerda) {
        return entrada(no);
      } else {
        k -= naEsquerda + 1;
        no = no.direita;
      }
    }
    return null;
  }

  posicao(chave) {
    let menores = 0;
    let no = this.raiz;
    while (no) {
      const cmp = this.comparar(chave, no.chave);
      if (cmp === 0) return menores + tamanhoDe(no.esquerda);
      if (cmp < 0) {
        no = no.esquerda;
      } else {
        menores += tamanhoDe(no.esquerda) + 1;
        no = no.direita;
      }
    }
    return menores;
  }

  antecessor(chave) {
    let candidato = null;
    let no = this.raiz;
    while (no) {
      if (this.comparar(no.chave, chave) < 0) {
        candidato = no;
        no = no.direita;
      } else {
        no = no.esquerda;
      }
    }
    return entrada(candidato);
  }

  sucessor(chave) {
    let candidato = null;
    let no = this.raiz;
    while (no) {
      if (this.comparar(no.chave, chave) > 0) {
        candidato = no;
        no = no.esquerda;
      } else {
        no = no.direita;
      }
    }
    return entrada(candidato);
  }

  #buscarNo(chave) {
    let no = this.raiz;
    while (no) {
      const cmp = this.comparar(chave, no.chave);
      if (cmp === 0) return no;
      no = cmp < 0 ? no.esquerda : no.direita;
    }
    return null;
  }
}
