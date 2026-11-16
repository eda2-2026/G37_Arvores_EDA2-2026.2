import { useState } from 'react';
import { motion } from 'framer-motion';
import LaurelDivider from '../components/LaurelDivider';
import ArquivoProfecias from '../components/profecias/ArquivoProfecias';
import BuscaProfecia from '../components/profecias/BuscaProfecia';
import VisualizadorArvore from '../components/profecias/VisualizadorArvore';
import {
  CardShell,
  ProfeciaDestaque,
  botaoClass,
  botaoSecundarioClass,
  inputClass,
  labelClass,
} from '../components/profecias/ui';
import { GODS } from '../data/gods';
import { ORGANIZATIONS } from '../data/orgs';
import { gerarProfecia } from '../lib/prophecyTemplate';
import { staggerContainer, fadeUp } from '../lib/motionVariants';
import { useIndiceProfecias } from '../hooks/useIndiceProfecias';

const ABAS = [
  { id: 'gerar', rotulo: 'Gerar' },
  { id: 'buscar', rotulo: 'Buscar' },
  { id: 'arquivo', rotulo: 'Arquivo' },
  { id: 'arvore', rotulo: 'Árvore' },
];

function ModeTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border-2 px-4 py-2 font-display text-sm tracking-wide transition sm:px-6 ${
        active
          ? 'border-fdd-gold-dark bg-fdd-gold text-fdd-ink'
          : 'border-fdd-gold-dark/40 bg-transparent text-fdd-cream-dark hover:border-fdd-gold hover:text-fdd-gold-light'
      }`}
    >
      {children}
    </button>
  );
}

function GerarProfecia({ indice, onVerNaArvore }) {
  const [username, setUsername] = useState('');
  const [nomeExibicao, setNomeExibicao] = useState('');
  const [parenteDivino, setParenteDivino] = useState(GODS[0].id);
  const [organizacao, setOrganizacao] = useState(ORGANIZATIONS[0].id);
  const [erro, setErro] = useState(null);
  const [resultado, setResultado] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const user = username.trim();
    const nome = nomeExibicao.trim();
    if (!user || !nome) {
      setErro('Preencha o username e o nome de exibição.');
      return;
    }

    if (indice.existe(user)) {
      setResultado(null);
      setErro('Já existe uma profecia registrada com esse nome de usuário! Use a aba Buscar.');
      return;
    }

    const profecia = {
      username: user,
      nome_exibicao: nome,
      parente_divino: parenteDivino,
      organizacao,
      texto_profecia: gerarProfecia({ nomeExibicao: nome, parenteDivino, organizacao }),
      created_at: new Date().toISOString(),
    };
    indice.adicionarProfecia(profecia);

    setErro(null);
    setResultado(profecia);
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex w-full flex-col gap-8">
      <motion.div variants={fadeUp} className="w-full">
        <CardShell>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className={labelClass} htmlFor="username">
                Username (único)
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="ex: filho-de-atena-23"
                className={`${inputClass} mt-2`}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="nomeExibicao">
                Nome do semideus
              </label>
              <input
                id="nomeExibicao"
                type="text"
                value={nomeExibicao}
                onChange={(event) => setNomeExibicao(event.target.value)}
                placeholder="Como as Moiras devem te chamar"
                className={`${inputClass} mt-2`}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="parenteDivino">
                  Parente divino
                </label>
                <select
                  id="parenteDivino"
                  value={parenteDivino}
                  onChange={(event) => setParenteDivino(event.target.value)}
                  className={`${inputClass} mt-2`}
                >
                  {GODS.map((deus) => (
                    <option key={deus.id} value={deus.id}>
                      {deus.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="organizacao">
                  Organização
                </label>
                <select
                  id="organizacao"
                  value={organizacao}
                  onChange={(event) => setOrganizacao(event.target.value)}
                  className={`${inputClass} mt-2`}
                >
                  {ORGANIZATIONS.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {erro && <p className="text-sm text-red-700">{erro}</p>}

            <button type="submit" className={`${botaoClass} mt-2`}>
              Consultar as Moiras
            </button>
          </form>
        </CardShell>
      </motion.div>

      {resultado && (
        <ProfeciaDestaque key={resultado.username} profecia={resultado}>
          <button type="button" onClick={onVerNaArvore} className={`${botaoSecundarioClass} mt-6`}>
            Ver onde ela entrou na árvore →
          </button>
        </ProfeciaDestaque>
      )}
    </motion.div>
  );
}

export default function Profecias() {
  const [modo, setModo] = useState('gerar');
  const indice = useIndiceProfecias();

  return (
    <motion.div
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-10 py-8"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={fadeUp} className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-fdd-gold-light">Os fios do destino</p>
        <h1 className="mt-3 font-display text-3xl text-fdd-cream fdd-glow-text sm:text-4xl">Profecias</h1>
        <LaurelDivider className="mx-auto mt-4 h-6 w-40 text-fdd-gold" />
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-fdd-cream-dark">
          Registre a profecia de um semideus junto às Moiras, consulte uma já registrada pelo username, percorra o
          arquivo em ordem alfabética ou veja a árvore AVL que organiza tudo.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 sm:gap-4">
        {ABAS.map((aba) => (
          <ModeTab key={aba.id} active={modo === aba.id} onClick={() => setModo(aba.id)}>
            {aba.rotulo}
          </ModeTab>
        ))}
      </motion.div>

      {modo === 'gerar' && <GerarProfecia indice={indice} onVerNaArvore={() => setModo('arvore')} />}
      {modo === 'buscar' && <BuscaProfecia indice={indice} />}
      {modo === 'arquivo' && <ArquivoProfecias indice={indice} />}
      {modo === 'arvore' && <VisualizadorArvore indice={indice} />}
    </motion.div>
  );
}
