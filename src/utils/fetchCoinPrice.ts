import axios from 'axios';

export async function fetchCoinPrice(tokenMint: string) {
  try {
    // Fetching token data
    const { data: tokenData } = await axios.get(
      'https://api.raydium.io/v2/sdk/token/raydium.mainnet.json',
    );

    // Fetching token prices
    const { data: tokenPrices } = await axios.get(
      'https://api.raydium.io/v2/main/price',
    );

    // Find the token information by mint
    const tokenInfo = [...tokenData.official, ...tokenData.unOfficial].find(
      token => token.mint === tokenMint,
    );

    if (!tokenInfo) {
      console.log(`Token with mint ${tokenMint} not found.`);
      return;
    }

    const tokenPrice = tokenPrices[tokenMint];
    console.log(`Price for ${tokenInfo.symbol} (${tokenMint}): $${tokenPrice}`);
    return tokenPrice;
  } catch (error) {
    console.error('Error fetching token price:', error);
  }
}
