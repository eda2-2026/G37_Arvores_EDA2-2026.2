import { useCallback, useState } from 'react';
import { ArvoreAVL } from '../lib/arvore/ArvoreAVL';
import { chaveDaProfecia } from '../lib/arvore/normalizarChave';
import { PROFECIAS_LOCAIS } from '../data/profeciasLocais';

/**
 * @param {Array<{username: string}>} profecias
 * @returns {ArvoreAVL}
 */
function montarArvore(profecias) {
  const arvore = new ArvoreAVL();
  for (const profecia of profecias) {
    arvore.inserir(chaveDaProfecia(profecia.username), profecia);
  }
  return arvore;
}

/**
 * Índice das profecias numa árvore AVL, com chave `chaveDaProfecia(username)`
 * e a profecia inteira como valor.
 *
 * Tudo é local: a árvore começa com as profecias de `PROFECIAS_LOCAIS` e as
 * registradas na página entram nela só em memória, até sair da página ou
 * recarregar. Nada é lido nem gravado no Supabase.
 *
 * A árvore é um objeto mutável que vive enquanto a página está aberta. Como
 * o React não percebe mudanças dentro dela, `versao` aumenta a cada
 * inserção; quem deriva dados da árvore (sugestões, páginas do arquivo) usa
 * `versao` como dependência para recalcular.
 */
export function useIndiceProfecias() {
  const [arvore] = useState(() => montarArvore(PROFECIAS_LOCAIS));
  const [versao, setVersao] = useState(0);

  /** Se já existe uma profecia com exatamente esse username. O(log n). */
  const existe = useCallback((username) => arvore.contem(chaveDaProfecia(username)), [arvore]);

  /**
   * Insere uma profecia no índice. O(log n).
   *
   * @param {{username: string, nome_exibicao: string, parente_divino: string, organizacao: string, texto_profecia: string, created_at: string}} profecia
   * @returns {boolean} true se o username era novo
   */
  const adicionarProfecia = useCallback(
    (profecia) => {
      const nova = arvore.inserir(chaveDaProfecia(profecia.username), profecia);
      setVersao((atual) => atual + 1);
      return nova;
    },
    [arvore],
  );

  return { arvore, versao, existe, adicionarProfecia };
}
