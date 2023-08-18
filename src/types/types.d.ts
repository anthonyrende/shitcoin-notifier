export interface Coin {
  accountNumber: number;
  accountPublicKey: string;
  amount: number;
  decimals: number;
  mint: string;
  metaData: {
    description: string;
    image: string;
    name: string;
    symbol: string;
    mint: string;
  };
  statsData: Array<{
    mint: string;
    name: string;
    symbol: string;
    decimals: number;
  }>;
  tokenBalance: number;
  priceData: {
    mints: string;
    price: number;
    startTime: number;
    volume: number;
  };
  tokenAccount: string;
}
