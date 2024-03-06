export default () => ({
  db: {
    type: process.env.DBTYPE,
    username: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    name: process.env.DBNAME,
  },
  jwt: {
    secret: process.env.JWTSECRET,
    ttl: process.env.TTL + "d",
  },
  host: {
    port: parseInt(process.env.PORT) || 5432,
    hostname: process.env.HOST || "127.0.0.1",
  },
  mode: process.env.MODE || "dev",
});
