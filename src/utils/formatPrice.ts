export function formatPrice(price: string, shortForm: boolean = false): string {
  const numberPrice = parseFloat(price); // Convert to number
  const priceString = Number(price).toString(); // Convert to string
  if (priceString?.includes('e')) {
    // Handle scientific notation
    const fullPrice = numberPrice.toFixed(20); // Convert to string with up to 20 decimal places

    if (shortForm) {
      const match = fullPrice.match(/0\.0*(\d{5})\d*$/); // Find the last 5 significant figures
      if (match) {
        return '$0.0...' + match[1];
      } else {
        return fullPrice; // If the pattern doesn't match, return the full price (for numbers like 1e5 which would be 100000)
      }
    } else {
      const longForm = fullPrice.slice(0, fullPrice.indexOf('.') + 12); // Keep only the first 10 characters after the decimal point
      return `${longForm.replace(/\.?0+$/, '')}`; // Remove trailing zeros
    }
  } else {
    // Handle non-scientific notation
    if (shortForm) {
      const shortPrice = numberPrice.toFixed(4);
      if (shortPrice.length - shortPrice.indexOf('.') <= 6) {
        return `$${Number(shortPrice).toFixed(3)}`; // If less than 5 characters after the decimal point, return the price as is
      } else {
        return '$0.0...' + shortPrice.slice(-5); // Else, return the last 5 characters
      }
    } else {
      return numberPrice.toFixed(4); // Return the price rounded to 4 decimal places
    }
  }
}
