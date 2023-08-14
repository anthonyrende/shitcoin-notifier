import { WalletWrapper } from '@/Wrappers/WalletWrapper';
import { ChakraProvider } from '@chakra-ui/react';
import '@solana/wallet-adapter-react-ui/styles.css';
import type { AppProps } from 'next/app';
import '@fontsource/inter/variable.css';
import { theme } from '@/styles/theme';
import { NextSeo } from 'next-seo';
import { SessionProvider } from 'next-auth/react';

const metadata = {
  title: 'Shitcoin notifier',
  description: 'Get notified when your shitcoin moons.',
  // TODO: add url
  url: '',
};

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <NextSeo
        defaultTitle={metadata.title}
        description={metadata.description}
        openGraph={{
          title: metadata.title,
          description: metadata.description,
          url: metadata.url,
          type: 'website',
          siteName: metadata.title,
          images: [
            {
              url: '/assets/og.svg',
              width: 1200,
              height: 630,
              alt: metadata.title,
            },
          ],
        }}
        themeColor={theme.colors.black}
        title={metadata.title}
      />

      <SessionProvider>
        <WalletWrapper>
          <Component {...pageProps} />
        </WalletWrapper>
      </SessionProvider>
    </ChakraProvider>
  );
};

export default App;
