import { Tooltip } from '@chakra-ui/react';

type PriceDisplayProps = {
  price: number;
  decimals: number;
};

export function PriceDisplay({ price, decimals }: PriceDisplayProps) {
  if (!price || !Number.isFinite(price) || !Number.isFinite(decimals)) {
    return (
      <Tooltip hasArrow label="Not available" bg="purple.600">
        <span>N/A</span>
      </Tooltip>
    );
  }

  // Convert the price to a string
  let priceString = price.toString();
  if (priceString.includes('.')) {
    // Remove the "0." prefix
    priceString = priceString.substring(2);
  }
  const zeros = '0'.repeat(decimals);
  // Calculate the full price with padding zeroes based on the number of decimals
  const fullPrice = `0.${zeros}${priceString}`;

  const shortPrice = `0.0...${fullPrice.slice(-6)}`;

  return (
    <Tooltip hasArrow label={`$${fullPrice}`} bg="purple.600">
      <span>{shortPrice}</span>
    </Tooltip>
  );
}
