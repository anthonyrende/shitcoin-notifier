export const validateAndAddCoins = (coinInfo, existingValidatedCoins) => {
  const validMintAddressPattern = /^[a-zA-Z0-9]{32,44}$/;
  const newlyValidatedCoins = [];

  coinInfo &&
    coinInfo.forEach(coin => {
      if (existingValidatedCoins.includes(coin.mint)) return;

      const isValidMint = validMintAddressPattern.test(coin.mint);
      const hasMetadata = !!coin.metaData;

      if (isValidMint && hasMetadata) {
        // You can also add coins here if needed.
        newlyValidatedCoins.push(coin.mint);
      } else {
        console.error(`Coin with mint address ${coin.mint} has invalid data.`);
      }
    });

  return newlyValidatedCoins;
};
