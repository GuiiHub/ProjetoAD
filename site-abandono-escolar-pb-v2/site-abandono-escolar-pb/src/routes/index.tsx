import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Secao, Kpi, Painel } from "@/components/site/ui-blocks";
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
  media,
  pct,
  abandonoPorMunicipio,
  abandonoPorItem,
  abandonoPorQuantidade,
  porLocalizacao,
  porRede,
  infraPorRede,
  coberturaInfra,
  municipios,
} from "@/lib/dados";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abandono Escolar na Paraíba | Infraestrutura e Evasão" },
      {
        name: "description",
        content:
          "Painel analítico com dados do INEP sobre abandono escolar nos anos iniciais do EF na Paraíba e sua relação com a infraestrutura das escolas.",
      },
      { property: "og:title", content: "Abandono Escolar na Paraíba | Infraestrutura e Evasão" },
      {
        property: "og:description",
        content: "Gráficos e filtros por município, localização, água potável, esgoto, internet, biblioteca e acessibilidade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const dados = useMemo(() => {
    const semAgua = escolas.filter((e) => !e.agua);
    return {
      total: escolas.length,
      municipios: municipios.length,
      abandono: media(escolas, "abandono"),
      aprovacao: media(escolas, "aprovacao"),
      semAgua: semAgua.length,
      abandonoSemAgua: media(semAgua, "abandono"),
      top: abandonoPorMunicipio(escolas).slice(0, 10),
      itens: abandonoPorItem(escolas),
      quantidade: abandonoPorQuantidade(escolas),
      localizacao: porLocalizacao(escolas),
      redes: porRede(escolas),
      infraRede: infraPorRede(escolas),
      cobertura: coberturaInfra(escolas),
    };
  }, []);

  const maiorImpacto = [...dados.itens].sort((a, b) => (b.diferenca ?? -99) - (a.diferenca ?? -99))[0];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="grade-fina border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
          <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            Censo Escolar + Taxas de Rendimento · INEP · Paraíba
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight sm:text-5xl">
            Onde falta infraestrutura, o abandono escolar cresce.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Um retrato de {dados.total.toLocaleString("pt-BR")} escolas paraibanas cruzando água potável, esgoto, internet,
            biblioteca e acessibilidade com as taxas de abandono dos anos iniciais do Ensino Fundamental.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/painel"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Abrir painel interativo
            </Link>
            <Link
              to="/metodologia"
              className="rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Ver metodologia
            </Link>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Kpi rotulo="Escolas analisadas" valor={dados.total.toLocaleString("pt-BR")} detalhe="Base tratada por escola" />
            <Kpi rotulo="Municípios" valor={String(dados.municipios)} detalhe="Cobertura estadual" />
            <Kpi rotulo="Abandono médio" valor={pct(dados.abandono, 2)} tom="critico" detalhe="Anos iniciais do EF" />
            <Kpi rotulo="Aprovação média" valor={pct(dados.aprovacao, 2)} tom="bom" />
            <Kpi
              rotulo="Escolas sem água potável"
              valor={dados.semAgua.toLocaleString("pt-BR")}
              tom="alerta"
              detalhe={`Abandono médio de ${pct(dados.abandonoSemAgua, 2)}`}
            />
          </div>
        </div>
      </div>

      <Secao
        etiqueta="P1"
        titulo="Onde o problema se concentra"
        descricao="Comparação das taxas médias de rendimento entre escolas urbanas e rurais."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <Painel titulo="Rendimento por localização" subtitulo="Média das taxas de abandono, reprovação e aprovação" className="lg:col-span-2">
            <GraficoLocalizacao dados={dados.localizacao} />
          </Painel>
          <div className="grid gap-4 content-start">
            {dados.localizacao.map((l) => (
              <Painel key={l.grupo} titulo={l.grupo === "Urbana" ? "Escolas urbanas" : "Escolas rurais"} subtitulo={`${l.escolas.toLocaleString("pt-BR")} escolas`}>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="font-display text-xl font-semibold text-danger tabular-nums">{l.abandono.toFixed(1)}%</p>
                    <p className="text-[11px] text-muted-foreground">Abandono</p>
                  </div>
                  <div>
                    <p className="font-display text-xl font-semibold text-warn tabular-nums">{l.reprovacao.toFixed(1)}%</p>
                    <p className="text-[11px] text-muted-foreground">Reprovação</p>
                  </div>
                  <div>
                    <p className="font-display text-xl font-semibold text-good tabular-nums">{l.aprovacao.toFixed(1)}%</p>
                    <p className="text-[11px] text-muted-foreground">Aprovação</p>
                  </div>
                </div>
              </Painel>
            ))}
          </div>
        </div>
      </Secao>

      <Secao
        etiqueta="P2"
        titulo="Municípios com maior abandono"
        descricao="Ranking pela taxa média de abandono das escolas do município (mínimo de 3 escolas com dado válido). Os cinco primeiros aparecem destacados."
      >
        <Painel titulo="Top 10 municípios" subtitulo="Taxa média de abandono (%)">
          <GraficoTopMunicipios dados={dados.top} />
        </Painel>
      </Secao>

      <Secao
        etiqueta="P3"
        titulo="Rede estadual, municipal ou privada"
        descricao="As taxas de rendimento mudam bastante conforme quem mantém a escola. Aqui comparamos abandono, reprovação e aprovação entre as três redes e a infraestrutura disponível em cada uma."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Painel titulo="Rendimento por rede de ensino" subtitulo="Média das taxas por escola (%)">
            <GraficoRede dados={dados.redes} />
          </Painel>
          <Painel titulo="Infraestrutura por rede" subtitulo="% de escolas de cada rede que possuem o item">
            <GraficoInfraPorRede dados={dados.infraRede} />
          </Painel>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {dados.redes.map((r) => (
            <Painel key={r.rede} titulo={`Rede ${r.grupo.toLowerCase()}`} subtitulo={`${r.escolas.toLocaleString("pt-BR")} escolas`}>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="font-display text-xl font-semibold text-danger tabular-nums">{r.abandono.toFixed(1)}%</p>
                  <p className="text-[11px] text-muted-foreground">Abandono</p>
                </div>
                <div>
                  <p className="font-display text-xl font-semibold text-warn tabular-nums">{r.reprovacao.toFixed(1)}%</p>
                  <p className="text-[11px] text-muted-foreground">Reprovação</p>
                </div>
                <div>
                  <p className="font-display text-xl font-semibold text-good tabular-nums">{r.aprovacao.toFixed(1)}%</p>
                  <p className="text-[11px] text-muted-foreground">Aprovação</p>
                </div>
              </div>
            </Painel>
          ))}
        </div>
      </Secao>

      <Secao
        etiqueta="P4"
        titulo="Quais carências pesam mais"
        descricao="Para cada item de infraestrutura, comparamos o abandono médio das escolas que possuem o item com o das escolas que não possuem."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Painel titulo="Abandono: tem x não tem o item" subtitulo="Média por escola (%)">
            <GraficoComSem dados={dados.itens} />
          </Painel>
          <Painel titulo="Cobertura de infraestrutura" subtitulo="% de escolas que possuem cada item">
            <GraficoCobertura dados={dados.cobertura} />
          </Painel>
          <Painel
            titulo="Abandono por quantidade de itens"
            subtitulo="Escolas agrupadas pelo número de itens de infraestrutura (0 a 5)"
            className="lg:col-span-2"
          >
            <GraficoQuantidadeItens dados={dados.quantidade} />
          </Painel>
        </div>

        {maiorImpacto?.diferenca !== null && maiorImpacto && (
          <div className="mt-4 rounded-xl border border-border bg-accent/50 p-5">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold">Leitura rápida:</span> a maior diferença aparece em{" "}
              <span className="font-semibold">{maiorImpacto.item}</span> — escolas sem o item têm abandono médio{" "}
              <span className="font-semibold text-danger">{maiorImpacto.sem.toFixed(2)}%</span> contra{" "}
              <span className="font-semibold text-good">{maiorImpacto.com.toFixed(2)}%</span> das que possuem
              ({maiorImpacto.diferenca! > 0 ? "+" : ""}
              {maiorImpacto.diferenca!.toFixed(2)} p.p.). Correlação não implica causalidade.
            </p>
          </div>
        )}
      </Secao>

      <Secao titulo="Explore os dados do seu jeito" descricao="No painel interativo você liga e desliga cada item de infraestrutura e vê na hora quais escolas entram na conta.">
        <Link
          to="/painel"
          className="inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ir para o painel
        </Link>
      </Secao>

      <SiteFooter />
    </div>
  );
}
