/**
 * Calculate the target price based on the given conditions.
 *
 * @param {string} price - The current price of the item.
 * @param {Array} conditions - An array of condition objects.
 *   Each object should contain:
 *     - `operator`: The operator string ("=", ">").
 *     - `value`: The value to compare against.
 *     - `type`: The type of the condition ("%", "exact").
 * @returns {number} - The target price based on the conditions.
 *
 * @example
 *
 * const price = "50";
 * const conditions = [
 *   {
 *     "operator": "=",
 *     "value": "10",
 *     "type": "%"
 *   }
 * ];
 *
 * const targetPrice = formatConditionPrice(price, conditions);
 * // Output will be: 55 (10% increase over 50)
 */

export const formatConiditionPrice = (price: string, conditions: any) => {
  const operator = conditions[0].operator;
  const value = parseFloat(conditions[0].value); // Convert value to float for calculations
  const type = conditions[0].type;

  const formattedPrice = parseFloat(price); // Assume formatPrice(price, false) returns a float

  let targetPrice = 0;

  // Calculate target price based on type and value
  if (type === '%') {
    if (operator === '=') {
      // Set the target price as a percentage increase/decrease of the current price
      targetPrice = formattedPrice + (formattedPrice * value) / 100;
    } else if (operator === '>') {
      // Calculate the price that is greater than the current price by a percentage
      targetPrice = formattedPrice * (1 + value / 100);
    }
  } else if (type === 'exact') {
    if (operator === '=') {
      // Directly set the target price to value
      targetPrice = value;
    } else if (operator === '>') {
      // In this case, the target price will be any price greater than value
      targetPrice = value; // You may want to handle this differently, depending on your needs
    }
  }

  return targetPrice;
};
