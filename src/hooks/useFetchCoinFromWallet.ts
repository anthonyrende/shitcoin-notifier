import { Connection, PublicKey } from '@solana/web3.js';
import { useEffect, useState, useCallback } from 'react';

type FetchCoinsFromWalletProps = {
    owner: PublicKey,
    connection: Connection,
    TOKEN_PROGRAM_ID: PublicKey,
    filters?: any
}

export function useFetchCoinsFromWallet(owner, connection, TOKEN_PROGRAM_ID, filters = {}): FetchCoinsFromWalletProps[] {
  const [coins, setCoins] = useState([]);

  const fetchCoinsFromWallet = useCallback(async () => {
    let response = await connection?.getParsedTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID,
      ...filters,
    });

    let coinsData = [];
    for (let i = 0; i < response.value.length; i++) {
      const account = response.value[i];
      const parsedAccountInfo: any = account?.account?.data;
      const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
      const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

      coinsData.push({
        accountNumber: i + 1,
        accountPublicKey: account.pubkey.toString(),
        mintAddress: mintAddress,
        tokenBalance: tokenBalance
      });
    }

    setCoins(coinsData);
  }, []);

  useEffect(() => {
    if (!connection || !owner) return;
    fetchCoinsFromWallet();
    console.log("here");
  }, [fetchCoinsFromWallet]);

  return coins;
}
