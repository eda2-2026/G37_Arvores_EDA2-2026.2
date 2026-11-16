# Árvore AVL no Filhos do Destino — G37

**Disciplina:** Estruturas de Dados 2 (2026.2)<br>
**Conteúdo:** Árvores de busca balanceadas<br>
**Grupo:** G37

## Alunos

| Matrícula | Aluno |
|---|---|
| _a preencher_ | _a preencher_ |

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
4. **Visualizador da árvore.** Desenha a árvore atual com a altura e o fator de
   balanceamento de cada nó e destaca as rotações feitas na última inserção.
   É a parte didática, usada na apresentação.

**De onde vêm os dados.** Ao abrir `/profecias`, o site busca no Supabase só os
campos leves de cada profecia (`username`, `nome_exibicao`, `parente_divino`,
`organizacao`, `created_at`) e monta a árvore. O texto completo continua sendo
buscado só quando o jogador abre uma profecia. Sem Supabase configurado, o site
usa um conjunto de profecias de demonstração, para funcionar offline.

**Chave da árvore.** A chave é o `username` normalizado (minúsculas, sem
acentos, sem espaços nas pontas), com o `username` original como desempate. No
banco, `Ana` e `ana` são usernames diferentes e podem existir juntos, então
eles não podem virar a mesma chave na árvore.

## Operações da árvore

A árvore fica em `src/lib/arvore/ArvoreAVL.js`, sem dependências e sem React,
para poder ser testada com Node puro. Cada nó guarda chave, valor, altura e
tamanho da subárvore.

| Operação | O que faz | Complexidade |
|---|---|---|
| `inserir(chave, valor)` | Insere e rebalanceia (rotações LL, RR, LR, RL) | O(log n) |
| `remover(chave)` | Remove e rebalanceia | O(log n) |
| `buscar(chave)` | Busca exata | O(log n) |
| `buscarPorPrefixo(prefixo, limite)` | Chaves que começam com o prefixo, em ordem | O(log n + k) |
| `emOrdem()` | Percurso em ordem (alfabética) | O(n) |
| `kEsimo(k)` | k-ésima menor chave, usada na paginação | O(log n) |
| `posicao(chave)` | Quantas chaves são menores que esta | O(log n) |
| `antecessor(chave)` / `sucessor(chave)` | Vizinhos em ordem | O(log n) |
| `altura()` / `tamanho()` | Métricas para o visualizador e os testes | O(1) |

A interface não usa `remover`, porque o site não apaga profecias. A operação
está no escopo por fazer parte do tipo abstrato e é coberta pelos testes.

## Escopo

Cada tarefa corresponde a um commit. As marcadas já foram feitas.

- [x] 1. Commit inicial do repositório
- [x] 2. Importação do FDDQuiz (cópia do commit `0d33691`)
- [x] 3. README com a proposta, a funcionalidade nova e o escopo
- [x] 4. Estrutura base da AVL: nó (chave, valor, altura, tamanho), fator de balanceamento e rotações simples à esquerda e à direita
- [ ] 5. Inserção com rebalanceamento (casos LL, RR, LR e RL)
- [ ] 6. Busca exata, mínimo, máximo e percurso em ordem
- [ ] 7. Remoção com rebalanceamento
- [ ] 8. Consultas ordenadas: prefixo, k-ésimo, posição, antecessor e sucessor
- [ ] 9. Testes automatizados (`node --test`) das invariantes da árvore: ordem de BST, |fator de balanceamento| ≤ 1, alturas e tamanhos corretos depois de inserções e remoções aleatórias
- [ ] 10. Carga dos dados: `fetchAllProphecies()` paginado no Supabase e profecias de demonstração para uso offline
- [ ] 11. Hook `useIndiceProfecias`, que monta a árvore ao abrir a página e insere as profecias novas
- [ ] 12. Autocomplete na aba "Buscar"
- [ ] 13. Aba "Arquivo": listagem alfabética paginada, com navegação anterior/próxima
- [ ] 14. Visualizador da árvore, com altura, fator de balanceamento e rotações
- [ ] 15. Benchmark: AVL × busca sequencial × array ordenado, para n = 10³, 10⁴ e 10⁵
- [ ] 16. README final com os resultados do benchmark, screenshots e roteiro da apresentação

### Arquivos previstos

```
src/lib/arvore/ArvoreAVL.js        # a árvore (JS puro, sem React)
src/lib/arvore/normalizarChave.js  # minúsculas, sem acento, sem espaços nas pontas
src/hooks/useIndiceProfecias.js    # carrega as profecias e monta a árvore
src/components/profecias/          # autocomplete, arquivo e visualizador
src/data/profeciasDemo.js          # profecias de demonstração (offline)
tests/arvoreAVL.test.js            # testes das invariantes
scripts/benchmark-arvore.js        # comparação de desempenho
```

## Como rodar

```bash
npm install
npm run dev     # servidor de desenvolvimento (Vite)
npm test        # testes da árvore (disponível a partir da tarefa 9)
```

Para ligar o Supabase, crie um `.env.local` na raiz com `VITE_SUPABASE_URL` e
`VITE_SUPABASE_ANON_KEY` (detalhes em [docs/README-FDDQuiz.md](docs/README-FDDQuiz.md)).
Sem ele, o site funciona normalmente, só sem gravar nem consultar o banco.

## Licença

MIT, herdada do projeto original. Ver [LICENSE](LICENSE).
