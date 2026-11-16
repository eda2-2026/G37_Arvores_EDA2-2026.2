import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUp } from '../../lib/motionVariants';
import { nomeDaOrganizacao, nomeDoDeus } from './nomes';
import { CardShell, ProfeciaDestaque, botaoSecundarioClass } from './ui';

const POR_PAGINA = 8;
const LETRAS = 'abcdefghijklmnopqrstuvwxyz'.split('');

function lerPagina(arvore, pagina) {
  const primeira = arvore.kEsimo(pagina * POR_PAGINA);
  if (!primeira) return [];

  const itens = [];
  for (const entrada of arvore.percorrerAPartirDe(primeira.chave)) {
    itens.push(entrada);
    if (itens.length === POR_PAGINA) break;
  }
  return itens;
}

function paginasVisiveis(atual, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const inicio = Math.max(1, Math.min(atual - 1, total - 4));
  const fim = Math.min(total - 2, inicio + 2);
  const paginas = [0];
  if (inicio > 1) paginas.push('…inicio');
  for (let p = inicio; p <= fim; p++) paginas.push(p);
  if (fim < total - 2) paginas.push('…fim');
  paginas.push(total - 1);
  return paginas;
}

function BotaoPagina({ ativa, onClick, children, rotulo }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      aria-current={ativa ? 'page' : undefined}
      className={`min-w-9 rounded-full border-2 px-3 py-1 text-xs transition ${
        ativa
          ? 'border-fdd-gold-dark bg-fdd-gold text-fdd-ink'
          : 'border-fdd-gold-dark/40 text-fdd-ink hover:border-fdd-gold hover:bg-fdd-gold-light/40'
      }`}
    >
      {children}
    </button>
  );
}

export default function ArquivoProfecias({ indice }) {
  const { arvore } = indice;
  const [pagina, setPagina] = useState(0);
  const [aberta, setAberta] = useState(null);
  const refLeitura = useRef(null);

  const total = arvore.tamanho();
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas - 1);
  const inicio = paginaAtual * POR_PAGINA;
  const itens = lerPagina(arvore, paginaAtual);

  const profeciaAberta = aberta ? arvore.buscar(aberta) : undefined;
  const anterior = aberta ? arvore.antecessor(aberta) : null;
  const proxima = aberta ? arvore.sucessor(aberta) : null;

  useEffect(() => {
    if (aberta) refLeitura.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [aberta]);

  function abrir(chave) {
    setAberta(chave);
    setPagina(Math.floor(arvore.posicao(chave) / POR_PAGINA));
  }

  function irParaLetra(letra) {
    setPagina(Math.floor(arvore.posicao(letra) / POR_PAGINA));
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex w-full flex-col gap-8">
      {profeciaAberta && (
        <div ref={refLeitura} className="w-full scroll-mt-6">
          <ProfeciaDestaque key={aberta} profecia={profeciaAberta}>
            <p className="mt-6 text-xs text-fdd-ink/50">
              {arvore.posicao(aberta) + 1}ª de {total} em ordem alfabética
            </p>
            <div className="mt-3 flex w-full flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                disabled={!anterior}
                onClick={() => abrir(anterior.chave)}
                className={botaoSecundarioClass}
              >
                ← {anterior ? `@${anterior.valor.username}` : 'início'}
              </button>
              <button type="button" onClick={() => setAberta(null)} className={botaoSecundarioClass}>
                Fechar
              </button>
              <button
                type="button"
                disabled={!proxima}
                onClick={() => abrir(proxima.chave)}
                className={botaoSecundarioClass}
              >
                {proxima ? `@${proxima.valor.username}` : 'fim'} →
              </button>
            </div>
          </ProfeciaDestaque>
        </div>
      )}

      <motion.div variants={fadeUp} className="w-full">
        <CardShell>
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-xl text-fdd-ink">Arquivo das Moiras</h2>
              <p className="text-xs text-fdd-ink/60">
                {total} profecias · página {paginaAtual + 1} de {totalPaginas}
              </p>
            </div>

            <nav aria-label="Pular para a letra" className="flex flex-wrap gap-1">
              {LETRAS.map((letra) => {
                const existe = arvore.buscarPorPrefixo(letra, 1).length > 0;
                return (
                  <button
                    key={letra}
                    type="button"
                    disabled={!existe}
                    onClick={() => irParaLetra(letra)}
                    className="h-7 w-7 rounded-md text-xs uppercase text-fdd-gold-dark transition hover:bg-fdd-gold-light/50 disabled:text-fdd-ink/20 disabled:hover:bg-transparent"
                  >
                    {letra}
                  </button>
                );
              })}
            </nav>

            <ol className="flex flex-col divide-y divide-fdd-gold-dark/15" start={inicio + 1}>
              {itens.map(({ chave, valor }, i) => (
                <li key={chave}>
                  <button
                    type="button"
                    onClick={() => abrir(chave)}
                    className={`flex w-full items-baseline gap-3 rounded-lg px-2 py-2.5 text-left transition hover:bg-fdd-gold-light/30 ${
                      chave === aberta ? 'bg-fdd-gold-light/50' : ''
                    }`}
                  >
                    <span className="w-7 shrink-0 text-right font-mono text-xs text-fdd-ink/40">{inicio + i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">@{valor.username}</span>
                      <span className="block truncate text-xs text-fdd-ink/60">
                        {valor.nome_exibicao} · {nomeDoDeus(valor.parente_divino)} · {nomeDaOrganizacao(valor.organizacao)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <nav aria-label="Páginas do arquivo" className="flex flex-wrap items-center justify-center gap-1.5">
              <BotaoPagina rotulo="Página anterior" onClick={() => setPagina(Math.max(paginaAtual - 1, 0))}>
                ‹
              </BotaoPagina>
              {paginasVisiveis(paginaAtual, totalPaginas).map((p) =>
                typeof p === 'number' ? (
                  <BotaoPagina key={p} ativa={p === paginaAtual} rotulo={`Página ${p + 1}`} onClick={() => setPagina(p)}>
                    {p + 1}
                  </BotaoPagina>
                ) : (
                  <span key={p} className="px-1 text-xs text-fdd-ink/40">
                    …
                  </span>
                ),
              )}
              <BotaoPagina
                rotulo="Próxima página"
                onClick={() => setPagina(Math.min(paginaAtual + 1, totalPaginas - 1))}
              >
                ›
              </BotaoPagina>
            </nav>

            <p className="text-center font-mono text-[11px] text-fdd-ink/40">
              kEsimo({inicio}) + {itens.length} passos do percurso em ordem
            </p>
          </div>
        </CardShell>
      </motion.div>
    </motion.div>
  );
}
