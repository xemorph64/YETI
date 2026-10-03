import { seeded } from "@/lib/utils";

/** Deterministic, seasonal + trended series for demo dataset previews. */
export function generateSeries(seed: number, n = 40, base = 5, amp = 2, trend = 0.05): number[] {
  const rnd = seeded(seed);
  const noise = Array.from({ length: n }, () => rnd() - 0.5);
  return Array.from({ length: n }, (_, i) => {
    const seasonal = Math.sin((i / n) * Math.PI * 6) * amp * 0.6;
    const drift = trend * i;
    return base + seasonal + drift + noise[i] * amp * 0.35;
  });
}

export function formatNumber(v: number) {
  return Math.abs(v) >= 100 ? v.toFixed(0) : v.toFixed(2);
}
