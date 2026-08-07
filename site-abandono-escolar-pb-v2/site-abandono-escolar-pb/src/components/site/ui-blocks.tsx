import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Secao({
  id,
  etiqueta,
  titulo,
  descricao,
  children,
  className,
}: {
  id?: string;
  etiqueta?: string;
  titulo: string;
  descricao?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-7xl px-5 py-12", className)}>
      <div className="max-w-3xl">
        {etiqueta && (
          <span className="inline-flex rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-secondary-foreground">
            {etiqueta}
          </span>
        )}
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{titulo}</h2>
        {descricao && <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{descricao}</p>}
      </div>
      <div className="mt-7">{children}</div>
    </section>
  );
}

export function Kpi({
  rotulo,
  valor,
  detalhe,
  tom = "neutro",
}: {
  rotulo: string;
  valor: string;
  detalhe?: string;
  tom?: "neutro" | "bom" | "alerta" | "critico";
}) {
  const cores = {
    neutro: "text-foreground",
    bom: "text-good",
    alerta: "text-warn",
    critico: "text-danger",
  } as const;
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{rotulo}</p>
      <p className={cn("mt-2 font-display text-2xl font-semibold tabular-nums sm:text-3xl", cores[tom])}>{valor}</p>
      {detalhe && <p className="mt-1 text-xs text-muted-foreground">{detalhe}</p>}
    </div>
  );
}

export function Painel({
  titulo,
  subtitulo,
  children,
  className,
}: {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="mb-4">
        <h3 className="font-display text-base font-semibold">{titulo}</h3>
        {subtitulo && <p className="mt-0.5 text-xs text-muted-foreground">{subtitulo}</p>}
      </div>
      {children}
    </div>
  );
}
