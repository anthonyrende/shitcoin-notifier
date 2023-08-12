export const fetchTokenStats = async (tokenAddress: string) => {
  const url = 'https://rest-api.hellomoon.io/v0/token/stats';
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: process.env.NEXT_PUBLIC_HELLO_MOON_API_KEY,
    },
    body: JSON.stringify({
      mint: tokenAddress,
    }),
  };
  const response = await fetch(url, options);

  const data = await response.json();
  // console.log('dataaaaa', data.data);
  return data.data;
};
