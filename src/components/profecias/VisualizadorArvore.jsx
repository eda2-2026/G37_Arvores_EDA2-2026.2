import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { alturaDe, fatorBalanceamento } from '../../lib/arvore/ArvoreAVL';
import { SEPARADOR_CHAVE } from '../../lib/arvore/normalizarChave';
import { staggerContainer, fadeUp } from '../../lib/motionVariants';
import { CardShell, botaoSecundarioClass } from './ui';

const ESPACO_X = 60;
const ESPACO_Y = 76;
const MARGEM_X = 44;
const MARGEM_Y = 44;
const RAIO = 17;
const MAX_ROTULO = 9;
const ZOOM_MINIMO = 0.1;
const ZOOM_MAXIMO = 1.6;

const DESCRICOES = {
  LL: 'pendia para a esquerda (fator +2) e o filho esquerdo também. Rotação simples à direita.',
  RR: 'pendia para a direita (fator −2) e o filho direito também. Rotação simples à esquerda.',
  LR: 'pendia para a esquerda, mas o filho esquerdo pendia para a direita. Rotação à esquerda no filho, depois à direita no nó.',
  RL: 'pendia para a direita, mas o filho direito pendia para a esquerda. Rotação à direita no filho, depois à esquerda no nó.',
};

function montarDesenho(raiz) {
  const nos = [];
  const arestas = [];
  let coluna = 0;

  function visitar(no, nivel) {
    if (!no) return null;
    const esquerda = visitar(no.esquerda, nivel + 1);
    const item = { no, x: MARGEM_X + coluna * ESPACO_X, y: MARGEM_Y + nivel * ESPACO_Y };
    coluna += 1;
    const direita = visitar(no.direita, nivel + 1);
    if (esquerda) arestas.push({ de: item, para: esquerda });
    if (direita) arestas.push({ de: item, para: direita });
    nos.push(item);
    return item;
  }

  visitar(raiz, 0);
  return {
    nos,
    arestas,
    largura: Math.max(coluna - 1, 0) * ESPACO_X + 2 * MARGEM_X,
    altura: Math.max(alturaDe(raiz) - 1, 0) * ESPACO_Y + 2 * MARGEM_Y + 16,
  };
}

function usernameDe(chave) {
  return chave.slice(chave.indexOf(SEPARADOR_CHAVE) + 1);
}

function abreviar(texto) {
  return texto.length > MAX_ROTULO ? `${texto.slice(0, MAX_ROTULO - 1)}…` : texto;
}

function formatarFator(fator) {
  if (fator > 0) return `+${fator}`;
  if (fator < 0) return `−${-fator}`;
  return '0';
}

function formatarNumero(valor) {
  return valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}

function NoDesenhado({ item, inserido, caso, selecionado, onSelecionar }) {
  const { no, x, y } = item;
  const fator = fatorBalanceamento(no);
  const username = usernameDe(no.chave);

  let preenchimento = 'fill-white';
  if (inserido) preenchimento = 'fill-fdd-gold';
  else if (fator !== 0) preenchimento = 'fill-fdd-gold-light/40';

  let contorno = 'stroke-fdd-gold-dark';
  if (caso) contorno = 'stroke-red-700';
  if (selecionado) contorno = 'stroke-fdd-ink';

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${username}, altura ${no.altura}, fator ${fator}`}
      aria-pressed={selecionado}
      onClick={onSelecionar}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelecionar();
        }
      }}
      className="cursor-pointer outline-none focus-visible:[&>circle]:stroke-fdd-ink"
    >
      <title>{username}</title>
      <circle
        cx={x}
        cy={y}
        r={RAIO}
        className={`${preenchimento} ${contorno} transition-colors`}
        strokeWidth={caso || selecionado ? 3 : 1.5}
      />
      <text x={x} y={y + 4} textAnchor="middle" className="fill-fdd-ink text-[12px] font-semibold">
        {formatarFator(fator)}
      </text>
      <text
        x={x + RAIO + 1}
        y={y - RAIO + 3}
        className="fill-fdd-ink/60 stroke-fdd-cream text-[9px]"
        strokeWidth={3}
        paintOrder="stroke"
      >
        h{no.altura}
      </text>
      <text
        x={x}
        y={y + RAIO + 13}
        textAnchor="middle"
        className="fill-fdd-ink stroke-fdd-cream text-[10px]"
        strokeWidth={3}
        paintOrder="stroke"
      >
        {abreviar(username)}
      </text>
      {caso && (
        <g>
          <rect x={x - 14} y={y - RAIO - 19} width={28} height={14} rx={7} className="fill-red-700" />
          <text x={x} y={y - RAIO - 9} textAnchor="middle" className="fill-white text-[9px] font-bold">
            {caso}
          </text>
        </g>
      )}
    </g>
  );
}

function Legenda() {
  const itens = [
    ['fill-white stroke-fdd-gold-dark', 'balanceado (fator 0)'],
    ['fill-fdd-gold-light/40 stroke-fdd-gold-dark', 'pende para um lado (±1)'],
    ['fill-fdd-gold stroke-fdd-gold-dark', 'última inserção'],
    ['fill-white stroke-red-700', 'estava desbalanceado e foi rotacionado'],
  ];
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-fdd-ink/70">
      {itens.map(([classe, texto]) => (
        <li key={texto} className="flex items-center gap-1.5">
          <svg width="14" height="14" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5" className={classe} strokeWidth="2" />
          </svg>
          {texto}
        </li>
      ))}
      <li>número no nó = fator de balanceamento (esq − dir) · h = altura</li>
    </ul>
  );
}

export default function VisualizadorArvore({ indice }) {
  const { arvore, ultimaInsercao } = indice;
  const [zoom, setZoom] = useState(1);
  const [selecionada, setSelecionada] = useState(null);
  const refRolagem = useRef(null);

  const desenho = montarDesenho(arvore.raiz);
  const casos = new Map((ultimaInsercao?.rotacoes ?? []).map((rotacao) => [rotacao.chave, rotacao.caso]));
  const chaveFoco = ultimaInsercao?.chave ?? arvore.raiz?.chave;
  const focoX = desenho.nos.find((item) => item.no.chave === chaveFoco)?.x ?? 0;
  const noSelecionado = desenho.nos.find((item) => item.no.chave === selecionada)?.no;

  const n = arvore.tamanho();
  const alturaMinima = n > 0 ? Math.ceil(Math.log2(n + 1)) : 0;
  const limiteAVL = 1.44 * Math.log2(n + 2) - 0.328;

  useEffect(() => {
    const container = refRolagem.current;
    if (container) container.scrollLeft = focoX * zoom - container.clientWidth / 2;
  }, [focoX, zoom]);

  function mudarZoom(fator) {
    setZoom((atual) => Math.min(ZOOM_MAXIMO, Math.max(ZOOM_MINIMO, atual * fator)));
  }

  function ajustar() {
    const largura = refRolagem.current?.clientWidth ?? desenho.largura;
    setZoom(Math.min(1, Math.max(ZOOM_MINIMO, largura / desenho.largura)));
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex w-full flex-col gap-8">
      <motion.div variants={fadeUp} className="w-full">
        <CardShell>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-xl text-fdd-ink">A árvore das profecias</h2>
              <p className="text-xs text-fdd-ink/60">
                {n} nós · altura {arvore.altura()} · mínima possível {alturaMinima} · limite AVL ≈{' '}
                {formatarNumero(limiteAVL)}
              </p>
            </div>

            <div className="rounded-xl border-2 border-fdd-gold-dark/20 bg-white/50 p-3 text-sm">
              {ultimaInsercao ? (
                <>
                  <p>
                    Última inserção: <strong>@{usernameDe(ultimaInsercao.chave)}</strong>
                  </p>
                  {ultimaInsercao.rotacoes.length === 0 ? (
                    <p className="mt-1 text-xs text-fdd-ink/70">
                      Nenhuma rotação: todos os fatores do caminho continuaram entre −1 e +1.
                    </p>
                  ) : (
                    <ul className="mt-1 flex flex-col gap-1 text-xs text-fdd-ink/80">
                      {ultimaInsercao.rotacoes.map((rotacao) => (
                        <li key={`${rotacao.caso}-${rotacao.chave}`}>
                          <span className="mr-1.5 rounded-full bg-red-700 px-2 py-0.5 font-bold text-white">
                            {rotacao.caso}
                          </span>
                          o nó <strong>@{usernameDe(rotacao.chave)}</strong> {DESCRICOES[rotacao.caso]}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p className="text-xs text-fdd-ink/70">
                  Registre uma profecia na aba Gerar e volte aqui para ver onde ela entrou e se precisou de rotação.
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => mudarZoom(1 / 1.25)} className={botaoSecundarioClass} aria-label="Diminuir zoom">
                −
              </button>
              <span className="w-12 text-center font-mono text-xs text-fdd-ink/60">{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => mudarZoom(1.25)} className={botaoSecundarioClass} aria-label="Aumentar zoom">
                +
              </button>
              <button type="button" onClick={ajustar} className={botaoSecundarioClass}>
                Ver inteira
              </button>
              <button type="button" onClick={() => setZoom(1)} className={botaoSecundarioClass}>
                100%
              </button>
            </div>

            <div
              ref={refRolagem}
              className="fdd-scrollbar overflow-x-auto rounded-xl border-2 border-fdd-gold-dark/20 bg-fdd-cream"
            >
              <svg
                width={desenho.largura * zoom}
                height={desenho.altura * zoom}
                viewBox={`0 0 ${desenho.largura} ${desenho.altura}`}
                role="group"
                aria-label="Desenho da árvore AVL"
                className="block"
              >
                {desenho.arestas.map(({ de, para }) => (
                  <line
                    key={`${de.no.chave}-${para.no.chave}`}
                    x1={de.x}
                    y1={de.y}
                    x2={para.x}
                    y2={para.y}
                    className="stroke-fdd-gold-dark/50"
                    strokeWidth={1.5}
                  />
                ))}
                {desenho.nos.map((item) => (
                  <NoDesenhado
                    key={item.no.chave}
                    item={item}
                    inserido={item.no.chave === ultimaInsercao?.chave}
                    caso={casos.get(item.no.chave)}
                    selecionado={item.no.chave === selecionada}
                    onSelecionar={() => setSelecionada(item.no.chave === selecionada ? null : item.no.chave)}
                  />
                ))}
              </svg>
            </div>

            <Legenda />

            {noSelecionado && (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl border-2 border-fdd-gold-dark/20 bg-white/50 p-3 text-xs sm:grid-cols-3">
                <div className="col-span-2 sm:col-span-3">
                  <dt className="text-fdd-ink/50">Chave</dt>
                  <dd className="break-all font-mono">{noSelecionado.chave.replace(SEPARADOR_CHAVE, '␀')}</dd>
                </div>
                <div>
                  <dt className="text-fdd-ink/50">Altura</dt>
                  <dd className="font-mono">{noSelecionado.altura}</dd>
                </div>
                <div>
                  <dt className="text-fdd-ink/50">Fator de balanceamento</dt>
                  <dd className="font-mono">
                    {alturaDe(noSelecionado.esquerda)} − {alturaDe(noSelecionado.direita)} ={' '}
                    {formatarFator(fatorBalanceamento(noSelecionado))}
                  </dd>
                </div>
                <div>
                  <dt className="text-fdd-ink/50">Tamanho da subárvore</dt>
                  <dd className="font-mono">{noSelecionado.tamanho}</dd>
                </div>
                <div>
                  <dt className="text-fdd-ink/50">Posição em ordem</dt>
                  <dd className="font-mono">
                    {arvore.posicao(noSelecionado.chave) + 1}ª de {n}
                  </dd>
                </div>
                <div>
                  <dt className="text-fdd-ink/50">Filho esquerdo</dt>
                  <dd className="truncate">{noSelecionado.esquerda ? `@${usernameDe(noSelecionado.esquerda.chave)}` : '—'}</dd>
                </div>
                <div>
                  <dt className="text-fdd-ink/50">Filho direito</dt>
                  <dd className="truncate">{noSelecionado.direita ? `@${usernameDe(noSelecionado.direita.chave)}` : '—'}</dd>
                </div>
              </dl>
            )}
          </div>
        </CardShell>
      </motion.div>
    </motion.div>
  );
}
