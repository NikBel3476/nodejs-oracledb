let dbconfig: {
  user: string;
  password: string;
  connectString: string;
};

if (
  process.env.DB_USER &&
  process.env.DB_PASSWORD &&
  process.env.DB_CONNECTION
) {
  dbconfig = Object.freeze({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION,
  });
} else {
  throw new Error("Incorrect database config");
}

export default dbconfig;
