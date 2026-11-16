import { motion } from 'framer-motion';
import GreekFrame from '../GreekFrame';
import LaurelDivider from '../LaurelDivider';
import { fadeUp } from '../../lib/motionVariants';
import { nomeDaOrganizacao, nomeDoDeus } from './nomes';

export const inputClass =
  'w-full rounded-xl border-2 border-fdd-gold-dark/40 bg-fdd-cream/90 px-4 py-2 text-sm text-fdd-ink placeholder:text-fdd-ink/40 focus:border-fdd-gold focus:outline-none';

export const labelClass = 'block text-xs uppercase tracking-[0.2em] text-fdd-gold-dark';

export const botaoClass =
  'inline-flex items-center justify-center rounded-full border-2 border-fdd-gold-dark bg-fdd-gold px-6 py-2 font-display text-sm tracking-wide text-fdd-ink transition hover:bg-fdd-gold-light disabled:cursor-not-allowed disabled:opacity-60';

export const botaoSecundarioClass =
  'inline-flex items-center justify-center gap-1 rounded-full border-2 border-fdd-gold-dark/40 px-4 py-1.5 text-xs text-fdd-ink transition hover:border-fdd-gold hover:bg-fdd-gold-light/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-fdd-gold-dark/40 disabled:hover:bg-transparent';

export function CardShell({ children }) {
  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-fdd-cream p-6 text-fdd-ink shadow-2xl shadow-black/50 sm:p-10">
      <GreekFrame thickness={12} tile={24} className="text-fdd-gold" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function ProfeciaDestaque({ profecia, children }) {
  return (
    <motion.div variants={fadeUp} className="w-full">
      <CardShell>
        <div className="flex flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-fdd-gold-dark">
            A profecia de {profecia.nome_exibicao}
          </p>
          <p className="mt-2 text-xs text-fdd-ink/60">
            @{profecia.username} · {nomeDoDeus(profecia.parente_divino)} · {nomeDaOrganizacao(profecia.organizacao)}
          </p>
          <LaurelDivider className="mx-auto mt-4 h-5 w-32 text-fdd-gold-dark" />
          <p className="mt-6 max-w-2xl font-display text-lg leading-relaxed text-fdd-ink sm:text-xl">
            "{profecia.texto_profecia}"
          </p>
          {children}
        </div>
      </CardShell>
    </motion.div>
  );
}
