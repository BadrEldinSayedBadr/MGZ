
import { shopifyFetch } from "./services/shopify";

const query = `
  query {
    shop {
      name
      primaryDomain {
        host
      }
    }

    products(first: 5) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

async function testConnection() {
  try {
    console.log("Connecting to Shopify...");

    const data = await shopifyFetch(query);

    console.log("Shopify Connected Successfully!");
    console.log("Store:", data.shop.name);
    console.log("Domain:", data.shop.primaryDomain.host);
    console.log("Products:", data.products.edges.map(
      ({ node }) => node.title
    ));

  } catch (error) {
    console.error("Shopify Connection Failed:", error);
  }
}

testConnection();
