
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || "2026-10";

export async function shopifyFetch(query, variables = {}) {
    if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
        throw new Error("Shopify is not configured. Set the store domain and Storefront API token.");
    }

    const response = await fetch(
        `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
            },
            body: JSON.stringify({ query, variables }),
        }
    );

    const result = await response.json();

    if (!response.ok || result.errors) {
        console.error("Shopify API Error:", result.errors || result);
        throw new Error("Failed to connect to Shopify");
    }

    return result.data;
}

export async function getProducts() {
    const query = `
    query GetProducts {
      products(first: 50) {
        edges {
          node {
            id
            handle
            title
            description
            productType
            availableForSale

            featuredImage {
              url
              altText
            }

            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }

            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }

            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

    const data = await shopifyFetch(query);

    return data.products.edges.map(({ node }) => ({
        id: node.id,
        handle: node.handle,
        name: node.title,
        category: node.productType || "Other",
        description: node.description,
        price: Number(node.priceRange.minVariantPrice.amount),
        currency: node.priceRange.minVariantPrice.currencyCode,
        image: node.featuredImage?.url || "",
        images: node.images.edges.map(({ node }) => node.url),
        variants: node.variants.edges.map(({ node }) => node),
        availableForSale: node.availableForSale,
    }));
}




export async function getCollections() {
    const query = `
    query GetCollections {
      collections(first: 50) {
        edges {
          node {
            id
            title
            handle
            description

            image {
              url
              altText
            }

            products(first: 50) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  `;

    const data = await shopifyFetch(query);

    return data.collections.edges.map(({ node }) => ({
        id: node.id,
        title: node.title,
        handle: node.handle,
        description: node.description,
        image: node.image?.url || "",
        productIds: node.products.edges.map(
            ({ node: product }) => product.id
        ),
    }));
}






export async function createShopifyCheckout(items) {
    if (!items || items.length === 0) {
        throw new Error("Your bag is empty");
    }

    const lines = items.map((item) => ({
        merchandiseId: item.variantId,
        quantity: Number(item.quantity) || 1,
    }));

    const mutation = `
        mutation CreateCart($lines: [CartLineInput!]!) {
            cartCreate(input: {
                lines: $lines
            }) {
                cart {
                    id
                    checkoutUrl
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;

    const data = await shopifyFetch(mutation, { lines });

    const { cart, userErrors } = data.cartCreate;

    if (userErrors.length > 0) {
        throw new Error(
            userErrors.map((error) => error.message).join(", ")
        );
    }

    if (!cart?.checkoutUrl) {
        throw new Error("Could not create Shopify checkout");
    }

    return cart.checkoutUrl;
}
