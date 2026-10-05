import { Ornament, Pendants } from "./Ornament";

/** The opening of every inner page: a small eyebrow, a large engraved title, and a line of italic. */
export function PageHeader({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: React.ReactNode; subtitle?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <header className="relative mx-auto max-w-4xl px-5 pt-44 pb-14 text-center sm:px-8 sm:pt-56">
      <Pendants count={11} className="absolute inset-x-6 top-20 opacity-50 sm:inset-x-0" />
      {eyebrow && <p className="label text-gold">{eyebrow}</p>}
      <h1 className="display mt-5 text-5xl text-parchment sm:text-7xl">{title}</h1>
      {subtitle && <p className="mx-auto mt-6 max-w-2xl text-xl text-mist italic">{subtitle}</p>}
      {children}
      <Ornament className="mt-12" />
    </header>
  );
}
