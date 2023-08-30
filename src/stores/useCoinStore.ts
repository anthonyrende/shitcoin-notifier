import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { Coin } from '../types';
import { extractMetadata } from '@/utils/metaDataHelper';

import _ from 'lodash';
import { createStoreWithSelectors } from './createStoreWithSelectors';
import { fetchCoinPrice } from '@/utils/fetchCoinPrice';

// Define the interface of the Cart state
interface State {
  coins: Coin[];
  blockedMints: string[];
  watchList: Coin[];
}

// Define the interface of the actions that can be performed in the Cart
interface Actions {
  addToCoins: (Item: Coin) => void;
  removeFromCoins: (Item: Coin) => void;
  updateCoinMetaData: (mint: string) => void;
  updateCoinPrices: (mint: string, priceData: any) => void;
  clearState: () => void;
  addToWatchList: (Item: Coin) => void;
}

// Initialize a default state
const INITIAL_STATE: State = {
  coins: [],
  blockedMints: [],
  watchList: [],
};

// Create the store with Zustand, combining the status interface and actions
const useCoinStoreBase = create(
  persist<State & Actions>(
    (set, get) => ({
      coins: INITIAL_STATE.coins,
      blockedMints: INITIAL_STATE.blockedMints,
      watchList: INITIAL_STATE.watchList,

      addToCoins: async (newCoin: Coin) => {
        const coins = get().coins;

        if (
          get().blockedMints.includes(newCoin.mint) ||
          coins.some(coin => coin.mint === newCoin.mint)
        ) {
          console.log('This coin is either blocked or already added.');
          return;
        }
        fetchCoinPrice(newCoin.mint).then(priceData => {
          if (
            (priceData !== undefined || priceData !== '$undefined') &&
            priceData > 0
          ) {
            console.log(
              'Price data found for',
              newCoin.mint,
              priceData === undefined,
              priceData === '$undefined',
            );
            const updatedCoins = [...coins, newCoin].filter(coin => coin.mint);
            set({ coins: updatedCoins });
          }
        });
      },
      addToWatchList: (newCoin: Coin) => {
        const watchList = get().watchList;

        if (watchList.some(coin => coin.mint === newCoin.mint)) {
          console.log('This coin is already in the watch list.');
          return;
        }

        const updatedWatchList = [...watchList, newCoin].filter(
          coin => coin.mint,
        );
        set({ watchList: updatedWatchList });
      },
      removeFromCoins: (coin: Coin) => {
        set(state => ({
          coins: state.coins.filter(item => item.mint !== coin.mint),
          blockedMints: [...state.blockedMints, coin.mint],
        }));
      },
      removeFromWatchList: (coin: Coin) => {
        set(state => ({
          watchList: state.watchList.filter(item => item.mint !== coin.mint),
        }));
      },
      clearState: () => {
        console.log('Clearing state');
        set(state => ({
          coins: [],
          blockedMints: [],
        }));
        localStorage.clear();
      },
      updateCoinMetaData: (coin: Coin) => {
        const coins = get().coins;
        const metaData = extractMetadata(coin);
        const updatedCoins = coins.map(c =>
          c.mint === coin.mint ? { ...c, metaData } : c,
        );

        if (!_.isEqual(coins, updatedCoins)) {
          set({ coins: updatedCoins });
        }
      },

      updateCoinPrices: (mint: string, priceData: any) => {
        const coins = get().coins;
        const updatedCoins = coins.map(coin =>
          coin.mint === mint ? { ...coin, priceData } : coin,
        );

        if (!_.isEqual(coins, updatedCoins)) {
          set({ coins: updatedCoins });
        }
      },
      updateTokenStats: (mint: string, statsData: any) => {
        const coins = get().coins;
        const updatedCoins = coins.map(coin =>
          coin.mint === mint ? { ...coin, statsData } : coin,
        );

        if (!_.isEqual(coins, updatedCoins)) {
          set({ coins: updatedCoins });
        }
      },
    }),
    {
      name: 'coin-storage',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        return persistedState as State & Actions;
      },
    },
  ),
);

export const useCoinStore = createStoreWithSelectors(useCoinStoreBase);
