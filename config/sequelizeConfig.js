require("dotenv/config")

const envKeys = ["USER", "PASSWORD", "NAME", "HOST"]
const [mySqlCreds, postgresCreds] = ["MYSQL", "POSTGRES"].map(dialect => {
  const [username, password, database, host] = envKeys.map(key => process.env[`${dialect}_${key}`])
  return [database, username, password, { host, dialect: dialect.toLowerCase(), logging: false }]
})

module.exports = { mySqlCreds, postgresCreds }
