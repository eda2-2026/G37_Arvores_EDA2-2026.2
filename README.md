# Árvore AVL no Filhos do Destino — G37

**Disciplina:** Estruturas de Dados 2 (2026.2)<br>
**Conteúdo:** Árvores de busca balanceadas<br>
**Grupo:** G37

## Alunos

| Matrícula | Aluno |
|---|---|
| 231011382 | Gabriel Sampaio Fae |

## Sobre

Este trabalho implementa uma **árvore AVL** do zero, em JavaScript, e a usa
num projeto real: o [Filhos do Destino Quiz](https://github.com/Faehzin/FDDQuiz),
site do universo de RPG *Filhos do Destino* (React + Vite + Supabase).

O código do site foi copiado do commit `0d33691` do repositório original, que
não é alterado por este trabalho. A documentação original do site está em
[docs/README-FDDQuiz.md](docs/README-FDDQuiz.md).

## Onde a árvore entra

### O problema hoje

A página `/profecias` deixa cada jogador registrar uma profecia com um
`username` único (tabela `profecias` no Supabase) e consultá-la depois na aba
"Buscar". Essa consulta tem três limitações:

1. **Só aceita o nome exato.** `fetchProphecyByUsername()` faz
   `.eq('username', ...)`. Se o jogador erra uma letra ou não lembra se usou
   maiúscula, recebe "nenhuma profecia encontrada".
2. **Cada busca vai ao banco.** Todo clique em "Buscar" é uma ida e volta ao
   Supabase.
3. **Não dá pra navegar.** Não há como ver as profecias já registradas, em
   ordem, nem passar de uma para a próxima.

### Por que uma árvore de busca

A análise anterior do projeto ([docs/analise-algoritmos-busca.md](docs/analise-algoritmos-busca.md))
não encontrou uso para árvores de busca porque procurava dados *hierárquicos*
nas listas fixas do site (16 deuses, 5 organizações). As profecias são um caso
diferente: a coleção **cresce com o uso**, tem uma **chave ordenável**
(`username`) e precisa de consultas que dependem de **ordem**, não só de
igualdade.

| Necessidade | Hash (`Map`/objeto) | Array ordenado + busca binária | Árvore AVL |
|---|---|---|---|
| Busca exata | O(1) | O(log n) | O(log n) |
| Inserir uma profecia nova | O(1) | O(n), desloca os elementos | O(log n) |
| Autocomplete por prefixo | O(n), varre tudo | O(log n + k) | O(log n + k) |
| Listar em ordem alfabética | O(n log n), ordena toda vez | O(n) | O(n), percurso em ordem |
| Pular para a página p | não suporta | O(1) | O(log n), com tamanho da subárvore |
| Profecia anterior / próxima | não suporta | O(log n) | O(log n) |

*k* é o número de resultados devolvidos.

O hash só resolve igualdade. O array ordenado resolve as consultas, mas paga
O(n) a cada inserção. A árvore balanceada mantém todas as operações em tempo
logarítmico (mais o tamanho da resposta) mesmo com inserções acontecendo.

### Por que AVL e não rubro-negra

O uso é **dominado por leitura**: cada jogador registra uma profecia uma vez,
mas o índice é consultado a cada tecla do autocomplete e a cada página do
arquivo. A AVL é balanceada de forma mais rígida (altura até ~1,44·log₂ n,
contra ~2·log₂ n da rubro-negra), então as buscas passam por menos nós. O custo
extra dela, mais rotações ao inserir e remover, pesa pouco quando há poucas
escritas. Os quatro casos de rotação (LL, RR, LR, RL) também são fáceis de
mostrar na apresentação.

## Funcionalidade nova: Arquivo das Moiras

Um índice das profecias em memória, mantido numa árvore AVL, que traz quatro
melhorias para a página `/profecias`:

1. **Busca com autocomplete.** Na aba "Buscar", as sugestões aparecem enquanto
   o jogador digita, por consulta de prefixo na árvore, sem ir ao banco a cada
   tecla. A busca passa a ignorar maiúsculas, minúsculas e acentos.
2. **Aba "Arquivo".** Lista todas as profecias em ordem alfabética de
   username, com paginação. O salto para qualquer página usa o k-ésimo
   elemento da árvore. Ao abrir uma profecia, os botões "anterior" e "próxima"
   navegam pelo antecessor e pelo sucessor.
3. **Atualização na hora.** Quando alguém registra uma profecia na aba "Gerar",
   ela é inserida na árvore e já aparece no arquivo e no autocomplete, sem
   recarregar a página.
4. **Visualizador da árvore.** Na aba "Árvore", desenha a árvore atual com a
   altura e o fator de balanceamento de cada nó e destaca as rotações feitas na
   última inserção. É a parte didática, usada na apresentação.

**De onde vêm os dados.** Tudo roda localmente, sem Supabase. Ao abrir
`/profecias`, a árvore é montada a partir de profecias de exemplo guardadas no
próprio projeto (`src/data/profeciasLocais.js`), e as registradas na aba
"Gerar" entram nela em memória. Elas somem ao sair da página ou recarregar.
A página não lê nem grava nada no banco do site em produção, e
`src/lib/supabaseClient.js` não é alterado.

**Chave da árvore.** A chave é o `username` normalizado (minúsculas, sem
acentos, sem espaços nas pontas), com o `username` original como desempate. No
banco, `Ana` e `ana` são usernames diferentes e podem existir juntos, então
eles não podem virar a mesma chave na árvore.

## Operações da árvore

A árvore fica em `src/lib/arvore/ArvoreAVL.js`, sem dependências e sem React,
para poder ser usada fora da página também, como no benchmark. Cada nó guarda chave, valor, altura e
tamanho da subárvore.

| Operação | O que faz | Complexidade |
|---|---|---|
| `inserir(chave, valor)` | Insere e rebalanceia (rotações LL, RR, LR, RL) | O(log n) |
| `remover(chave)` | Remove e rebalanceia | O(log n) |
| `buscar(chave)` | Busca exata | O(log n) |
| `buscarPorPrefixo(prefixo, limite)` | Chaves que começam com o prefixo, em ordem | O(log n + k) |
| `emOrdem()` | Percurso em ordem (alfabética) | O(n) |
| `percorrerAPartirDe(chave)` | Percurso em ordem a partir da primeira chave ≥ `chave` | O(log n + k) |
| `kEsimo(k)` | k-ésima menor chave (k começa em 0), usada na paginação | O(log n) |
| `posicao(chave)` | Quantas chaves são menores que esta | O(log n) |
| `antecessor(chave)` / `sucessor(chave)` | Vizinhos em ordem | O(log n) |
| `altura()` / `tamanho()` | Métricas para o visualizador e o benchmark | O(1) |

A interface não usa `remover`, porque o site não apaga profecias. A operação
está no escopo por fazer parte do tipo abstrato.

## Escopo

Cada tarefa corresponde a um ou mais commits. Todas foram feitas.

- [x] 1. Commit inicial do repositório
- [x] 2. Importação do FDDQuiz (cópia do commit `0d33691`)
- [x] 3. README com a proposta, a funcionalidade nova e o escopo
- [x] 4. Estrutura base da AVL: nó (chave, valor, altura, tamanho), fator de balanceamento e rotações simples à esquerda e à direita
- [x] 5. Inserção com rebalanceamento (casos LL, RR, LR e RL)
- [x] 6. Busca exata, mínimo, máximo e percurso em ordem
- [x] 7. Remoção com rebalanceamento
- [x] 8. Consultas ordenadas: prefixo, k-ésimo, posição, antecessor e sucessor
- [x] 9. Dados locais: profecias de exemplo em `src/data/profeciasLocais.js`, sem Supabase
- [x] 10. Hook `useIndiceProfecias`, que monta a árvore ao abrir a página e insere as profecias registradas na aba "Gerar"
- [x] 11. Autocomplete na aba "Buscar"
- [x] 12. Aba "Arquivo": listagem alfabética paginada, com navegação anterior/próxima
- [x] 13. Visualizador da árvore, com altura, fator de balanceamento e rotações
- [x] 14. Benchmark: AVL × busca sequencial × array ordenado, para n = 10³, 10⁴ e 10⁵
- [x] 15. README final com os resultados do benchmark e o vídeo da apresentação no YouTube

### Arquivos

```
src/lib/arvore/ArvoreAVL.js                     # a árvore (JS puro, sem React)
src/lib/arvore/normalizarChave.js               # minúsculas, sem acento, sem espaços nas pontas
src/hooks/useIndiceProfecias.js                 # monta a árvore e registra a última inserção
src/data/profeciasLocais.js                     # profecias de exemplo (tudo local)
src/components/profecias/BuscaProfecia.jsx      # aba Buscar, com autocomplete
src/components/profecias/ArquivoProfecias.jsx   # aba Arquivo, paginada
src/components/profecias/VisualizadorArvore.jsx # aba Árvore, o desenho da AVL
src/components/profecias/ui.jsx, nomes.js       # peças visuais e nomes compartilhados
src/pages/Profecias.jsx                         # a página, com as quatro abas
scripts/benchmark-arvore.js                     # comparação de desempenho
```

## Benchmark

`npm run benchmark` compara três formas de guardar os usernames, com as mesmas
operações que a página usa:

- **Busca sequencial:** um array na ordem de chegada. Inserir é um `push`;
  todo o resto percorre o array inteiro, e o que depende de ordem precisa
  ordenar a cada consulta.
- **Array ordenado:** busca binária para achar a posição, e `splice` para
  inserir, que desloca os elementos seguintes.
- **Árvore AVL:** a de `src/lib/arvore/ArvoreAVL.js`.

Os usernames são strings aleatórias de 4 a 12 letras, geradas com semente fixa,
então toda execução usa os mesmos dados. A busca exata mistura 500 usernames que
existem e 500 que não existem; o autocomplete usa as duas primeiras letras de um
username existente; a página do arquivo começa numa posição k sorteada. Antes
de imprimir, o script confere se as três estruturas devolveram os mesmos
resultados.

Resultados numa execução com Node v24 no Windows (os tempos variam de máquina
para máquina, mas as proporções se mantêm):

**n = 1.000** (altura da AVL: 12)

| Operação | Busca sequencial | Array ordenado | Árvore AVL |
|---|---:|---:|---:|
| Inserir as n chaves, uma por vez (total) | 0,11 ms | 0,61 ms | 1,85 ms |
| Busca exata (por consulta) | 2,14 µs | 0,29 µs | 0,48 µs |
| Autocomplete: prefixo, até 8 (por consulta) | 8,75 µs | 0,52 µs | 3,12 µs |
| Página do arquivo: 8 itens a partir de k (por consulta) | 134 µs | 0,28 µs | 1,45 µs |

**n = 10.000** (altura da AVL: 16)

| Operação | Busca sequencial | Array ordenado | Árvore AVL |
|---|---:|---:|---:|
| Inserir as n chaves, uma por vez (total) | 0,49 ms | 5,5 ms | 5,92 ms |
| Busca exata (por consulta) | 18 µs | 0,37 µs | 0,46 µs |
| Autocomplete: prefixo, até 8 (por consulta) | 37 µs | 0,28 µs | 1,21 µs |
| Página do arquivo: 8 itens a partir de k (por consulta) | 1,9 ms | 0,08 µs | 1,05 µs |

**n = 100.000** (altura da AVL: 20)

| Operação | Busca sequencial | Array ordenado | Árvore AVL |
|---|---:|---:|---:|
| Inserir as n chaves, uma por vez (total) | 4,75 ms | 341 ms | 73 ms |
| Busca exata (por consulta) | 178 µs | 0,51 µs | 0,81 µs |
| Autocomplete: prefixo, até 8 (por consulta) | 342 µs | 0,63 µs | 2,28 µs |
| Página do arquivo: 8 itens a partir de k (por consulta) | 54,4 ms | 0,4 µs | 3,95 µs |

**O que os números mostram**

- **Busca sequencial:** só ganha na inserção, que é um `push`. A busca exata
  cresce junto com n (2 µs, 18 µs, 178 µs), e a página do arquivo precisa
  ordenar tudo a cada consulta: 54 ms com 10⁵ profecias.
- **Array ordenado:** é o mais rápido nas leituras, porque a busca binária e o
  `slice` trabalham em memória contígua. O custo aparece na inserção: cada
  chave nova desloca, em média, metade do array. De 10⁴ para 10⁵ chaves, o
  tempo para montar o índice subiu 62 vezes (5,5 ms para 341 ms), enquanto o
  da AVL subiu 12 vezes (5,9 ms para 73 ms).
- **Árvore AVL:** nas leituras fica alguns microssegundos atrás do array
  ordenado, porque segue ponteiros em vez de índices, mas quase não piora com
  n: a busca exata foi de 0,48 µs para 0,81 µs com 100 vezes mais dados. A
  altura medida (12, 16 e 20) ficou sempre abaixo do limite teórico da AVL
  (cerca de 1,44·log₂ n, isto é, 14, 19 e 24).

Para o site, a AVL é o meio-termo certo: as consultas custam microssegundos e
continuam baratas com o crescimento, e registrar uma profecia nova não exige
mover nenhum elemento.

## Apresentação

Vídeo da apresentação no YouTube: [assistir](https://youtu.be/HGqc_M8NboU)

## Como rodar

```bash
npm install
npm run dev        # servidor de desenvolvimento (Vite); a página é /profecias
npm run benchmark  # benchmark AVL × busca sequencial × array ordenado
```

Não precisa de `.env.local` nem de Supabase: a funcionalidade da árvore roda
toda localmente. O resto do site se comporta como no original e, sem
`.env.local`, só avisa no console que o banco está desligado.

## Licença

MIT, herdada do projeto original. Ver [LICENSE](LICENSE).
