import { Flipside } from "@flipsidecrypto/sdk";

// ex: walletaddress=0x900d0881a2e85a8e4076412ad1cefbe2d39c566c

export const getQueryResult = async (walletaddress) => {
  if (
    !import.meta.env.VITE_FLIPSIDE_API_KEY ||
    !import.meta.env.VITE_FLIPSIDE_URL
  ) {
    throw new Error("Missing environment variables for Flipside API");
  }
  const flipside = new Flipside(
    import.meta.env.VITE_FLIPSIDE_API_KEY,
    import.meta.env.VITE_FLIPSIDE_URL
  );
  const sql = `
    SELECT address, COUNT(DISTINCT tx_hash) as tx_count
    FROM (
      SELECT to_address as address, tx_hash, 'out' as direction
      FROM ethereum.core.fact_transactions
      WHERE from_address = '${walletaddress}'
        AND from_address != to_address
      UNION ALL
      SELECT from_address as address, tx_hash, 'in' as direction
      FROM ethereum.core.fact_transactions
      WHERE to_address = '${walletaddress}'
        AND from_address != to_address
    ) AS combined
    GROUP BY address;
    `;

  const queryResultSet = await flipside.query.run({ sql: sql });
  return queryResultSet;
};
