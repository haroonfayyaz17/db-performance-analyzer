require("dotenv/config")
const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_CONN_STRING).catch(() => {
  throw new Error("Unable to connect with DB")
})
