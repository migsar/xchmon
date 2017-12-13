CREATE TYPE market_operation AS ENUM ('buy', 'sell');

CREATE TABLE btc_mxn (
  id SERIAL UNIQUE,
  amount NUMERIC NOT NULL,
  rate NUMERIC NOT NULL,
  operation market_operation,
  book VARCHAR(10),
  timestamp TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE,
  "updatedAt" TIMESTAMP WITH TIME ZONE
);
