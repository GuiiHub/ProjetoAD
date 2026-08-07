import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Kpi, Painel } from "@/components/site/ui-blocks";
import {
  GraficoTopMunicipios,
  GraficoComSem,
  GraficoQuantidadeItens,
  GraficoLocalizacao,
  GraficoCobertura,
  GraficoRede,
  GraficoInfraPorRede,
} from "@/components/site/graficos";
import {
  escolas,
  municipios,
  itensInfra,
  redes,
  filtrar,
  filtrosIniciais,
  media,
  pct,
  abandonoPorMunicipio,
  abandonoPorItem,
  abandonoPorQuantidade,
  porLocalizacao,
  porRede,
  infraPorRede,
  coberturaInfra,
  type Filtros,
  type EstadoFiltro,
  type ChaveInfra,
  type FiltroRede,
} from "@/lib/dados";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Painel interativo | Abandono Escolar na Paraíba" },
      {
        name: "description",
        content:
          "Filtre as escolas da Paraíba por município, zona rural/urbana e itens de infraestrutura como água potável, esgoto e internet.",
      },
      { property: "og:title", content: "Painel interativo | Abandono Escolar na Paraíba" },
      { property: "og:description", content: "Filtros dinâmicos de infraestrutura escolar e taxas de abandono do INEP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PainelPage,
});

const estados: { valor: EstadoFiltro; rotulo: string }[] = [
  { valor: "todas", rotulo: "Todas" },
  { valor: "com", rotulo: "Com" },
  { valor: "sem", rotulo: "Sem" },
];

function PainelPage() {
  const [f, setF] = useState<Filtros>(filtrosIniciais);
  const [pagina, setPagina] = useState(1);
  const porPagina = 25;

  const lista = useMemo(() => filtrar(escolas, f), [f]);

  const resumo = useMemo(
    () => ({
      abandono: media(lista, "abandono"),
      aprovacao: media(lista, "aprovacao"),
      reprovacao: media(lista, "reprovacao"),
      municipios: new Set(lista.map((e) => e.municipio)).size,
      top: abandonoPorMunicipio(lista, 2).slice(0, 10),
      itens: abandonoPorItem(lista),
      quantidade: abandonoPorQuantidade(lista),
      localizacao: porLocalizacao(lista),
      redes: porRede(lista),
      infraRede: infraPorRede(lista),
      cobertura: coberturaInfra(lista),
    }),
    [lista],
  );

  function setInfra(chave: ChaveInfra, valor: EstadoFiltro) {
    setPagina(1);
    setF((a) => ({ ...a, infra: { ...a.infra, [chave]: valor } }));
  }

  const totalPaginas = Math.max(1, Math.ceil(lista.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = lista.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-5 py-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">Painel interativo</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Comece com todas as escolas selecionadas. Marque <strong>Com</strong> para ver apenas escolas que possuem o item, ou{" "}
          <strong>Sem</strong> para ver apenas as que não possuem.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Filtros */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-sm font-semibold uppercase tracking-wide">Filtros</h2>
                <button
                  onClick={() => {
                    setF(filtrosIniciais);
                    setPagina(1);
                  }}
                  className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Limpar
                </button>
              </div>

              <div className="mt-5">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="municipio">
                  Município
                </label>
                <select
                  id="municipio"
                  value={f.municipio}
                  onChange={(e) => {
                    setPagina(1);
                    setF((a) => ({ ...a, municipio: e.target.value }));
                  }}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="todos">Todos os municípios</option>
                  {municipios.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-5">
                <p className="text-xs font-medium text-muted-foreground">Localização</p>
                <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg bg-secondary p-1">
                  {(["todas", "urbana", "rural"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setPagina(1);
                        setF((a) => ({ ...a, localizacao: v }));
                      }}
                      className={cn(
                        "rounded-md px-2 py-1.5 text-xs font-medium capitalize transition-colors",
                        f.localizacao === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-medium text-muted-foreground">Rede de ensino</p>
                <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1">
                  {(["todas", "estadual", "municipal", "privada"] as FiltroRede[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setPagina(1);
                        setF((a) => ({ ...a, rede: v }));
                      }}
                      className={cn(
                        "rounded-md px-2 py-1.5 text-xs font-medium capitalize transition-colors",
                        f.rede === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
                  {f.rede === "todas"
                    ? "Todas as redes somadas."
                    : redes.find((r) => r.chave === f.rede)?.descricao}
                </p>
              </div>

              <div className="mt-6 space-y-4">
                <p className="text-xs font-medium text-muted-foreground">Infraestrutura</p>
                {itensInfra.map(({ chave, rotulo, descricao }) => (
                  <div key={chave}>
                    <p className="text-sm font-medium">{rotulo}</p>
                    <p className="text-[11px] leading-snug text-muted-foreground">{descricao}</p>
                    <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg bg-secondary p-1">
                      {estados.map((e) => (
                        <button
                          key={e.valor}
                          onClick={() => setInfra(chave, e.valor)}
                          className={cn(
                            "rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                            f.infra[chave] === e.valor
                              ? e.valor === "sem"
                                ? "bg-danger text-primary-foreground shadow-sm"
                                : e.valor === "com"
                                  ? "bg-good text-primary-foreground shadow-sm"
                                  : "bg-card text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {e.rotulo}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Resultado */}
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi rotulo="Escolas filtradas" valor={lista.length.toLocaleString("pt-BR")} detalhe={`de ${escolas.length.toLocaleString("pt-BR")} escolas`} />
              <Kpi rotulo="Municípios" valor={String(resumo.municipios)} />
              <Kpi rotulo="Abandono médio" valor={pct(resumo.abandono, 2)} tom="critico" />
              <Kpi rotulo="Aprovação média" valor={pct(resumo.aprovacao, 2)} tom="bom" />
            </div>

            {lista.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
                <p className="font-display text-base font-semibold">Nenhuma escola atende a esta combinação</p>
                <p className="mt-1 text-sm text-muted-foreground">Solte algum filtro para voltar a ver resultados.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 xl:grid-cols-2">
                  <Painel titulo="Municípios com maior abandono" subtitulo="Dentro do recorte filtrado (mín. 2 escolas)">
                    {resumo.top.length ? (
                      <GraficoTopMunicipios dados={resumo.top} />
                    ) : (
                      <p className="py-10 text-center text-sm text-muted-foreground">Dados insuficientes para o ranking.</p>
                    )}
                  </Painel>
                  <Painel titulo="Cobertura de infraestrutura" subtitulo="% das escolas filtradas que possuem cada item">
                    <GraficoCobertura dados={resumo.cobertura} />
                  </Painel>
                  <Painel titulo="Abandono: tem x não tem o item" subtitulo="Média por escola (%)">
                    <GraficoComSem dados={resumo.itens} />
                  </Painel>
                  <Painel titulo="Rendimento por localização" subtitulo="Urbana x rural no recorte filtrado">
                    <GraficoLocalizacao dados={resumo.localizacao} />
                  </Painel>
                  <Painel titulo="Rendimento por rede de ensino" subtitulo="Estadual x municipal x privada no recorte filtrado">
                    <GraficoRede dados={resumo.redes} />
                  </Painel>
                  <Painel titulo="Infraestrutura por rede" subtitulo="% de escolas de cada rede que possuem o item">
                    <GraficoInfraPorRede dados={resumo.infraRede} />
                  </Painel>
                  <Painel
                    titulo="Abandono por quantidade de itens"
                    subtitulo={`0 a ${itensInfra.length} itens de infraestrutura`}
                    className="xl:col-span-2"
                  >
                    <GraficoQuantidadeItens dados={resumo.quantidade} />
                  </Painel>
                </div>

                <div className="rounded-xl border border-border bg-card">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3">
                    <h3 className="font-display text-base font-semibold">Escolas</h3>
                    <p className="text-xs text-muted-foreground">
                      Página {paginaAtual} de {totalPaginas} · {lista.length.toLocaleString("pt-BR")} escolas
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                          <th className="px-4 py-2.5 font-medium">Escola</th>
                          <th className="px-4 py-2.5 font-medium">Município</th>
                          <th className="px-4 py-2.5 font-medium">Zona</th>
                          {itensInfra.map((i) => (
                            <th key={i.chave} className="px-2 py-2.5 text-center font-medium">
                              {i.rotulo.split(" ")[0]}
                            </th>
                          ))}
                          <th className="px-4 py-2.5 text-right font-medium">Abandono</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visiveis.map((e, i) => (
                          <tr key={`${e.nome}-${i}`} className="border-b border-border/60 last:border-0 hover:bg-secondary/50">
                            <td className="px-4 py-2.5 font-medium">{e.nome}</td>
                            <td className="px-4 py-2.5 text-muted-foreground">{e.municipio}</td>
                            <td className="px-4 py-2.5 text-muted-foreground">{e.localizacao === 1 ? "Urbana" : "Rural"}</td>
                            {itensInfra.map((it) => (
                              <td key={it.chave} className="px-2 py-2.5 text-center">
                                <span
                                  className={cn(
                                    "inline-block size-2.5 rounded-full",
                                    e[it.chave] ? "bg-good" : "bg-danger/70",
                                  )}
                                  title={`${it.rotulo}: ${e[it.chave] ? "sim" : "não"}`}
                                />
                              </td>
                            ))}
                            <td className="px-4 py-2.5 text-right tabular-nums">{e.abandono === null ? "—" : `${e.abandono.toFixed(1)}%`}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-border px-5 py-3">
                    <button
                      onClick={() => setPagina((p) => Math.max(1, p - 1))}
                      disabled={paginaAtual === 1}
                      className="rounded-md border border-border px-3 py-1.5 text-xs font-medium disabled:opacity-40"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                      disabled={paginaAtual === totalPaginas}
                      className="rounded-md border border-border px-3 py-1.5 text-xs font-medium disabled:opacity-40"
                    >
                      Próxima
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
