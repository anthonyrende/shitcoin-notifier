import { create } from 'zustand';

import { Coin } from '../types';

// Define the interface of the Cart state
interface State {
  coins: Coin[];
}

// Define the interface of the actions that can be performed in the Cart
interface Actions {
  addToCoins: (Item: Coin) => void;
  removeFromCoins: (Item: Coin) => void;
  updateCoinMetaData: (mint: string, metaData: any) => void;
  updateCoinPrices: (mint: string, priceData: any) => void;
}

// Initialize a default state
const INITIAL_STATE: State = {
  coins: [],
};

// Create the store with Zustand, combining the status interface and actions
export const useCoinStore = create<State & Actions>((set, get) => ({
  coins: INITIAL_STATE.coins,

  addToCoins: (newCoin: Coin) => {
    const coins = get().coins;
    const coinItem = coins.find(item => item.mint === newCoin.mint);

    // If the item already exists in the Cart, you can either skip or update its properties.
    if (coinItem) {
      console.log('Coin already exists');
    } else {
      const updatedCoins = [...coins, newCoin];
      set(state => ({
        coins: updatedCoins,
      }));
    }
  },
  removeFromCoins: (coin: Coin) => {
    set(state => ({
      coins: state.coins.filter(item => item.mint !== coin.mint),
    }));
  },
  updateCoinMetaData: (mint: string, metaData: any) => {
    const coins = get().coins;
    const updatedCoins = coins.map(coin =>
      coin.mint === mint ? { ...coin, metaData } : coin,
    );
    set({ coins: updatedCoins });
  },

  updateCoinPrices: (mint: string, priceData: any) => {
    const coins = get().coins;
    const updatedCoins = coins.map(coin =>
      coin.mint === mint ? { ...coin, priceData } : coin,
    );
    set({ coins: updatedCoins });
  },
}));
