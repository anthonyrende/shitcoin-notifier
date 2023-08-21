export const fetchCoinPrice = async (price: number, decimals: number) => {
  if (!price || !Number.isFinite(price) || !Number.isFinite(decimals)) {
    return null;
  }

  // Convert the price to a string
  let priceString = price.toString();
  if (priceString.includes('.')) {
    // Remove the "0." prefix
    priceString = priceString.substring(2);
  }
  const zeros = '0'.repeat(decimals);
  console.log(`0.0${zeros}${priceString}`);
  return `0.0${zeros}${priceString}`;
};
