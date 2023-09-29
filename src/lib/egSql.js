export const sqladdressTxTime = `
SELECT
  address,
  COUNT(DISTINCT tx_hash) as tx_count,
  date_trunc('hour', block_timestamp) as hour
FROM
  (
    SELECT
      to_address as address,
      tx_hash,
      block_timestamp
    FROM
      ethereum.core.fact_transactions
    WHERE
      from_address = '0x900d0881a2e85a8e4076412ad1cefbe2d39c566c'
      AND from_address != to_address
    UNION ALL
    SELECT
      from_address as address,
      tx_hash,
      block_timestamp
    FROM
      ethereum.core.fact_transactions
    WHERE
      to_address = '0x900d0881a2e85a8e4076412ad1cefbe2d39c566c'
      AND from_address != to_address
  ) AS combined
GROUP BY
  address, hour;
`;

export const sql = `
SELECT
  date_trunc('hour', block_timestamp) as hour,
  count(distinct tx_hash) as tx_count
  FROM ethereum.core.fact_transactions
      WHERE from_address = '0x900d0881a2e85a8e4076412ad1cefbe2d39c566c'
      OR to_address = '0x900d0881a2e85a8e4076412ad1cefbe2d39c566c'
      AND from_address != to_address
GROUP BY 1
`;

export const sqladdressTx = `
SELECT address, COUNT(DISTINCT tx_hash) as tx_count
FROM (
  SELECT to_address as address, tx_hash, 'out' as direction
  FROM ethereum.core.fact_transactions
  WHERE from_address = '0x900d0881a2e85a8e4076412ad1cefbe2d39c566c'
    AND from_address != to_address
  UNION ALL
  SELECT from_address as address, tx_hash, 'in' as direction
  FROM ethereum.core.fact_transactions
  WHERE to_address = '0x900d0881a2e85a8e4076412ad1cefbe2d39c566c'
    AND from_address != to_address
) AS combined
GROUP BY address;
    `;
