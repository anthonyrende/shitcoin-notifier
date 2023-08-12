import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Coin } from '../types';
import { extractMetadata } from '@/utils/metaDataHelper';

import _ from 'lodash';

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
export const useCoinStore = create(
  persist<State & Actions>(
    (set, get) => ({
      coins: INITIAL_STATE.coins,

      addToCoins: (newCoin: Coin) => {
        const coins = get().coins;
        const coinExists = coins.some(coin => coin.mint === newCoin.mint);

        if (!coinExists) {
          const updatedCoins = [...coins, newCoin].filter(coin => coin.mint);
          set({ coins: updatedCoins });
        }
      },

      removeFromCoins: (coin: Coin) => {
        set(state => ({
          coins: state.coins.filter(item => item.mint !== coin.mint),
        }));
      },

      updateCoinMetaData: (coin: Coin) => {
        const coins = get().coins;
        const metaData = extractMetadata(coin);
        const updatedCoins = coins.map(c =>
          c && c.mint && coin && coin.mint && c.mint === coin.mint
            ? { ...c, metaData }
            : c,
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
    }),
    {
      name: 'coin-storage',
      // getStorage: () => sessionStorage, (optional) by default the 'localStorage' is used
    },
  ),
);
