import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Visão geral" },
  { to: "/painel", label: "Painel interativo" },
  { to: "/metodologia", label: "Metodologia" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
            PB
          </span>
          <span className="leading-tight">
            <span className="block font-display text-sm font-semibold">Abandono Escolar na Paraíba</span>
            <span className="block text-[11px] text-muted-foreground">Censo Escolar + Taxas de Rendimento · INEP</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:font-medium data-[status=active]:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
