import { Metaplex, toPublicKey } from '@metaplex-foundation/js';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { Connection, clusterApiUrl } from '@solana/web3.js';

/**
 * Fetches metadata for a given mint address using the Metaplex library.
 *
 * @param {Connection} connection - The connection instance from the web3.js library.
 * @param {string} mintAddress - The public key of the token's mint.
 *
 * @returns {Promise<Object>} - A Promise that resolves to an object containing the token's metadata.
 *
 * @throws Will throw an error if no account info is found at the address or if deserialization fails.
 */

export async function fetchTokenMetadata({ mintAddress }) {
  const url = `https://api.helius.xyz/v0/token-metadata?api-key=${process.env.NEXT_PUBLIC_HELIOUS_API_KEY}`;
  const nftAddresses = [mintAddress];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mintAccounts: nftAddresses,
        includeOffChain: true,
        disableCache: false,
      }),
    });

    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error(
      `Failed to fetch metadata for mint address ${mintAddress}: ${error}`,
    );
    throw error;
  }
}
