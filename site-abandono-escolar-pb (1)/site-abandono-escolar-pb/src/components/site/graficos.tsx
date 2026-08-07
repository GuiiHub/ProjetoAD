import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  ComposedChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const eixo = { fontSize: 11, fill: "var(--muted-foreground)" };

const tooltipProps = {
  cursor: { fill: "color-mix(in oklab, var(--muted) 70%, transparent)" },
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    fontSize: "12px",
    color: "var(--popover-foreground)",
    boxShadow: "0 8px 24px -12px oklch(0 0 0 / 0.35)",
  },
  labelStyle: { fontWeight: 600, color: "var(--foreground)" },
} as const;

export function GraficoTopMunicipios({
  dados,
}: {
  dados: { municipio: string; abandono: number; escolas: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(260, dados.length * 30)}>
      <BarChart data={dados} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" />
        <XAxis type="number" tick={eixo} tickLine={false} axisLine={false} unit="%" />
        <YAxis type="category" dataKey="municipio" width={140} tick={eixo} tickLine={false} axisLine={false} />
        <Tooltip
          {...tooltipProps}
          formatter={(v: number) => [`${v.toFixed(2)}%`, "Abandono médio"]}
          labelFormatter={(l: string) => l}
        />
        <Bar dataKey="abandono" radius={[0, 6, 6, 0]} barSize={16}>
          {dados.map((d, i) => (
            <Cell key={d.municipio} fill={i < 5 ? "var(--danger)" : "var(--chart-2)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GraficoComSem({
  dados,
}: {
  dados: { item: string; com: number; sem: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={dados} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="item" tick={{ ...eixo, fontSize: 10 }} tickLine={false} axisLine={false} interval={0} angle={-12} textAnchor="end" height={46} />
        <YAxis tick={eixo} tickLine={false} axisLine={false} unit="%" />
        <Tooltip {...tooltipProps} formatter={(v: number, n) => [`${v.toFixed(2)}%`, n === "com" ? "Escolas que têm" : "Escolas que não têm"]} />
        <Legend
          wrapperStyle={{ fontSize: 12 }}
          formatter={(v) => (v === "com" ? "Possui o item" : "Não possui o item")}
        />
        <Bar dataKey="com" fill="var(--chart-2)" radius={[6, 6, 0, 0]} maxBarSize={38} />
        <Bar dataKey="sem" fill="var(--danger)" radius={[6, 6, 0, 0]} maxBarSize={38} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GraficoQuantidadeItens({
  dados,
}: {
  dados: { itens: string; abandono: number; escolas: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={dados} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="itens" tick={eixo} tickLine={false} axisLine={false} />
        <YAxis yAxisId="left" tick={eixo} tickLine={false} axisLine={false} unit="%" />
        <YAxis yAxisId="right" orientation="right" tick={eixo} tickLine={false} axisLine={false} />
        <Tooltip
          {...tooltipProps}
          formatter={(v: number, n) =>
            n === "abandono" ? [`${v.toFixed(2)}%`, "Abandono médio"] : [v.toLocaleString("pt-BR"), "Escolas"]
          }
        />
        <Bar yAxisId="right" dataKey="escolas" fill="var(--muted)" radius={[6, 6, 0, 0]} maxBarSize={44} />
        <Line yAxisId="left" type="monotone" dataKey="abandono" stroke="var(--danger)" strokeWidth={2.5} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function GraficoLocalizacao({
  dados,
}: {
  dados: { grupo: string; abandono: number; aprovacao: number; reprovacao: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={dados} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="grupo" tick={eixo} tickLine={false} axisLine={false} />
        <YAxis tick={eixo} tickLine={false} axisLine={false} unit="%" />
        <Tooltip {...tooltipProps} formatter={(v: number) => `${v.toFixed(2)}%`} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar name="Abandono" dataKey="abandono" fill="var(--danger)" radius={[6, 6, 0, 0]} maxBarSize={40} />
        <Bar name="Reprovação" dataKey="reprovacao" fill="var(--warn)" radius={[6, 6, 0, 0]} maxBarSize={40} />
        <Bar name="Aprovação" dataKey="aprovacao" fill="var(--chart-2)" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GraficoCobertura({
  dados,
}: {
  dados: { item: string; cobertura: number; com: number; sem: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, dados.length * 46)}>
      <BarChart data={dados} layout="vertical" margin={{ left: 8, right: 32, top: 4, bottom: 4 }}>
        <CartesianGrid horizontal={false} stroke="var(--border)" />
        <XAxis type="number" domain={[0, 100]} tick={eixo} tickLine={false} axisLine={false} unit="%" />
        <YAxis type="category" dataKey="item" width={130} tick={eixo} tickLine={false} axisLine={false} />
        <Tooltip
          {...tooltipProps}
          formatter={(v: number, _n, p) => [
            `${v}% — ${p.payload.com.toLocaleString("pt-BR")} escolas têm, ${p.payload.sem.toLocaleString("pt-BR")} não têm`,
            "Cobertura",
          ]}
        />
        <Bar dataKey="cobertura" radius={[0, 6, 6, 0]} barSize={18}>
          {dados.map((d) => (
            <Cell key={d.item} fill={d.cobertura >= 80 ? "var(--chart-2)" : d.cobertura >= 50 ? "var(--warn)" : "var(--danger)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GraficoRosca({ dados }: { dados: { nome: string; valor: number }[] }) {
  const cores = ["var(--chart-1)", "var(--chart-2)", "var(--warn)", "var(--danger)", "var(--good)", "var(--muted-foreground)"];
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={dados} dataKey="valor" nameKey="nome" innerRadius={62} outerRadius={100} paddingAngle={2} stroke="var(--card)">
          {dados.map((d, i) => (
            <Cell key={d.nome} fill={cores[i % cores.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipProps} formatter={(v: number) => [`${v.toLocaleString("pt-BR")} escolas`, "Total"]} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
