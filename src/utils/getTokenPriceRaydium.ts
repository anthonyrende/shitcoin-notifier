import axios from 'axios';

export async function getTokenPrice(
  mintAddress: string,
): Promise<number | null> {
  try {
    const { data: tokenPrices } = await axios.get<{ [key: string]: number }>(
      'https://api.raydium.io/v2/main/price',
    );
    console.log('tokenPrices', tokenPrices[mintAddress]);
    return tokenPrices[mintAddress] || null;
  } catch (error) {
    console.error('Failed to fetch token price:', error);
    return null;
  }
}
