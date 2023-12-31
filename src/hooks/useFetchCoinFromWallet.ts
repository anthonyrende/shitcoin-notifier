import { Coin } from '@/types/types';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useEffect, useState, useCallback } from 'react';

type FetchCoinsFromWalletProps = {
  owner: PublicKey;
  connection: Connection;
  TOKEN_PROGRAM_ID: PublicKey;
  filters?: any;
};

export function useFetchCoinsFromWallet(
  owner: PublicKey,
  connection: Connection,
  TOKEN_PROGRAM_ID: PublicKey,
  filters = {},
) {
  const [coinsFromWallet, setCoins] = useState<Coin[]>([]);
  const { connecting, disconnecting } = useWallet();
  const fetchCoinsFromWallet = useCallback(async () => {
    let response = await connection?.getParsedTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID,
      ...filters,
    });

    let coinsData = [];
    for (let i = 0; i < response.value.length; i++) {
      const account = response.value[i];
      const parsedAccountInfo: any = account?.account?.data;
      const mintAddress: string = parsedAccountInfo['parsed']['info']['mint'];
      const tokenBalance: number =
        parsedAccountInfo['parsed']['info']['tokenAmount']['uiAmount'];

      if (tokenBalance !== 1 && tokenBalance !== 0) {
        coinsData.push({
          accountNumber: i + 1,
          accountPublicKey: account.pubkey.toString(),
          mint: mintAddress,
          tokenBalance: tokenBalance,
        });
      }
    }

    setCoins(coinsData);
  }, [connecting, disconnecting]);

  useEffect(() => {
    if (!connection || !owner) return;
    fetchCoinsFromWallet();
  }, [fetchCoinsFromWallet]);

  return coinsFromWallet;
}
