export default {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING,
  poolMin: 120,
  poolMax: 120,
  poolIncrement: 0,
};
