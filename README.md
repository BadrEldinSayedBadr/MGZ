# MGZ — Wear your own pace

MGZ is a responsive e-commerce storefront concept for vintage-inspired everyday essentials. It brings collections, product details, a shopping bag, and a simple demo checkout together in a calm, editorial shopping experience.

## Features

- Responsive home page with an animated runway hero and collection cards.
- Sweatshirts and sweatpants collections.
- Product pages with color selection, multiple product images, size selection, and related products.
- Search, collection sorting, and a shopping bag with editable items.
- About page, newsletter signup interaction, and a demo checkout flow.
- Keyboard-friendly drawers and dialogs with Escape-to-close behavior.

## Built with

- React 19
- Vite 6
- Plain CSS
- Product photography served by Unsplash; the home-page GIF is stored in `public/`.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Production build

```bash
npm run build
npm run preview
```

The static production output is written to `dist/`.

## Shopify configuration

Create a local `.env` file with the variables shown in `.env.example` to load products during development and local builds. The Shopify Storefront API domain and token must also be available at build time; GitHub Pages does not read your local `.env` file.

In GitHub, open **Settings → Secrets and variables → Actions** and add:

- Repository variable `VITE_SHOPIFY_STORE_DOMAIN` with the Shopify store domain.
- Repository secret `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` with the Storefront API access token.
- Optional repository variable `VITE_SHOPIFY_API_VERSION` to override the API version (defaults to `2026-10`).

The deploy workflow checks that the required domain and token are configured and passes them to Vite while building. Vite embeds these values into the public static site, so the Storefront API token is visible to site visitors; use a Storefront API token with only the permissions needed by this storefront.

## Deploy to GitHub Pages

The included GitHub Actions workflow builds and deploys the site when changes are pushed to `main`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

The Pages build uses the `/MGZ/` base path, matching the repository name. If you rename the repository, update the base path in `vite.config.js` and the workflow setup.

## Demo behavior

The shopping bag, newsletter confirmation, and checkout are front-end demonstrations. No payment or newsletter data is submitted to a backend.
