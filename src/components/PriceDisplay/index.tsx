import { formatPrice } from '@/utils/formatPrice';
import { Tooltip } from '@chakra-ui/react';

type PriceDisplayProps = {
  price: string;
};

export function PriceDisplay({ price }: PriceDisplayProps) {
  return (
    <Tooltip hasArrow label={`$${formatPrice(price, false)}`} bg="purple.600">
      <span>{formatPrice(price, true)}</span>
    </Tooltip>
  );
}
