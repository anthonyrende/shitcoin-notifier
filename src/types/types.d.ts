export interface Coin {
  accountNumber: number;
  accountPublicKey: string;
  amount: number;
  decimals: number;
  mint: string;
  priceData: {
    mints: string;
    price: number;
    startTime: number;
    volume: number;
  };
  tokenAccount: string;
}
