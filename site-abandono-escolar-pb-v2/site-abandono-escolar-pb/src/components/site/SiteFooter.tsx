export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 text-sm text-muted-foreground sm:grid-cols-3">
        <div>
          <p className="font-display font-semibold text-foreground">Abandono Escolar na Paraíba</p>
          <p className="mt-1">Análise da relação entre infraestrutura escolar e abandono nos anos iniciais do Ensino Fundamental.</p>
        </div>
        <div>
          <p className="font-medium text-foreground">Fontes</p>
          <p className="mt-1">Microdados do Censo Escolar (INEP) e Taxas de Rendimento Escolar (INEP), base tratada por escola.</p>
        </div>
        <div>
          <p className="font-medium text-foreground">Equipe</p>
          <p className="mt-1">Guilherme, Sebastião e Victor — UFPB / CCSA, Ciência de Dados para Negócios.</p>
        </div>
      </div>
    </footer>
  );
}
