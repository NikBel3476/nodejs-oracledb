let connection: {
  user: string;
  password: string;
  connectString: string;
};

let pool: {
  user: string;
  password: string;
  connectString: string;
  poolMax: number;
  poolMin: number;
  poolIncrement: number;
};

if (
  process.env.DB_USER &&
  process.env.DB_PASSWORD &&
  process.env.DB_CONNECTION &&
  process.env.DB_POOL_MAX &&
  process.env.DB_POOL_MIN &&
  process.env.DB_POOL_INCREMENT
) {
  pool = Object.freeze({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION,
    poolMax: Number(process.env.DB_POOL_MAX),
    poolMin: Number(process.env.DB_POOL_MIN),
    poolIncrement: Number(process.env.DB_POOL_INCREMENT),
  });
} else {
  throw new Error("Incorrect database config");
}

if (
  process.env.DB_USER &&
  process.env.DB_PASSWORD &&
  process.env.DB_CONNECTION
) {
  connection = Object.freeze({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION,
  });
} else {
  throw new Error("Incorrect database config");
}

export const dbconfig = {
  connection,
  pool,
};
