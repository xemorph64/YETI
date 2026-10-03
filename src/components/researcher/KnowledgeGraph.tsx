"use client";

/**
 * Polar Knowledge Graph — every entity discoverable through its relationships.
 * Clicking a node re-centres a two-hop neighbourhood (graphApi.expand); the
 * connection tracer finds the shortest path between any two entities
 * (graphApi.path, BFS). Deterministic radial layout, kind-clustered rings,
 * curved edges — no physics library, no requestAnimationFrame loops.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2, RotateCcw, Route, X } from "lucide-react";
import { graphApi, type GraphEdge, type GraphNode } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const KIND_COLOR: Record<string, string> = {
  station: "var(--accent)",
  expedition: "var(--violet)",
  dataset: "var(--sunrise)",
  publication: "var(--text)",
  report: "var(--text-2)",
  photograph: "#7dd3fc",
  theme: "var(--text-3)",
};

const KIND_ORDER = ["station", "expedition", "dataset", "publication", "report", "photograph", "theme"];

const RELATION_LABEL: Record<string, string> = {
  visited: "visited station",
  "collected-at": "collected at",
  "collected-during": "collected during",
  documents: "documents expedition",
  "captured-at": "photographed at",
  "captured-during": "photographed during",
  "belongs-to": "belongs to theme",
  explored: "explored theme",
  "uses-data": "uses data · seeded",
};

const SEEDS = [
  { id: "station:maitri", label: "Maitri" },
  { id: "station:bharati", label: "Bharati" },
  { id: "station:himadri", label: "Himadri" },
  { id: "station:dakshin-gangotri", label: "Dakshin Gangotri" },
  { id: "ds-01", label: "Schirmacher SMB" },
  { id: "theme:Glaciology", label: "Theme: Glaciology" },
];

function seedHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  distances: Record<string, number>;
  center: string;
}

/** Deterministic two-ring radial layout, nodes clustered by kind per ring. */
function layout(g: GraphState): Map<string, { x: number; y: number }> {
  const pos = new Map<string, { x: number; y: number }>();
  const CX = 400;
  const CY = 250;
  pos.set(g.center, { x: CX, y: CY });

  const others = g.nodes.filter((n) => n.id !== g.center);
  const ring1 = others.filter((n) => (g.distances[n.id] ?? 1) <= 1);
  const ring2 = others.filter((n) => (g.distances[n.id] ?? 1) >= 2);
  const byKind = (a: GraphNode, b: GraphNode) =>
    (KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind)) || a.label.localeCompare(b.label);

  const R1 = Math.max(130, Math.min(185, 70 + ring1.length * 10));
  const R2 = Math.min(252, R1 + 78);

  const place = (list: GraphNode[], radius: number) => {
    const sorted = [...list].sort(byKind);
    sorted.forEach((n, i) => {
      const jitter = (seedHash(n.id) % 9) - 4;
      const a = (i / Math.max(1, sorted.length)) * Math.PI * 2 - Math.PI / 2 + (jitter * Math.PI) / 180;
      pos.set(n.id, { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) * 0.85 });
    });
  };
  place(ring1, R1);
  place(ring2, R2);
  return pos;
}

/** Horizontal chain layout for a traced connection (subway-map feel). */
function chainLayout(ids: string[]): Map<string, { x: number; y: number }> {
  const pos = new Map<string, { x: number; y: number }>();
  ids.forEach((id, i) => {
    const x = ids.length === 1 ? 400 : 110 + (i * 580) / (ids.length - 1);
    const y = 250 + Math.sin(i * 1.7) * 58;
    pos.set(id, { x, y });
  });
  return pos;
}

function curve(a: { x: number; y: number }, b: { x: number; y: number }, key: string) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const dir = seedHash(key) % 2 === 0 ? 1 : -1;
  const cx = mx + (-dy / len) * 14 * dir;
  const cy = my + (dx / len) * 14 * dir;
  // true midpoint of the quadratic, for edge labels
  const lx = 0.25 * a.x + 0.5 * cx + 0.25 * b.x;
  const ly = 0.25 * a.y + 0.5 * cy + 0.25 * b.y;
  return { d: `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`, lx, ly };
}

export function KnowledgeGraph() {
  const [state, setState] = useState<GraphState | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [hiddenKinds, setHiddenKinds] = useState<Set<string>>(new Set());
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const [hoverEdge, setHoverEdge] = useState<{ label: string; x: number; y: number } | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [allNodes, setAllNodes] = useState<GraphNode[]>([]);
  const [pathA, setPathA] = useState("station:maitri");
  const [pathB, setPathB] = useState("theme:Glaciology");
  const [path, setPath] = useState<{ ids: string[]; edges: GraphEdge[] } | null>(null);
  const [pathMsg, setPathMsg] = useState<string | null>(null);
  const [tracing, setTracing] = useState(false);

  const focus = useCallback(async (id: string, remember = true) => {
    setLoading(true);
    setPath(null);
    setPathMsg(null);
    const { nodes, edges, distances } = (await graphApi.expand(id, 2)) as Awaited<ReturnType<typeof graphApi.expand>> & {
      distances: Record<string, number>;
    };
    const node = nodes.find((n) => n.id === id) ?? null;
    setState({ nodes, edges, distances, center: id });
    setSelected(node);
    if (remember) setHistory((h) => [id, ...h.filter((x) => x !== id)].slice(0, 6));
    setLoading(false);
  }, []);

  useEffect(() => {
    focus(SEEDS[0].id, false);
    graphApi.build().then(({ nodes }) => setAllNodes(nodes));
  }, [focus]);

  const view = useMemo(() => {
    if (!state) return null;
    if (path) {
      const nodes = state.nodes.filter((n) => path.ids.includes(n.id));
      // pull any path node missing from the current neighbourhood
      for (const id of path.ids) if (!nodes.some((n) => n.id === id)) nodes.push(allNodes.find((n) => n.id === id)!);
      return { nodes: nodes.filter(Boolean), edges: path.edges, pos: chainLayout(path.ids), center: state.center, pathMode: true };
    }
    const nodes = state.nodes.filter((n) => n.id === state.center || !hiddenKinds.has(n.kind));
    const ids = new Set(nodes.map((n) => n.id));
    const edges = state.edges.filter((e) => ids.has(e.source) && ids.has(e.target));
    return { nodes, edges, pos: layout({ ...state, nodes, edges }), center: state.center, pathMode: false };
  }, [state, path, hiddenKinds, allNodes]);

  const kindCounts = useMemo(() => {
    const c: Record<string, number> = {};
    state?.nodes.forEach((n) => {
      if (n.id !== state.center) c[n.kind] = (c[n.kind] ?? 0) + 1;
    });
    return c;
  }, [state]);

  const trace = async () => {
    setTracing(true);
    setSelected(null);
    const res = await graphApi.path(pathA, pathB);
    if (!res) {
      setPath(null);
      setPathMsg("No connection found — these records sit in separate parts of the archive.");
    } else {
      setPath(res);
      setPathMsg(`Connected in ${Math.max(0, res.ids.length - 1)} step${res.ids.length - 1 === 1 ? "" : "s"}.`);
    }
    setTracing(false);
  };

  const labelFor = (id: string) => (state?.nodes.find((n) => n.id === id) ?? allNodes.find((n) => n.id === id))?.label ?? id;
  const kindOrderIdx = (k: string) => Math.max(0, KIND_ORDER.indexOf(k));

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Entity picker + connection tracer + legend */}
      <aside className="flex h-fit flex-col gap-2 rounded-xl border border-line bg-surface p-4">
        <p className="meta-label mb-1">Start from an entity</p>
        {SEEDS.map((s) => (
          <button
            key={s.id}
            onClick={() => focus(s.id)}
            className={cn(
              "btn-tactile rounded-lg border px-3 py-2 text-left text-sm",
              state?.center === s.id && !path
                ? "border-accent/60 bg-accent-dim text-accent"
                : "border-line-strong text-text-2 hover:text-text",
            )}
          >
            {s.label}
          </button>
        ))}

        {/* Connection tracer */}
        <div className="mt-3 border-t border-line pt-3">
          <p className="meta-label mb-2 flex items-center gap-1.5">
            <Route className="size-3.5" strokeWidth={1.5} aria-hidden /> Connect two records
          </p>
          <div className="flex flex-col gap-2">
            {[
              { value: pathA, set: setPathA, label: "From" },
              { value: pathB, set: setPathB, label: "To" },
            ].map((sel) => (
              <select
                key={sel.label}
                value={sel.value}
                onChange={(e) => {
                  sel.set(e.target.value);
                  setPathMsg(null);
                }}
                aria-label={`${sel.label} entity`}
                className="h-9 w-full rounded-lg border border-line-strong bg-surface-2 px-2 text-xs text-text outline-none focus:border-accent/60"
              >
                {KIND_ORDER.map((k) => {
                  const group = allNodes.filter((n) => n.kind === k);
                  if (!group.length) return null;
                  return (
                    <optgroup key={k} label={k}>
                      {group.slice(0, 24).map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.label.length > 40 ? n.label.slice(0, 38) + "…" : n.label}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            ))}
            <button
              onClick={trace}
              disabled={tracing || pathA === pathB}
              className="btn-tactile inline-flex items-center justify-center gap-2 rounded-lg bg-accent-fill px-3 py-2 text-xs font-semibold text-accent-ink disabled:opacity-40"
            >
              {tracing ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Route className="size-3.5" strokeWidth={1.5} aria-hidden />}
              Trace shortest connection
            </button>
            {pathMsg && (
              <p className="text-[11px] leading-relaxed text-text-3" role="status">
                {pathMsg}
                {path && (
                  <button
                    onClick={() => {
                      setPath(null);
                      setPathMsg(null);
                    }}
                    className="link-line ml-1.5 text-accent"
                  >
                    back to the graph
                  </button>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Kind filters */}
        <div className="mt-3 border-t border-line pt-3">
          <p className="meta-label mb-2">Show entity types</p>
          <div className="flex flex-wrap gap-1.5">
            {KIND_ORDER.filter((k) => kindCounts[k]).map((k) => {
              const hidden = hiddenKinds.has(k);
              return (
                <button
                  key={k}
                  onClick={() =>
                    setHiddenKinds((s) => {
                      const next = new Set(s);
                      if (next.has(k)) next.delete(k);
                      else next.add(k);
                      return next;
                    })
                  }
                  aria-pressed={!hidden}
                  className={cn(
                    "btn-tactile flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]",
                    hidden ? "border-line text-text-3 line-through opacity-60" : "border-line-strong text-text-2",
                  )}
                >
                  <span className="size-2 rounded-full" style={{ background: KIND_COLOR[k] }} aria-hidden />
                  {k}
                  <span className="numeral text-[10px] text-text-3">{kindCounts[k]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-3 border-t border-line pt-3 text-[11px] leading-relaxed text-text-3">
          Every solid edge is a real relationship in the repository — expeditions visited stations and worked on
          themes, datasets were collected during them, reports document them, publications use their data.
          <em className="not-italic text-text-2"> uses-data</em> edges are seeded for the demo corpus and marked on
          hover. Click any node to walk outward two hops.
        </p>

        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 border-t border-line pt-3">
          {KIND_ORDER.map((k) => (
            <span key={k} className="flex items-center gap-1.5 text-[10px] text-text-3">
              <span className="size-2 rounded-full" style={{ background: KIND_COLOR[k] }} aria-hidden />
              {k}
            </span>
          ))}
        </div>
      </aside>

      {/* Graph canvas */}
      <div className="relative min-h-[560px] overflow-hidden rounded-xl border border-line bg-surface">
        {/* Header row: mode + stats + history */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-4 py-2.5">
          <span className="meta-label !text-[9px]">
            {view?.pathMode ? "Connection trace" : path ? "" : "Two-hop neighbourhood"}
          </span>
          {view && !loading && (
            <span className="numeral text-[11px] text-text-3">
              {view.nodes.length} nodes · {view.edges.length} relations
            </span>
          )}
          <span className="ml-auto flex flex-wrap items-center gap-1.5">
            {history.slice(0, 5).map((id) => (
              <button
                key={id}
                onClick={() => focus(id)}
                className="btn-tactile rounded-full border border-line px-2.5 py-0.5 text-[10px] text-text-3 hover:border-accent/50 hover:text-accent"
                title="Jump back"
              >
                {(labelFor(id).length > 22 ? labelFor(id).slice(0, 20) + "…" : labelFor(id))}
              </button>
            ))}
            {(history.length > 0 || path) && (
              <button
                onClick={() => {
                  setHistory([]);
                  setPath(null);
                  setPathMsg(null);
                  focus(SEEDS[0].id, false);
                }}
                className="btn-tactile flex items-center gap-1 rounded-full border border-line px-2.5 py-0.5 text-[10px] text-text-3 hover:text-text"
              >
                <RotateCcw className="size-3" strokeWidth={1.5} aria-hidden /> reset
              </button>
            )}
          </span>
        </div>

        {loading || !state || !view ? (
          <div className="flex h-[520px] items-center justify-center gap-3 text-text-3">
            <Loader2 className="size-5 animate-spin" aria-hidden />
            <span className="meta-label">Connecting the graph…</span>
          </div>
        ) : (
          <>
            <svg viewBox="0 0 800 500" className="block h-auto w-full" role="application" aria-label="Polar knowledge graph">
              {/* Ring guides (neighbourhood mode only) */}
              {!view.pathMode && (
                <g aria-hidden>
                  <circle cx={400} cy={250} r={165} fill="none" className="stroke-line-strong" strokeWidth="0.6" strokeDasharray="2 6" opacity="0.5" />
                  <circle cx={400} cy={250} r={243} fill="none" className="stroke-line-strong" strokeWidth="0.6" strokeDasharray="2 6" opacity="0.35" />
                  <text x={400} y={250 - 172} textAnchor="middle" fontSize="8.5" className="fill-text-3" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}>
                    1 HOP
                  </text>
                  <text x={400} y={250 - 250} textAnchor="middle" fontSize="8.5" className="fill-text-3" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}>
                    2 HOPS
                  </text>
                </g>
              )}

              {/* Edges */}
              {view.edges.map((e, i) => {
                const a = view.pos.get(e.source);
                const b = view.pos.get(e.target);
                if (!a || !b) return null;
                const key = `${e.source}|${e.target}|${e.relation}`;
                const { d, lx, ly } = curve(a, b, key);
                const touchesCenter = !view.pathMode && (e.source === view.center || e.target === view.center);
                const touchesHover = hoverNode && (e.source === hoverNode || e.target === hoverNode);
                const inPath = !!path && path.edges.some((pe) => pe.source === e.source && pe.target === e.target && pe.relation === e.relation);
                const hot = view.pathMode ? inPath : touchesCenter || touchesHover;
                return (
                  <g key={key + i}>
                    <path
                      d={d}
                      fill="none"
                      className={hot ? "stroke-accent" : "stroke-line-strong"}
                      strokeWidth={hot ? (inPath ? 2.2 : 1.6) : 1}
                      opacity={hot ? 0.85 : view.pathMode ? 0.15 : 0.4}
                    />
                    {/* invisible fat stroke as the hover hit-area */}
                    <path
                      d={d}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="12"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoverEdge({ label: RELATION_LABEL[e.relation] ?? e.relation, x: lx, y: ly })}
                      onMouseLeave={() => setHoverEdge(null)}
                    />
                    {view.pathMode && (
                      <text x={lx} y={ly - 4} textAnchor="middle" fontSize="9" className="fill-accent" style={{ fontFamily: "var(--font-mono)" }}>
                        {RELATION_LABEL[e.relation] ?? e.relation}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Edge relation tooltip (neighbourhood mode) */}
              {hoverEdge && !view.pathMode && (
                <g aria-hidden>
                  <rect x={hoverEdge.x - 52} y={hoverEdge.y - 22} width="104" height="16" rx="4" className="fill-bg" stroke="var(--line-strong)" strokeWidth="0.6" />
                  <text x={hoverEdge.x} y={hoverEdge.y - 11} textAnchor="middle" fontSize="8.5" className="fill-text-2" style={{ fontFamily: "var(--font-mono)" }}>
                    {hoverEdge.label}
                  </text>
                </g>
              )}

              {/* Nodes */}
              {view.nodes.map((n) => {
                const p = view.pos.get(n.id)!;
                const isCenter = !view.pathMode && n.id === view.center;
                const inPath = !!path && path.ids.includes(n.id);
                const color = KIND_COLOR[n.kind] ?? "var(--text-2)";
                const dim = hoverNode && hoverNode !== n.id && !view.edges.some((e) => (e.source === hoverNode && e.target === n.id) || (e.target === hoverNode && e.source === n.id));
                return (
                  <g
                    key={n.id}
                    transform={`translate(${p.x} ${p.y})`}
                    className="cursor-pointer"
                    style={{ transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)" }}
                    onClick={() => (view.pathMode ? undefined : focus(n.id))}
                    onMouseEnter={() => setHoverNode(n.id)}
                    onMouseLeave={() => setHoverNode(null)}
                    role="button"
                    aria-label={`${n.kind}: ${n.label}`}
                    opacity={dim ? 0.3 : 1}
                  >
                    {(isCenter || inPath) && <circle r="16" fill="none" className="stroke-accent" strokeWidth="1" opacity="0.55" />}
                    <circle r={isCenter ? 11 : inPath ? 9 : 7} fill={color} stroke="var(--bg)" strokeWidth="2" />
                    <text
                      y={isCenter ? 29 : 19}
                      textAnchor="middle"
                      fontSize={isCenter ? 12 : 9.5}
                      className={isCenter || inPath ? "fill-text" : "fill-text-3"}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {n.label.length > 30 ? n.label.slice(0, 28) + "…" : n.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Selected record card */}
            {selected && !path && (
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line-strong bg-bg/95 p-4 backdrop-blur md:left-auto md:w-[420px]">
                <div className="min-w-0">
                  <p className="meta-label !text-[9px]">{selected.kind}</p>
                  <p className="truncate text-sm font-semibold text-text">{selected.label}</p>
                  {selected.meta && <p className="numeral mt-0.5 text-[11px] text-text-3">{selected.meta}</p>}
                </div>
                {(() => {
                  const href = graphApi.hrefFor(selected);
                  return href ? (
                    <Link
                      href={href}
                      className="btn-tactile inline-flex shrink-0 items-center gap-1.5 rounded-md bg-accent-fill px-3 py-2 text-xs font-semibold text-accent-ink"
                    >
                      Open record <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden />
                    </Link>
                  ) : (
                    <span className="meta-label !text-[9px] shrink-0">metadata node</span>
                  );
                })()}
              </div>
            )}

            {/* Path mode legend strip */}
            {path && (
              <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center gap-2 rounded-xl border border-line-strong bg-bg/95 p-3.5 backdrop-blur">
                {path.ids.map((id, i) => (
                  <span key={id} className="flex items-center gap-2">
                    {i > 0 && (
                      <span aria-hidden className="text-[10px] text-accent">
                        —{RELATION_LABEL[path.edges[i - 1]?.relation ?? ""] ?? ""}→
                      </span>
                    )}
                    <button
                      onClick={() => focus(id)}
                      className="btn-tactile rounded-full border border-accent/40 bg-accent-dim px-2.5 py-1 text-[11px] font-medium text-accent"
                    >
                      {labelFor(id).length > 30 ? labelFor(id).slice(0, 28) + "…" : labelFor(id)}
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => {
                    setPath(null);
                    setPathMsg(null);
                  }}
                  aria-label="Clear the connection trace"
                  className="btn-tactile ml-auto rounded-md border border-line-strong p-1.5 text-text-3 hover:text-text"
                >
                  <X className="size-3.5" strokeWidth={1.5} aria-hidden />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
