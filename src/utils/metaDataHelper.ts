import { Coin } from '@/types/types';

export function extractMetadata(coin: Coin) {
  if (!coin?.metadata || !coin) return {};

  const { onChainMetadata, offChainMetadata, legacyMetadata } = coin.metadata;

  let result = {};

  // Extract from onChainMetadata
  if (onChainMetadata && onChainMetadata.metadata) {
    result.name = onChainMetadata.metadata.data?.name || '';
    result.symbol = onChainMetadata.metadata.data?.symbol || '';
    result.image = onChainMetadata.metadata.data?.uri || '';
  }

  // Extract from offChainMetadata
  if (offChainMetadata && offChainMetadata.metadata) {
    result.name = result.name || offChainMetadata.metadata.name || '';
    result.symbol = result.symbol || offChainMetadata.metadata.symbol || '';
    result.image = result.image || offChainMetadata.metadata.image || '';
    result.description = offChainMetadata.metadata.description || '';
  }

  // Extract from legacyMetadata
  if (legacyMetadata) {
    result.name = result.name || legacyMetadata.name || '';
    result.symbol = result.symbol || legacyMetadata.symbol || '';
    result.image = result.image || legacyMetadata.logoURI || '';
    result.twitter = legacyMetadata.extensions?.twitter || '';
    result.website = legacyMetadata.extensions?.website || '';
  }

  console.log('extractMetadataaaaa', result);
  return result;
}
