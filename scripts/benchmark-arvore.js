import { performance } from 'node:perf_hooks';
import { ArvoreAVL } from '../src/lib/arvore/ArvoreAVL.js';

const TAMANHOS = [1_000, 10_000, 100_000];
const CONSULTAS = 1_000;
const POR_PAGINA = 8;
const LIMITE_PREFIXO = 8;
const ORCAMENTO_MS = 400;
const LETRAS = 'abcdefghijklmnopqrstuvwxyz';

function criarAleatorio(semente) {
  let estado = semente >>> 0;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gerarUsernames(n, aleatorio) {
  const usernames = new Set();
  while (usernames.size < n) {
    const tamanho = 4 + Math.floor(aleatorio() * 9);
    let username = '';
    for (let i = 0; i < tamanho; i++) username += LETRAS[Math.floor(aleatorio() * LETRAS.length)];
    usernames.add(username);
  }
  return [...usernames];
}

function sortear(lista, quantidade, aleatorio) {
  return Array.from({ length: quantidade }, () => lista[Math.floor(aleatorio() * lista.length)]);
}

class BuscaSequencial {
  constructor() {
    this.itens = [];
  }

  inserir(chave) {
    this.itens.push(chave);
  }

  contem(chave) {
    for (let i = 0; i < this.itens.length; i++) {
      if (this.itens[i] === chave) return true;
    }
    return false;
  }

  prefixo(prefixo, limite) {
    const achados = [];
    for (let i = 0; i < this.itens.length; i++) {
      if (this.itens[i].startsWith(prefixo)) achados.push(this.itens[i]);
    }
    return achados.sort().slice(0, limite);
  }

  pagina(inicio, quantidade) {
    return [...this.itens].sort().slice(inicio, inicio + quantidade);
  }
}

class ArrayOrdenado {
  constructor() {
    this.itens = [];
  }

  #primeiroMaiorOuIgual(chave) {
    let baixo = 0;
    let alto = this.itens.length;
    while (baixo < alto) {
      const meio = (baixo + alto) >>> 1;
      if (this.itens[meio] < chave) baixo = meio + 1;
      else alto = meio;
    }
    return baixo;
  }

  inserir(chave) {
    const i = this.#primeiroMaiorOuIgual(chave);
    if (this.itens[i] === chave) return;
    this.itens.splice(i, 0, chave);
  }

  contem(chave) {
    return this.itens[this.#primeiroMaiorOuIgual(chave)] === chave;
  }

  prefixo(prefixo, limite) {
    const achados = [];
    for (let i = this.#primeiroMaiorOuIgual(prefixo); i < this.itens.length; i++) {
      if (!this.itens[i].startsWith(prefixo) || achados.length >= limite) break;
      achados.push(this.itens[i]);
    }
    return achados;
  }

  pagina(inicio, quantidade) {
    return this.itens.slice(inicio, inicio + quantidade);
  }
}

class IndiceAVL {
  constructor() {
    this.arvore = new ArvoreAVL();
  }

  inserir(chave) {
    this.arvore.inserir(chave, chave);
  }

  contem(chave) {
    return this.arvore.contem(chave);
  }

  prefixo(prefixo, limite) {
    return this.arvore.buscarPorPrefixo(prefixo, limite).map((entrada) => entrada.chave);
  }

  pagina(inicio, quantidade) {
    const primeira = this.arvore.kEsimo(inicio);
    if (!primeira) return [];
    const chaves = [];
    for (const entrada of this.arvore.percorrerAPartirDe(primeira.chave)) {
      chaves.push(entrada.chave);
      if (chaves.length === quantidade) break;
    }
    return chaves;
  }
}

const ESTRUTURAS = [
  { nome: 'Busca sequencial', Classe: BuscaSequencial },
  { nome: 'Array ordenado', Classe: ArrayOrdenado },
  { nome: 'Árvore AVL', Classe: IndiceAVL },
];

function construir(Classe, usernames) {
  const estrutura = new Classe();
  const inicio = performance.now();
  for (const username of usernames) estrutura.inserir(username);
  return { estrutura, ms: performance.now() - inicio };
}

function medirPorOperacao(operacao, entradas) {
  for (let i = 0; i < Math.min(20, entradas.length); i++) operacao(entradas[i]);

  let feitas = 0;
  const inicio = performance.now();
  let decorrido = 0;
  while (feitas < entradas.length && decorrido < ORCAMENTO_MS) {
    operacao(entradas[feitas]);
    feitas += 1;
    decorrido = performance.now() - inicio;
  }
  return (decorrido * 1000) / feitas;
}

function formatarMs(ms) {
  if (ms >= 1000) return `${(ms / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} s`;
  return `${ms.toLocaleString('pt-BR', { maximumFractionDigits: ms < 10 ? 2 : 0 })} ms`;
}

function formatarUs(us) {
  if (us >= 1000) return `${(us / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ms`;
  return `${us.toLocaleString('pt-BR', { maximumFractionDigits: us < 10 ? 2 : 0 })} µs`;
}

function conferir(construidas, consultas) {
  const assinatura = ({ estrutura }) =>
    JSON.stringify([
      consultas.exatas.slice(0, 50).map((chave) => estrutura.contem(chave)),
      consultas.prefixos.slice(0, 50).map((prefixo) => estrutura.prefixo(prefixo, LIMITE_PREFIXO)),
      consultas.paginas.slice(0, 20).map((inicio) => estrutura.pagina(inicio, POR_PAGINA)),
    ]);
  const referencia = assinatura(construidas[0]);
  return construidas.every((construida) => assinatura(construida) === referencia);
}

function imprimirTabela(cabecalho, linhas) {
  console.log(`| ${cabecalho.join(' | ')} |`);
  console.log(`|${cabecalho.map((_, i) => (i === 0 ? '---' : '---:')).join('|')}|`);
  for (const linha of linhas) console.log(`| ${linha.join(' | ')} |`);
}

function rodar() {
  console.log(`Benchmark: ${ESTRUTURAS.map((e) => e.nome).join(' × ')}`);
  console.log(`Node ${process.version} · ${CONSULTAS} consultas por operação · página de ${POR_PAGINA} itens\n`);

  for (const n of TAMANHOS) {
    const aleatorio = criarAleatorio(n);
    const usernames = gerarUsernames(n, aleatorio);
    const existentes = new Set(usernames);
    const ausentes = gerarUsernames(CONSULTAS, criarAleatorio(n + 1)).filter((u) => !existentes.has(u));
    const consultas = {
      exatas: [...sortear(usernames, CONSULTAS / 2, aleatorio), ...sortear(ausentes, CONSULTAS / 2, aleatorio)],
      prefixos: sortear(usernames, CONSULTAS, aleatorio).map((username) => username.slice(0, 2)),
      paginas: Array.from({ length: CONSULTAS }, () => Math.floor(aleatorio() * (n - POR_PAGINA))),
    };

    const construidas = ESTRUTURAS.map(({ Classe }) => construir(Classe, usernames));
    const linhas = [
      ['Inserir as n chaves, uma por vez (total)', ...construidas.map(({ ms }) => formatarMs(ms))],
      [
        'Busca exata (por consulta)',
        ...construidas.map(({ estrutura }) =>
          formatarUs(medirPorOperacao((chave) => estrutura.contem(chave), consultas.exatas)),
        ),
      ],
      [
        `Autocomplete: prefixo, até ${LIMITE_PREFIXO} (por consulta)`,
        ...construidas.map(({ estrutura }) =>
          formatarUs(medirPorOperacao((prefixo) => estrutura.prefixo(prefixo, LIMITE_PREFIXO), consultas.prefixos)),
        ),
      ],
      [
        `Página do arquivo: ${POR_PAGINA} itens a partir da posição k (por consulta)`,
        ...construidas.map(({ estrutura }) =>
          formatarUs(medirPorOperacao((inicio) => estrutura.pagina(inicio, POR_PAGINA), consultas.paginas)),
        ),
      ],
    ];

    const avl = construidas[2].estrutura.arvore;
    console.log(`### n = ${n.toLocaleString('pt-BR')}\n`);
    imprimirTabela(['Operação', ...ESTRUTURAS.map((e) => e.nome)], linhas);
    console.log(
      `\nAltura da AVL: ${avl.altura()} (log₂ n ≈ ${Math.log2(n).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}, limite AVL ≈ ${(1.44 * Math.log2(n + 2) - 0.328).toLocaleString('pt-BR', { maximumFractionDigits: 1 })})`,
    );
    console.log(`Resultados iguais nas três estruturas: ${conferir(construidas, consultas) ? 'sim' : 'NÃO'}\n`);
  }
}

rodar();
