require("dotenv/config")
const { chunk } = require("lodash")
const { mySqlDB, pgDB, mongoDB } = require("../models/index")
const { humanizeTime } = require("./common")

const print = (...msg) => console.log(new Date(), ...msg)
const printTestMsg = (...msg) => {
  console.log("-".repeat(40))
  console.log(...msg)
  console.log("-".repeat(40))
}

const runTest = async (dbName, func) => {
  printTestMsg("Going to run test on", dbName)
  const startScriptTime = new Date()
  const res = await func()
  print(`Script Takes ${humanizeTime(new Date() - startScriptTime)} to execute `)
  return res
}

;(async () => {
  try {
    const totalRecordsToInsert = +process.env.RECORDS_COUNT
    const limit = 10000
    const payload = {
      marketplace_customer_order_id: null,
      store_name: "amazon",
      marketplace_id: "AAAAAAAAAAAAA",
      buyer_name: "John",
      buyer_email: "433244334554455445",
      fulfillment_channel: "MFN",
      shipping_service: "Standard",
      notice: null,
      issue_reason: null,
      issue_note: null,
      proxy_bce_num: null,
      required_shipping_date: "2017-03-29T07:00:00.000Z",
      order_date: "2017-03-23T11:31:04.000Z",
      required_delivery_date: null,
      marketplace_status_timestamp: null,
      last_checked: "2020-11-24T11:41:16.000Z",
      proxy_bce_timestamp: null,
      manual_locked_at: null,
      cancelled_at: null,
      delay_till: null,
      start_processing_at: null,
      ao_interact_time: null,
      status: "completed",
      feed_data: null,
      wh_address: null,
      marketplace_order_id: "AXASAFSFFW$#$RROWJOWJR",
      marketplace_status: null,
      proxy_supplier_order: null,
      is_locked: false,
      is_user_cancelled: false,
      marketplace_account_id: null,
      note: null,
      email_sent: false,
      wh_id: null,
      warehouse_shipping: 0,
      warehouse_fee: 0,
      return_charges: 0,
      ss_order_id: null,
      is_force_upload_tracking: false,
      order_fees: null
    }

    const data = [...Array(totalRecordsToInsert)].map(_ => ({
      ...payload,
      marketplace_order_id: [...Array(20)].map(_ => Math.floor(Math.random() * 10)).join("")
    }))
    // console.log(data)

    print(data.length)

    let chunkNo = 1
    for (const chunkData of chunk(data, limit)) {
      printTestMsg("Running Test on Chunk: ", chunkNo)
      await runTest("MySQL", () => mySqlDB.Order.bulkCreate(chunkData, { ignoreDuplicates: true }))
      const orders = await mySqlDB.Order.findAll({ order: [["id", "desc"]], raw: true, limit })
      await runTest("Postgres", () => pgDB.Order.bulkCreate(orders, { ignoreDuplicates: true }))

      await runTest("MongoDB", () => mongoDB.Order.insertMany(chunkData, { ordered: false }))
      printTestMsg("Test on Chunk: ", chunkNo, "Completed")
      chunkNo++
    }
  } catch (error) {
    // console.log(error)
  } finally {
    console.log("DONE============")
  }
})()
