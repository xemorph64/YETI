import { cn } from "@/lib/utils";

/**
 * ScientificChart — dependency-free SVG line/area chart with mono ticks.
 * series values are plotted; x labels are generated from label config.
 */
export function ScientificChart({
  series,
  unit,
  label,
  highlight,
  className,
  accent = "var(--accent)",
  height = 220,
  xLabels,
}: {
  series: number[];
  unit?: string;
  label: string;
  highlight?: string;
  className?: string;
  accent?: string;
  height?: number;
  xLabels?: string[];
}) {
  const w = 640;
  const h = height;
  const padX = 46;
  const padY = 26;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const pts = series.map((v, i) => {
    const x = padX + (i / (series.length - 1)) * (w - padX - 12);
    const y = padY + (1 - (v - min) / range) * (h - padY * 2);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${h - padY} L${pts[0][0].toFixed(1)},${h - padY} Z`;
  const gid = `g-${Math.abs(series.length * 31 + Math.round(min * 7) + Math.round(max * 13))}`;

  const ticks = [0, 0.5, 1].map((f) => ({
    y: padY + f * (h - padY * 2),
    v: max - f * range,
  }));

  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label={`${label}${unit ? ` in ${unit}` : ""}. Line chart with ${series.length} points.`}
        className="w-full"
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padX} x2={w - 12} y1={t.y} y2={t.y} stroke="var(--line)" strokeWidth="1" />
            <text
              x={padX - 8}
              y={t.y + 3}
              textAnchor="end"
              fontSize="10"
              fill="var(--text-3)"
              fontFamily="var(--font-mono)"
            >
              {Math.abs(t.v) >= 100 ? t.v.toFixed(0) : t.v.toFixed(1)}
            </text>
          </g>
        ))}
        {xLabels?.map((xl, i) => (
          <text
            key={i}
            x={padX + (i / (xLabels.length - 1)) * (w - padX - 12)}
            y={h - 6}
            textAnchor={i === 0 ? "start" : i === xLabels.length - 1 ? "end" : "middle"}
            fontSize="10"
            fill="var(--text-3)"
            fontFamily="var(--font-mono)"
          >
            {xl}
          </text>
        ))}
        <path d={area} fill={`url(#${gid})`} />
        <path d={line} fill="none" stroke={accent} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.4" fill="var(--bg)" stroke={accent} strokeWidth="1.4" />
        ))}
      </svg>
      <figcaption className="flex flex-col gap-1 text-xs text-text-3">
        <span className="meta-label">{label}</span>
        {unit && <span className="numeral text-text-2">{unit}</span>}
        {highlight && <span>{highlight}</span>}
      </figcaption>
    </figure>
  );
}
