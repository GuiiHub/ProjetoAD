import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Secao, Painel } from "@/components/site/ui-blocks";
import { escolas, municipios, itensInfra, redes, porRede, temClimatizacao } from "@/lib/dados";

export const Route = createFileRoute("/metodologia")({
  head: () => ({
    meta: [
      { title: "Metodologia | Abandono Escolar na Paraíba" },
      {
        name: "description",
        content:
          "Fontes de dados, tratamento, perguntas analíticas e limitações do estudo sobre abandono escolar e infraestrutura nas escolas da Paraíba.",
      },
      { property: "og:title", content: "Metodologia | Abandono Escolar na Paraíba" },
      { property: "og:description", content: "Como os dados do Censo Escolar e das Taxas de Rendimento do INEP foram cruzados." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Metodologia,
});

const perguntas = [
  {
    id: "P1",
    titulo: "Onde o problema se concentra",
    texto: "Comparação da taxa de abandono entre escolas urbanas e rurais, estabelecendo o recorte estrutural da análise.",
  },
  {
    id: "P2",
    titulo: "Quais municípios são mais críticos",
    texto: "Ranking dos municípios paraibanos pela taxa média de abandono nos anos iniciais do Ensino Fundamental.",
  },
  {
    id: "P3",
    titulo: "Qual rede de ensino apresenta as piores taxas",
    texto:
      "Comparação das taxas de abandono, reprovação e aprovação entre as redes estadual, municipal e privada, além da cobertura de infraestrutura em cada uma delas.",
  },
  {
    id: "P4",
    titulo: "Quais carências de infraestrutura pesam mais",
    texto: "Comparação do abandono entre escolas que possuem e que não possuem cada item de infraestrutura básica.",
  },
];

const limites = [
  "Correlação não implica causalidade: a associação entre carências estruturais e abandono não permite inferência causal direta.",
  "Corte transversal: os dados representam um único ano, sem série histórica, portanto não indicam tendência.",
  "Escolas sem taxa de rendimento declarada são mantidas na contagem de infraestrutura, mas excluídas das médias de abandono.",
  "Os rankings municipais exigem um mínimo de escolas com dado válido para evitar distorção em municípios muito pequenos.",
  "A rede administrativa (estadual, municipal ou privada) é derivada da nomenclatura oficial da escola registrada no Censo; nomes atípicos podem ser classificados de forma imprecisa.",
];

function Metodologia() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="grade-fina border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-14">
          <h1 className="max-w-3xl text-3xl font-semibold sm:text-4xl">Metodologia</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            O estudo cruza os microdados do Censo Escolar com as Taxas de Rendimento Escolar do INEP, ambos referentes às escolas
            da Paraíba, usando o código INEP da escola (CO_ENTIDADE) como chave de junção.
          </p>
        </div>
      </div>

      <Secao titulo="Perguntas analíticas" descricao="O problema foi decomposto em quatro perguntas encadeadas: onde → quais lugares → qual rede → por quê.">
        <div className="grid gap-4 md:grid-cols-2">
          {perguntas.map((p) => (
            <Painel key={p.id} titulo={`${p.id} — ${p.titulo}`}>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
            </Painel>
          ))}
        </div>
      </Secao>

      <Secao
        titulo="Rede administrativa"
        descricao="Como as escolas foram separadas entre rede estadual, municipal e privada."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {porRede(escolas).map((r) => (
            <Painel key={r.rede} titulo={`Rede ${r.grupo.toLowerCase()}`} subtitulo={`${r.escolas.toLocaleString("pt-BR")} escolas`}>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {redes.find((x) => x.chave === r.rede)?.descricao}. Abandono médio de {r.abandono.toFixed(2)}% e aprovação média
                de {r.aprovacao.toFixed(2)}%.
              </p>
            </Painel>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          A classificação usa a nomenclatura oficial registrada no Censo Escolar: siglas municipais (EMEF, EMEIF, CMEI, “Escola
          Municipal”…) indicam a rede municipal; siglas estaduais (EEEF, EEEFM, ECI, ECIT, “Escola Estadual”…) indicam a rede
          estadual; as demais mantenedoras (colégios, institutos, centros educacionais e educandários) são tratadas como rede
          privada.
          {temClimatizacao
            ? " A variável de salas climatizadas está disponível na base e entra nos filtros e nos cruzamentos de infraestrutura."
            : " A variável de salas climatizadas já está implementada nos filtros e gráficos, mas permanece oculta enquanto a coluna de climatização não estiver presente no dataset."}
        </p>
      </Secao>

      <Secao titulo="Base de dados" descricao="Dataset consolidado por escola, resultado do tratamento e do merge das bases públicas do INEP.">
        <div className="grid gap-4 md:grid-cols-3">
          <Painel titulo="Granularidade">
            <p className="text-sm text-muted-foreground">
              Uma linha por escola: {escolas.length.toLocaleString("pt-BR")} escolas em {municipios.length} municípios paraibanos.
            </p>
          </Painel>
          <Painel titulo="Indicadores de rendimento">
            <p className="text-sm text-muted-foreground">
              Taxas de aprovação, reprovação e abandono do Ensino Médio/Fundamental conforme declaradas pelo INEP. Valores não
              informados (&quot;--&quot;) foram convertidos em ausentes e excluídos das médias.
            </p>
          </Painel>
          <Painel titulo="Itens de infraestrutura">
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {itensInfra.map((i) => (
                <li key={i.chave}>
                  <span className="font-medium text-foreground">{i.rotulo}</span> — {i.descricao}
                </li>
              ))}
            </ul>
          </Painel>
        </div>
      </Secao>

      <Secao titulo="Pipeline" descricao="Etapas executadas até a publicação deste painel.">
        <ol className="grid gap-3 md:grid-cols-4">
          {[
            "Coleta dos microdados do Censo Escolar e das Taxas de Rendimento (INEP).",
            "Filtragem por UF (PB), seleção de variáveis de localização e infraestrutura.",
            "Tratamento de códigos especiais e merge por CO_ENTIDADE.",
            "Cálculo dos indicadores e publicação dos gráficos e filtros deste site.",
          ].map((t, i) => (
            <li key={i} className="rounded-xl border border-border bg-card p-5">
              <span className="font-display text-sm font-semibold text-brand">Etapa {i + 1}</span>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t}</p>
            </li>
          ))}
        </ol>
      </Secao>

      <Secao titulo="Limitações" descricao="Pontos que devem acompanhar qualquer leitura dos resultados.">
        <ul className="grid gap-3 md:grid-cols-2">
          {limites.map((l) => (
            <li key={l} className="rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
              {l}
            </li>
          ))}
        </ul>
      </Secao>

      <SiteFooter />
    </div>
  );
}
