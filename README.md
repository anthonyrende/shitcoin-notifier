![image](https://github.com/anthonyrende/shitcoin-notifier/assets/20310701/7a1d6ac8-a84a-46c1-b4ba-a49bed0817b4)



# Shitcoin Notifier

## Overview

Shitcoin Notifier is a Next.js application designed to keep track of cryptocurrency prices and send alerts via Discord. The app integrates with Supabase for backend services and uses various custom hooks for data fetching.

## Features

- Real-time coin price tracking
- Discord notifications
- Supabase integration for backend services
- Custom hooks for data fetching

## Tech Stack

- Next.js
- TypeScript
- Supabase
- Discord API
- @solana/web3.js
- NextAuth

## Quick Start

1. Clone the repo
   ```bash
   git clone https://github.com/anthonyrende/shitcoin-notifier.git

2. Install dependencies
```bash
npm install
```
3. Set up your .env file with your Supabase and Discord credentials.

4. Run the development server
```bash
npm run dev
```
-------

### Custom Hooks

| Hook                    | Description                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| **useFetchCoinDetails** | Fetches detailed information about a specific coin, including metadata and historical data. |
| **useFetchCoinFromWallet** | Retrieves coin data related to the user's Solana wallet.                   |
| **useFetchCoinInfo**    | Fetches general information about a specific coin, such as name and symbol.  |
| **useFetchCoinPrice**   | Fetches the current price of a specific coin in real-time.                   |

### API Endpoints

| Endpoint                        | Description                                                                 |
|---------------------------------|-----------------------------------------------------------------------------|
| **/api/auth/[...nextAuth]**     | Handles authentication via NextAuth.                                         |
| **/api/discord/getDiscordId**   | Retrieves the Discord ID associated with the authenticated user from Supabase.|
| **/api/discord/setDiscordId**   | Sets the Discord ID for the authenticated user from Supabase.                |
| **/api/priceAlerts/createOrUpdateAlert** | Creates or updates a price alert for a specific coin.                    |
| **/api/priceAlerts/getAlert**   | Fetches the existing price alert settings for a specific coin.               |
| **/api/watchlist**              | Manages the user's watchlist of coins, supporting CRUD operations.          |

### Contributing
Feel free to open issues and pull requests!

### Tools

- [Chakra UI](https://chakra-ui.com/) – Accessible, composable, and themeable React components
- [Fontsource](https://fontsource.org/) – Self-hosted fonts for Next.js
- [Framer Motion](https://framer.com/motion) – Motion library for React to animate components with ease
- [Next Seo](https://npmjs.com/package/next-seo) – SEO for Next.js
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter) – Modular TypeScript wallet adapters and components for Solana applications.
### Code Quality

- [TypeScript](https://www.typescriptlang.org/) – Static type checker for end-to-end typesafety
- [Prettier](https://prettier.io/) – Opinionated code formatter for consistent code style
- [ESLint](https://eslint.org/) – Pluggable linter for Next.js and TypeScript
