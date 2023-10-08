
   ![image](https://github.com/anthonyrende/shitcoin-notifier/assets/20310701/244c08cc-02a6-42f8-82a1-0a7ae11bf393)


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

## Quick Start

1. Clone the repo
   ```bash
   git clone https://github.com/anthonyrende/shitcoin-notifier.git

Install dependencies
```bash
npm install
```
2. Set up your .env file with your Supabase and Discord credentials.

3. Run the development server
```bash
npm run dev
```

### Custom Hooks
- useFetchCoinDetails
- useFetchCoinFromWallet
- useFetchCoinInfo
- useFetchCoinPrice

### API Endpoints
- /api/auth/[...nextAuth]
- /api/discord/getDiscordId
- /api/discord/setDiscordId
- /api/priceAlerts/createOrUpdateAlert
- /api/priceAlerts/getAlert
- /api/watchlist

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
