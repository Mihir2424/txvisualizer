import { Flipside } from "@flipsidecrypto/sdk";

// ex: walletaddress=0x900d0881a2e85a8e4076412ad1cefbe2d39c566c

export const getQueryResult = async (walletaddress) => {
    if(!import.meta.env.VITE_FLIPSIDE_API_KEY || !import.meta.env.VITE_FLIPSIDE_URL) {
      throw new Error("Missing environment variables for Flipside API");
    }
    const flipside = new Flipside(
      import.meta.env.VITE_FLIPSIDE_API_KEY,
      import.meta.env.VITE_FLIPSIDE_URL
    );
  
    const sql = `
      SELECT
        date_trunc('hour', block_timestamp) as hour,
        count(distinct tx_hash) as tx_count
        FROM ethereum.core.fact_transactions
            WHERE from_address = '${walletaddress}'
            OR to_address = '${walletaddress}'
            AND from_address != to_address
      GROUP BY 1
    `;
  
    const queryResultSet = await flipside.query.run({ sql: sql });
    return queryResultSet;
  }