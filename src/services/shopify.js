
const STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION;

const SHOPIFY_ENDPOINT =
  `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

export async function shopifyFetch(query, variables = {}) {
  const response = await fetch(SHOPIFY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  if (!response.ok || result.errors) {
    throw new Error(
      result.errors?.[0]?.message || "Shopify API Error"
    );
  }

  return result.data;
}
