export function formatAsPercentage(num) {
  if (num === undefined || num === null) {
    return 'N/A';
  }
  return new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}
