import { getApiFallbackUrls, getApiUrl, isApiSupported } from "@gmx-io/sdk/configs/api";

export const GMX_PRODUCTION_CHAINS = [
  { id: 42161, slug: "arbitrum", label: "Arbitrum" },
  { id: 43114, slug: "avalanche", label: "Avalanche" },
  { id: 4326, slug: "megaeth", label: "MegaETH" },
] as const;

export type GmxChain = (typeof GMX_PRODUCTION_CHAINS)[number];

export function getGmxChain(slug: string): GmxChain | undefined {
  return GMX_PRODUCTION_CHAINS.find((chain) => chain.slug === slug && isApiSupported(chain.id));
}

export function getGmxApiPeers(chainId: number): string[] {
  if (!isApiSupported(chainId)) throw new Error(`Unsupported GMX chain: ${chainId}`);
  return [...new Set([getApiUrl(chainId), ...getApiFallbackUrls(chainId)])];
}
