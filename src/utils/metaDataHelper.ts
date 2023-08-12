import { Coin } from '@/types/types';

export function extractMetadata(coin: Coin) {
  if (!coin.metadata) return {};

  const { metaData, onChainMetadata, offChainMetadata, legacyMetadata } =
    coin.metadata;

  let result: { [key: string]: string } = {};

  // First, extract from metaData (highest priority)
  if (metaData) {
    result.name = metaData.name || '';
    result.symbol = metaData.symbol || '';
    result.image = metaData.image || '';
    result.twitter = metaData.twitter || '';
    result.website = metaData.website || '';
  }

  // Extract from offChainMetadata
  if (offChainMetadata?.metadata) {
    result.name = result.name || offChainMetadata.metadata.name || '';
    result.symbol = result.symbol || offChainMetadata.metadata.symbol || '';
    result.image =
      result.image ||
      offChainMetadata.metadata.image ||
      offChainMetadata.uri ||
      '';
    result.description =
      result.description || offChainMetadata.metadata.description || '';
  }

  // Extract from onChainMetadata
  if (onChainMetadata?.metadata) {
    result.name = result.name || onChainMetadata.metadata.data?.name || '';
    result.symbol =
      result.symbol || onChainMetadata.metadata.data?.symbol || '';
    // Only set the image from onChain if it's not already set by offChainMetadata
    result.image = result.image || onChainMetadata.metadata.data?.uri || '';
  }

  // Extract from legacyMetadata
  if (legacyMetadata) {
    result.name = result.name || legacyMetadata.name || '';
    result.symbol = result.symbol || legacyMetadata.symbol || '';
    result.image = result.image || legacyMetadata.logoURI || '';
    result.twitter = result.twitter || legacyMetadata.extensions?.twitter || '';
    result.website = result.website || legacyMetadata.extensions?.website || '';
  }
  return result;
}
