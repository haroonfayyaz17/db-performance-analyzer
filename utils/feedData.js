const { mySqlDB, pgDB, mongoDB } = require("../models/index")

const print = (...msg) => console.log(new Date(), ...msg)
;(async () => {
  try {
    const limit = 1000
    let chunkNo = 1
    while (true) {
      print("processing chunk: ", chunkNo)
      const orders = await mySqlDB.Order.findAll({ limit, offset: (chunkNo - 1) * limit, raw: true })
      if (!orders.length) break

      await Promise.all([mongoDB.Order.insertMany(orders, { ordered: false }), pgDB.Order.bulkCreate(orders, { ignoreDuplicates: true })])

      print("chunk: ", chunkNo, " processed")
      chunkNo++
    }
  } catch (error) {
    console.log(error)
  }
})()
