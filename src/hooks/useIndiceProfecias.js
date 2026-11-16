import { useCallback, useState } from 'react';
import { ArvoreAVL } from '../lib/arvore/ArvoreAVL';
import { chaveDaProfecia } from '../lib/arvore/normalizarChave';
import { PROFECIAS_LOCAIS } from '../data/profeciasLocais';

function montarArvore(profecias) {
  const arvore = new ArvoreAVL();
  for (const profecia of profecias) {
    arvore.inserir(chaveDaProfecia(profecia.username), profecia);
  }
  return arvore;
}

export function useIndiceProfecias() {
  const [arvore] = useState(() => montarArvore(PROFECIAS_LOCAIS));
  const [versao, setVersao] = useState(0);
  const [ultimaInsercao, setUltimaInsercao] = useState(null);

  const existe = useCallback((username) => arvore.contem(chaveDaProfecia(username)), [arvore]);

  const adicionarProfecia = useCallback(
    (profecia) => {
      const chave = chaveDaProfecia(profecia.username);
      const nova = arvore.inserir(chave, profecia);
      setUltimaInsercao({ chave, rotacoes: [...arvore.ultimasRotacoes] });
      setVersao((atual) => atual + 1);
      return nova;
    },
    [arvore],
  );

  return { arvore, versao, ultimaInsercao, existe, adicionarProfecia };
}
