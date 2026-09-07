export function formatFixed(value: bigint, decimals: number, precision = 2): string {
  if (!Number.isInteger(decimals) || decimals < 0) throw new RangeError("Invalid decimals");
  if (!Number.isInteger(precision) || precision < 0) throw new RangeError("Invalid precision");

  const negative = value < 0n;
  const absolute = negative ? -value : value;
  const scale = 10n ** BigInt(decimals);
  const whole = absolute / scale;
  const fraction = (absolute % scale).toString().padStart(decimals, "0");
  const shown = precision === 0 ? "" : `.${fraction.slice(0, precision).padEnd(precision, "0")}`;
  return `${negative ? "-" : ""}${whole}${shown}`;
}
