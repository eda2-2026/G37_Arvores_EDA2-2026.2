// Profecias de exemplo para o índice da página /profecias (árvore AVL).
//
// A funcionalidade roda toda localmente: estas profecias são o ponto de
// partida da árvore, e as registradas na aba "Gerar" entram nela só em
// memória. Nada aqui vem do Supabase nem é gravado nele.
//
// Os campos têm os mesmos nomes das colunas da tabela `profecias`, para os
// componentes da página tratarem uma profecia local e uma do banco do mesmo
// jeito. Os textos foram gerados com `gerarProfecia`
// (src/lib/prophecyTemplate.js). Os usernames incluem acentos, maiúsculas
// ("Ana" e "ana" coexistem) e prefixos em comum ("filho-de-", "ana"), que são
// os casos que a chave normalizada e a busca por prefixo precisam tratar.

export const PROFECIAS_LOCAIS = [
  {
    username: 'filho-de-atena-23',
    nome_exibicao: 'Teodoro',
    parente_divino: 'atena',
    organizacao: 'Lua-nova',
    texto_profecia:
      'Enquanto a estratégia valer mais que a força bruta e o silêncio antes da batalha for a arma mais afiada,\n Teodoro, seu fio se entrelaça com o de Lua Nova, e você lutará, para sempre, por humanos que lhe odeiam.',
    created_at: '2026-08-25T15:20:00.000Z',
  },
  {
    username: 'marina-sal',
    nome_exibicao: 'Marina',
    parente_divino: 'poseidon',
    organizacao: 'Lua-nova',
    texto_profecia:
      'Sob a fúria que dorme no fundo de todo oceano, pronta para despertar sem aviso,\n Marina, seu fio se entrelaça com o de Lua Nova, e você lutará, para sempre, por humanos que lhe odeiam.',
    created_at: '2026-08-26T19:24:00.000Z',
  },
  {
    username: 'Ana',
    nome_exibicao: 'Ana Clara',
    parente_divino: 'afrodite',
    organizacao: 'Lua-nova',
    texto_profecia:
      'Sob o feitiço que nenhum escudo detém, porque nenhuma armadura protege o que se ama,\n Ana Clara, seu fio se entrelaça com o de Lua Nova, e você lutará, para sempre, por humanos que lhe odeiam.',
    created_at: '2026-08-28T03:23:00.000Z',
  },
  {
    username: 'hades.sombrio',
    nome_exibicao: 'Plutão',
    parente_divino: 'hades',
    organizacao: '83',
    texto_profecia:
      'Sob a sombra que se estende sobre todos os vivos, lembrando que a morte é apenas o começo de outra história,\n Plutão, o Olimpo teme sua chegada, mas não será o bastante. Você cairá lutando, rodeado de pessoas que ama. Pelo menos, é um bom fim.',
    created_at: '2026-08-30T03:07:00.000Z',
  },
  {
    username: 'filha-de-hecate',
    nome_exibicao: 'Selene',
    parente_divino: 'hecate',
    organizacao: 'Anthros',
    texto_profecia:
      'Enquanto houver um enigma sem resposta e alguém disposto a decifrá-lo à luz de vela,\n Selene, seu caminho cruza com a Zeta tatuada na pele de quem jurou apagar todo vestígio do divino.',
    created_at: '2026-09-01T09:01:00.000Z',
  },
  {
    username: 'zeus-trovão',
    nome_exibicao: 'Trovão',
    parente_divino: 'zeus',
    organizacao: 'Anthros',
    texto_profecia:
      'Enquanto o raio queima mais forte sobre quem ousar desafiar a vontade do Olimpo, Trovão, seu fio se enrola com o da Anthros, e você vai lutar, para sempre, contra seus próprios irmãos e irmãs.',
    created_at: '2026-09-03T06:47:00.000Z',
  },
  {
    username: 'bruno_trovao',
    nome_exibicao: 'Bruno',
    parente_divino: 'zeus',
    organizacao: 'Lua-nova',
    texto_profecia:
      'Sob a tempestade que anuncia sua fúria, e a promessa de que nenhum mortal ou semideus escapará do que está por vir, Bruno, seu fio se entrelaça com o de Lua Nova, e você lutará, para sempre, por humanos que lhe odeiam.',
    created_at: '2026-09-05T01:06:00.000Z',
  },
  {
    username: 'ana',
    nome_exibicao: 'Ana Beatriz',
    parente_divino: 'demeter',
    organizacao: 'Anthros',
    texto_profecia:
      'Enquanto a terra continuar dando fruto para quem souber esperar a estação certa,\n Ana Beatriz, as Moiras sussurram que sua história vai se chocar com a Anthros, e nem todo sangue divino escapa dessa guerra silenciosa.',
    created_at: '2026-09-06T12:08:00.000Z',
  },
  {
    username: 'Íris',
    nome_exibicao: 'Íris',
    parente_divino: 'hermes',
    organizacao: 'Lua-nova',
    texto_profecia:
      'Sob o vento que carrega toda mensagem, toda barganha e todo segredo bem guardado,\n Íris, as Moiras te chamam para vestir a armadura de Lua Nova e responder pelo Olimpo sempre que o mundo mortal estiver em risco.',
    created_at: '2026-09-08T12:58:00.000Z',
  },
  {
    username: 'minotauro-lover',
    nome_exibicao: 'Tauro',
    parente_divino: 'dionisio',
    organizacao: 'taurinos',
    texto_profecia:
      'Enquanto a taça continuar cheia e a próxima hora importar menos que este exato instante,\n Tauro, as Moiras riem baixinho ao ver seu fio se enrolar no dos Taurinos... Nem todo destino precisa fazer sentido.',
    created_at: '2026-09-10T08:35:00.000Z',
  },
  {
    username: 'caio-do-olimpo',
    nome_exibicao: 'Caio',
    parente_divino: 'poseidon',
    organizacao: 'Anthros',
    texto_profecia:
      'Enquanto as marés se recusarem a manter a calma e o mar guardar mais segredos do que revela,\n Caio, as Moiras sussurram que sua história vai se chocar com a Anthros, e nem todo sangue divino escapa dessa guerra silenciosa.',
    created_at: '2026-09-11T12:41:00.000Z',
  },
  {
    username: 'filho-de-ares',
    nome_exibicao: 'Brás',
    parente_divino: 'ares',
    organizacao: '83',
    texto_profecia:
      'Enquanto a guerra continuar a chamar por quem ousa lutar, você perderá cada segundo de vida pensando em guerra,\n Brás, seu fio está sendo cortado antes da hora pela Legião 83, que jurou libertar todo semideus do destino que os próprios deuses escreveram.',
    created_at: '2026-09-12T16:53:00.000Z',
  },
  {
    username: 'nyx_noturna',
    nome_exibicao: 'Noite',
    parente_divino: 'nyx',
    organizacao: '83',
    texto_profecia:
      'Você é a noite da vida de todos aqueles que ama. Quando eles precisarem de você, você não estará lá. Quando eles não precisarem mais de você, você estará lá,\n Noite, seu fio está sendo cortado antes da hora pela Legião 83, que jurou libertar todo semideus do destino que os próprios deuses escreveram.',
    created_at: '2026-09-15T01:31:00.000Z',
  },
  {
    username: 'anabela',
    nome_exibicao: 'Anabela',
    parente_divino: 'nyx',
    organizacao: 'Imitheos',
    texto_profecia:
      'Enquanto as estrelas continuarem testemunhando o que ninguém mais vê,\n Anabela, as Moiras veem em você a ambição que a Imítheos cultiva: divino e mortal fundidos numa só vontade de comandar.',
    created_at: '2026-09-16T07:44:00.000Z',
  },
  {
    username: 'heitor',
    nome_exibicao: 'Heitor',
    parente_divino: 'ares',
    organizacao: 'Lua-nova',
    texto_profecia:
      'Seu sangue vermelho pulsará com fúria quando seu melhor amigo morrer por sua culpa,\n Heitor, as Moiras te chamam para vestir a armadura de Lua Nova e responder pelo Olimpo sempre que o mundo mortal estiver em risco.',
    created_at: '2026-09-18T01:49:00.000Z',
  },
  {
    username: 'yara-das-aguas',
    nome_exibicao: 'Yara',
    parente_divino: 'poseidon',
    organizacao: 'Imitheos',
    texto_profecia:
      'Sob a fúria que dorme no fundo de todo oceano, pronta para despertar sem aviso,\n Yara, o poder absoluto te chama, e a Imítheos promete que o sangue divino não deveria se curvar a ninguém.',
    created_at: '2026-09-20T17:03:00.000Z',
  },
  {
    username: 'lúcia',
    nome_exibicao: 'Lúcia',
    parente_divino: 'atena',
    organizacao: 'Imitheos',
    texto_profecia:
      'Sob o olhar frio de quem já viu todas as jogadas antes de a primeira peça se mover,\n Lúcia, as Moiras veem em você a ambição que a Imítheos cultiva: divino e mortal fundidos numa só vontade de comandar.',
    created_at: '2026-09-21T22:41:00.000Z',
  },
  {
    username: 'nike.vitoria',
    nome_exibicao: 'Vitória',
    parente_divino: 'nike',
    organizacao: 'Lua-nova',
    texto_profecia:
      'Sob o grito que ecoa mais alto que qualquer dúvida, e a certeza de que cada passo vale a pena,\n Vitória, seu fio se entrelaça com o de Lua Nova, e você lutará, para sempre, por humanos que lhe odeiam.',
    created_at: '2026-09-23T18:19:00.000Z',
  },
  {
    username: 'andré.raios',
    nome_exibicao: 'André',
    parente_divino: 'zeus',
    organizacao: '83',
    texto_profecia:
      'Enquanto o raio queima mais forte sobre quem ousar desafiar a vontade do Olimpo, André, as Moiras temem sua chegada: a Legião 83 não pede permissão para reescrever o que estava predestinado.',
    created_at: '2026-09-26T04:26:00.000Z',
  },
  {
    username: 'hefesto-fan',
    nome_exibicao: 'Bento',
    parente_divino: 'hefesto',
    organizacao: 'taurinos',
    texto_profecia:
      'Porquanto seus pés tocarem o chão e suas mãos moldarem armadilhas, você irá perder toda batalha não planejada,\n Bento, seu destino segue um caminho estranho e sagrado, onde os Taurinos veneram o minotauro como poucos ousam entender.',
    created_at: '2026-09-27T02:27:00.000Z',
  },
  {
    username: 'sofia-sabia',
    nome_exibicao: 'Sofia',
    parente_divino: 'atena',
    organizacao: 'Anthros',
    texto_profecia:
      'Enquanto a estratégia valer mais que a força bruta e o silêncio antes da batalha for a arma mais afiada,\n Sofia, as Moiras sussurram que sua história vai se chocar com a Anthros, e nem todo sangue divino escapa dessa guerra silenciosa.',
    created_at: '2026-09-28T11:29:00.000Z',
  },
  {
    username: 'iris_do_arco',
    nome_exibicao: 'Íris Matos',
    parente_divino: 'apolo',
    organizacao: 'taurinos',
    texto_profecia:
      'Enquanto o sol atravessar o céu e cada nota, verso ou visão carregar um fragmento do futuro,\n Íris Matos, seu fio se entrelaça com o dos Taurinos, e... é. Só isso.',
    created_at: '2026-09-30T06:38:00.000Z',
  },
  {
    username: 'thanatos_calmo',
    nome_exibicao: 'Caronte',
    parente_divino: 'thanatos',
    organizacao: 'Imitheos',
    texto_profecia:
      'Sob a inevitabilidade que todos tentam evitar, mas que você encara de frente,\n Caronte, o poder absoluto te chama, e a Imítheos promete que o sangue divino não deveria se curvar a ninguém.',
    created_at: '2026-10-01T21:10:00.000Z',
  },
  {
    username: 'eva-estrela',
    nome_exibicao: 'Eva',
    parente_divino: 'afrodite',
    organizacao: 'Lua-nova',
    texto_profecia:
      'Seu destino é ser amado por cada um deles, cada um com sua própria razão, mas você jamais sentirá amor por ninguém,\n Eva, as Moiras te chamam para vestir a armadura de Lua Nova e responder pelo Olimpo sempre que o mundo mortal estiver em risco.',
    created_at: '2026-10-03T14:35:00.000Z',
  },
  {
    username: 'filha-de-atena',
    nome_exibicao: 'Clio',
    parente_divino: 'atena',
    organizacao: 'Imitheos',
    texto_profecia:
      'Sob o olhar frio de quem já viu todas as jogadas antes de a primeira peça se mover,\n Clio, seu fio se entrelaça com o da Imítheos, e você vai lutar, para sempre, por quem não tem medo de ser mais que um semideus.',
    created_at: '2026-10-06T00:30:00.000Z',
  },
  {
    username: 'legiao83-forever',
    nome_exibicao: 'Rebeca',
    parente_divino: 'ares',
    organizacao: '83',
    texto_profecia:
      'Enquanto houver injustiça de pé, e um punho cerrado for resposta suficiente,\n Rebeca, o Olimpo teme sua chegada, mas não será o bastante. Você cairá lutando, rodeado de pessoas que ama. Pelo menos, é um bom fim.',
    created_at: '2026-10-08T08:39:00.000Z',
  },
  {
    username: 'dionisio-festeiro',
    nome_exibicao: 'Baco',
    parente_divino: 'dionisio',
    organizacao: 'Anthros',
    texto_profecia:
      'Sob a loucura que se esconde atrás de cada sorriso, e a alegria que desafia toda lógica,\n Baco, as Moiras sussurram que sua história vai se chocar com a Anthros, e nem todo sangue divino escapa dessa guerra silenciosa.',
    created_at: '2026-10-09T00:10:00.000Z',
  },
  {
    username: 'Zé-do-Olimpo',
    nome_exibicao: 'Zé',
    parente_divino: 'zeus',
    organizacao: 'taurinos',
    texto_profecia:
      'Enquanto o trovão ecoar sobre o Olimpo e nenhum juramento for maior que a palavra do Pai dos Deuses, Zé, seu fio se entrelaça com o dos Taurinos, e... é. Só isso.',
    created_at: '2026-10-10T18:45:00.000Z',
  },
  {
    username: 'joana_d',
    nome_exibicao: 'Joana',
    parente_divino: 'nemesis',
    organizacao: 'Anthros',
    texto_profecia:
      'Enquanto houver uma dívida a ser paga, e alguém disposto a cobrar cada centavo,\n Joana, as Moiras sussurram que sua história vai se chocar com a Anthros, e nem todo sangue divino escapa dessa guerra silenciosa.',
    created_at: '2026-10-13T08:39:00.000Z',
  },
  {
    username: 'apolo-solar',
    nome_exibicao: 'Febo',
    parente_divino: 'apolo',
    organizacao: 'Lua-nova',
    texto_profecia:
      'Sob a luz que revela o que ainda está por vir, onde arte e profecia nascem do mesmo fôlego,\n Febo, seu destino está entre os muros de Lua Nova, protegendo o que os mortais nunca saberão que precisou ser protegido.',
    created_at: '2026-10-14T17:52:00.000Z',
  },
  {
    username: 'ícaro',
    nome_exibicao: 'Ícaro',
    parente_divino: 'hefesto',
    organizacao: 'Imitheos',
    texto_profecia:
      'Sob o fogo que molda o mundo, e a paciência que transforma cada erro em aprendizado,\n Ícaro, seu fio se entrelaça com o da Imítheos, e você vai lutar, para sempre, por quem não tem medo de ser mais que um semideus.',
    created_at: '2026-10-16T12:59:00.000Z',
  },
  {
    username: 'lucas-semideus',
    nome_exibicao: 'Lucas',
    parente_divino: 'hermes',
    organizacao: 'Anthros',
    texto_profecia:
      'Enquanto a velocidade for mais importante que a força, e a astúcia mais valiosa que a coragem,\n Lucas, seu fio se enrola com o da Anthros, e você vai lutar, para sempre, contra seus próprios irmãos e irmãs.',
    created_at: '2026-10-18T04:01:00.000Z',
  },
  {
    username: 'demeter_flor',
    nome_exibicao: 'Flora',
    parente_divino: 'demeter',
    organizacao: 'Lua-nova',
    texto_profecia:
      'Enquanto a terra continuar dando fruto para quem souber esperar a estação certa,\n Flora, seu destino está entre os muros de Lua Nova, protegendo o que os mortais nunca saberão que precisou ser protegido.',
    created_at: '2026-10-20T07:48:00.000Z',
  },
  {
    username: 'gael',
    nome_exibicao: 'Gael',
    parente_divino: 'thanatos',
    organizacao: 'taurinos',
    texto_profecia:
      'No último suspiro que ninguém atravessa duas vezes, onde toda história finalmente se fecha,\n Gael, as Moiras riem baixinho ao ver seu fio se enrolar no dos Taurinos... Nem todo destino precisa fazer sentido.',
    created_at: '2026-10-21T12:53:00.000Z',
  },
  {
    username: 'nemesis-justa',
    nome_exibicao: 'Dora',
    parente_divino: 'nemesis',
    organizacao: '83',
    texto_profecia:
      'Sob a vingança que se esconde atrás de cada sorriso, e a retribuição que ninguém ousa desafiar,\n Dora, as Moiras temem sua chegada: a Legião 83 não pede permissão para reescrever o que estava predestinado.',
    created_at: '2026-10-23T23:09:00.000Z',
  },
  {
    username: 'odisseia',
    nome_exibicao: 'Penélope',
    parente_divino: 'atena',
    organizacao: 'Lua-nova',
    texto_profecia:
      'Sob a luz que revela o que ninguém mais vê, e a verdade que se esconde atrás de cada mentira,\n Penélope, seu destino está entre os muros de Lua Nova, protegendo o que os mortais nunca saberão que precisou ser protegido.',
    created_at: '2026-10-25T13:25:00.000Z',
  },
  {
    username: 'helena-de-esparta',
    nome_exibicao: 'Helena',
    parente_divino: 'afrodite',
    organizacao: 'Anthros',
    texto_profecia:
      'Enquanto houver um olhar que desperte desejo, e uma mão que se estenda para tocar o que não pode ser tocado,\n Helena, seu fio se enrola com o da Anthros, e você vai lutar, para sempre, contra seus próprios irmãos e irmãs.',
    created_at: '2026-10-26T23:45:00.000Z',
  },
  {
    username: 'mateus-forja',
    nome_exibicao: 'Mateus',
    parente_divino: 'hefesto',
    organizacao: '83',
    texto_profecia:
      'Porquanto seus pés tocarem o chão e suas mãos moldarem armadilhas, você irá perder toda batalha não planejada,\n Mateus, o Olimpo teme sua chegada, mas não será o bastante. Você cairá lutando, rodeado de pessoas que ama. Pelo menos, é um bom fim.',
    created_at: '2026-10-28T18:48:00.000Z',
  },
  {
    username: 'camila_moira',
    nome_exibicao: 'Camila',
    parente_divino: 'nyx',
    organizacao: 'Imitheos',
    texto_profecia:
      'Sob o manto da noite que guarda todo segredo até que ele esteja pronto para ser contado,\n Camila, o poder absoluto te chama, e a Imítheos promete que o sangue divino não deveria se curvar a ninguém.',
    created_at: '2026-10-30T05:37:00.000Z',
  },
  {
    username: 'filho-de-poseidon',
    nome_exibicao: 'Marinho',
    parente_divino: 'poseidon',
    organizacao: 'taurinos',
    texto_profecia:
      'Sob a fúria que dorme no fundo de todo oceano, pronta para despertar sem aviso,\n Marinho, seu fio se entrelaça com o dos Taurinos, e... é. Só isso.',
    created_at: '2026-11-01T10:45:00.000Z',
  },
  {
    username: 'hermes-veloz',
    nome_exibicao: 'Mercúrio',
    parente_divino: 'hermes',
    organizacao: 'Imitheos',
    texto_profecia:
      'Sob o vento que carrega toda mensagem, toda barganha e todo segredo bem guardado,\n Mercúrio, o poder absoluto te chama, e a Imítheos promete que o sangue divino não deveria se curvar a ninguém.',
    created_at: '2026-11-03T05:14:00.000Z',
  },
  {
    username: 'joão-pedro',
    nome_exibicao: 'João Pedro',
    parente_divino: 'hades',
    organizacao: 'Lua-nova',
    texto_profecia:
      'Nas profundezas onde nenhuma luz do Olimpo alcança, onde cada passo é contado e nada se esquece,\n João Pedro, seu fio se entrelaça com o de Lua Nova, e você lutará, para sempre, por humanos que lhe odeiam.',
    created_at: '2026-11-04T22:24:00.000Z',
  },
  {
    username: 'beatriz.m',
    nome_exibicao: 'Beatriz',
    parente_divino: 'demeter',
    organizacao: 'taurinos',
    texto_profecia:
      'Sob a colheita que recompensa o trabalho paciente, você sentirá o fruto de suas ações,\n Beatriz, as Moiras riem baixinho ao ver seu fio se enrolar no dos Taurinos... Nem todo destino precisa fazer sentido.',
    created_at: '2026-11-06T06:21:00.000Z',
  },
  {
    username: 'lua-crescente',
    nome_exibicao: 'Luna',
    parente_divino: 'hecate',
    organizacao: 'Lua-nova',
    texto_profecia:
      'Quando a magia antiga deixar de sussurrar segredos que ninguém mais entende, você ouvirá o chamado do mal,\n Luna, seu destino está entre os muros de Lua Nova, protegendo o que os mortais nunca saberão que precisou ser protegido.',
    created_at: '2026-11-08T14:46:00.000Z',
  },
  {
    username: 'davi-guerreiro',
    nome_exibicao: 'Davi',
    parente_divino: 'nike',
    organizacao: '83',
    texto_profecia:
      'Enquanto a coragem for mais valiosa que a força, e a determinação mais importante que a sorte,\n Davi, seu fio se enrola com o da Legião 83, e você vai lutar, para sempre, por quem não teme desafiar os deuses.',
    created_at: '2026-11-09T23:29:00.000Z',
  },
  {
    username: 'icarus-voa',
    nome_exibicao: 'Dédalo',
    parente_divino: 'apolo',
    organizacao: '83',
    texto_profecia:
      'Sob a luz que revela o que ainda está por vir, onde arte e profecia nascem do mesmo fôlego,\n Dédalo, o Olimpo teme sua chegada, mas não será o bastante. Você cairá lutando, rodeado de pessoas que ama. Pelo menos, é um bom fim.',
    created_at: '2026-11-11T23:58:00.000Z',
  },
  {
    username: 'tales.v',
    nome_exibicao: 'Tales',
    parente_divino: 'hermes',
    organizacao: 'taurinos',
    texto_profecia:
      'Ser rápido não vai salvar seus pais humanos. Ser esperto não vai salvar seus amigos. Ser esperto e rápido vai salvar você, e só você,\n Tales, as Moiras riem baixinho ao ver seu fio se enrolar no dos Taurinos... Nem todo destino precisa fazer sentido.',
    created_at: '2026-11-12T15:59:00.000Z',
  },
  {
    username: 'filha-do-mar',
    nome_exibicao: 'Maré',
    parente_divino: 'poseidon',
    organizacao: 'taurinos',
    texto_profecia:
      'Sob a tempestade que se forma no horizonte, a calmaria em seu peito jamais passará,\n Maré, seu fio se entrelaça com o dos Taurinos, e... é. Só isso.',
    created_at: '2026-11-14T16:55:00.000Z',
  },
];
