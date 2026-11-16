import { GODS } from '../../data/gods';
import { ORGANIZATIONS } from '../../data/orgs';

const NOMES_DEUSES = Object.fromEntries(GODS.map((deus) => [deus.id, deus.nome]));
const NOMES_ORGANIZACOES = Object.fromEntries(ORGANIZATIONS.map((org) => [org.id, org.nome]));

export function nomeDoDeus(id) {
  return NOMES_DEUSES[id] ?? id;
}

export function nomeDaOrganizacao(id) {
  return NOMES_ORGANIZACOES[id] ?? id;
}
