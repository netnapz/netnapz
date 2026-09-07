import type { PriceCandle } from "@/lib/gmx/markets";

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value >= 100 ? 2 : 4 }).format(value);
}

export function PriceChart({ candles }: { candles: PriceCandle[] }) {
  if (candles.length < 2) return <div className="chart-empty"><div className="chart-badge">GMX OHLCV</div><strong>Verified price series unavailable</strong><span>No substitute data is displayed.</span></div>;

  let low = Number.POSITIVE_INFINITY;
  let high = Number.NEGATIVE_INFINITY;
  for (const candle of candles) {
    low = Math.min(low, candle.low);
    high = Math.max(high, candle.high);
  }
  const range = Math.max(high - low, high * 0.0001);
  const width = 900;
  const height = 360;
  const points = candles.map((candle, index) => {
    const x = (index / (candles.length - 1)) * width;
    const y = height - ((candle.close - low) / range) * height;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
  const first = candles[0].close;
  const last = candles[candles.length - 1].close;
  const change = ((last - first) / first) * 100;
  const positive = change >= 0;

  return <div className="price-chart">
    <div className="chart-stats"><div><span>LAST</span><strong>{formatUsd(last)}</strong></div><div><span>96H CHANGE</span><strong className={positive ? "positive" : "negative"}>{positive ? "+" : ""}{change.toFixed(2)}%</strong></div><div><span>HIGH</span><strong>{formatUsd(high)}</strong></div><div><span>LOW</span><strong>{formatUsd(low)}</strong></div></div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`GMX hourly closing prices from ${formatUsd(first)} to ${formatUsd(last)}`} preserveAspectRatio="none">
      <defs><linearGradient id="price-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6c333" stopOpacity=".32" /><stop offset="1" stopColor="#f6c333" stopOpacity="0" /></linearGradient></defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill="url(#price-fill)" />
      <polyline points={points} fill="none" stroke="#f6c333" strokeWidth="3" vectorEffect="non-scaling-stroke" />
    </svg>
    <div className="chart-source">96 hourly candles · Official GMX API · Refreshed every 10 seconds</div>
  </div>;
}
