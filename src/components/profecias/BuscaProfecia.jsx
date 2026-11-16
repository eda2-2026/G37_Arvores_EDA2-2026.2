import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { chaveDaProfecia, normalizarTexto, SEPARADOR_CHAVE } from '../../lib/arvore/normalizarChave';
import { staggerContainer, fadeUp } from '../../lib/motionVariants';
import { nomeDoDeus } from './nomes';
import { CardShell, ProfeciaDestaque, botaoClass, inputClass, labelClass } from './ui';

const LIMITE_SUGESTOES = 8;

function buscarIguais(arvore, texto) {
  const exata = arvore.buscar(chaveDaProfecia(texto));
  if (exata) return [exata];
  return arvore.buscarPorPrefixo(normalizarTexto(texto) + SEPARADOR_CHAVE).map((entrada) => entrada.valor);
}

function Sugestao({ id, profecia, tamanhoPrefixo, ativa, onEscolher, onPassar }) {
  const username = profecia.username;
  return (
    <li
      id={id}
      role="option"
      aria-selected={ativa}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onEscolher(profecia)}
      onMouseEnter={onPassar}
      className={`flex cursor-pointer items-baseline justify-between gap-3 rounded-lg px-3 py-2 text-sm transition ${
        ativa ? 'bg-fdd-gold-light/60' : 'hover:bg-fdd-gold-light/30'
      }`}
    >
      <span className="truncate">
        <strong className="font-semibold text-fdd-gold-dark">{username.slice(0, tamanhoPrefixo)}</strong>
        {username.slice(tamanhoPrefixo)}
      </span>
      <span className="shrink-0 text-xs text-fdd-ink/60">
        {profecia.nome_exibicao} · {nomeDoDeus(profecia.parente_divino)}
      </span>
    </li>
  );
}

export default function BuscaProfecia({ indice }) {
  const { arvore } = indice;
  const listaId = useId();
  const [texto, setTexto] = useState('');
  const [aberta, setAberta] = useState(false);
  const [ativa, setAtiva] = useState(-1);
  const [resultado, setResultado] = useState(null);

  const prefixo = normalizarTexto(texto);
  const sugestoes = prefixo ? arvore.buscarPorPrefixo(prefixo, LIMITE_SUGESTOES).map((entrada) => entrada.valor) : [];
  const mostrarSugestoes = aberta && sugestoes.length > 0;

  function escolher(profecia) {
    setTexto(profecia.username);
    setAberta(false);
    setAtiva(-1);
    setResultado({ tipo: 'achou', profecias: [profecia] });
  }

  function handleChange(event) {
    setTexto(event.target.value);
    setAberta(true);
    setAtiva(-1);
    setResultado(null);
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setAberta(true);
      setAtiva((atual) => Math.min(atual + 1, sugestoes.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setAtiva((atual) => Math.max(atual - 1, -1));
    } else if (event.key === 'Escape') {
      setAberta(false);
      setAtiva(-1);
    }
  }

  function handleBuscar(event) {
    event.preventDefault();
    if (mostrarSugestoes && sugestoes[ativa]) {
      escolher(sugestoes[ativa]);
      return;
    }
    if (!prefixo) return;

    const iguais = buscarIguais(arvore, texto);
    setAberta(false);
    setAtiva(-1);
    setResultado(iguais.length > 0 ? { tipo: 'achou', profecias: iguais } : { tipo: 'nada' });
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex w-full flex-col gap-8">
      <motion.div variants={fadeUp} className="w-full">
        <CardShell>
          <form onSubmit={handleBuscar} className="flex flex-col gap-3">
            <label className={labelClass} htmlFor="usernameBusca">
              Nome de usuário
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="usernameBusca"
                type="text"
                role="combobox"
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={mostrarSugestoes}
                aria-controls={listaId}
                aria-activedescendant={mostrarSugestoes && ativa >= 0 ? `${listaId}-${ativa}` : undefined}
                value={texto}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setAberta(true)}
                onBlur={() => setAberta(false)}
                placeholder="comece a digitar, ex: ana"
                className={`${inputClass} flex-1`}
              />
              <button type="submit" className={botaoClass}>
                Buscar
              </button>
            </div>

            {mostrarSugestoes && (
              <ul
                id={listaId}
                role="listbox"
                aria-label="Sugestões de username"
                className="flex flex-col gap-0.5 rounded-xl border-2 border-fdd-gold-dark/30 bg-white/60 p-1.5"
              >
                {sugestoes.map((profecia, i) => (
                  <Sugestao
                    key={profecia.username}
                    id={`${listaId}-${i}`}
                    profecia={profecia}
                    tamanhoPrefixo={texto.trim().length}
                    ativa={i === ativa}
                    onEscolher={escolher}
                    onPassar={() => setAtiva(i)}
                  />
                ))}
              </ul>
            )}

            {aberta && prefixo && sugestoes.length === 0 && (
              <p className="text-xs text-fdd-ink/60">Nenhum username começa com "{texto.trim()}".</p>
            )}

            <p className="text-xs text-fdd-ink/50">
              Maiúsculas e acentos são ignorados. As sugestões vêm da árvore AVL, por busca de prefixo.
            </p>
          </form>
        </CardShell>
      </motion.div>

      {resultado?.tipo === 'achou' && resultado.profecias.length === 1 && (
        <ProfeciaDestaque key={resultado.profecias[0].username} profecia={resultado.profecias[0]} />
      )}

      {resultado?.tipo === 'achou' && resultado.profecias.length > 1 && (
        <motion.div variants={fadeUp} className="w-full">
          <CardShell>
            <p className="text-sm">
              Há {resultado.profecias.length} profecias com esse nome, escritas de jeitos diferentes. Qual delas?
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {resultado.profecias.map((profecia) => (
                <button
                  key={profecia.username}
                  type="button"
                  onClick={() => escolher(profecia)}
                  className="rounded-full border-2 border-fdd-gold-dark/40 px-4 py-1.5 text-sm transition hover:border-fdd-gold hover:bg-fdd-gold-light/40"
                >
                  @{profecia.username} <span className="text-fdd-ink/60">({profecia.nome_exibicao})</span>
                </button>
              ))}
            </div>
          </CardShell>
        </motion.div>
      )}

      {resultado?.tipo === 'nada' && (
        <motion.p variants={fadeUp} className="text-center text-sm text-fdd-cream-dark">
          Nenhuma profecia encontrada com esse nome! Lembre-se que é seu username.
        </motion.p>
      )}
    </motion.div>
  );
}
