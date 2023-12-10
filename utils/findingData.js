const { mySqlDB, pgDB, mongoDB } = require("../models/index")
const Sequelize = require("sequelize")
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

const runSequelizeTests = async func => {
  const models = [
    { dbName: "MySQL", model: mySqlDB },
    { dbName: "Postgres", model: pgDB }
  ]
  for (const { dbName, model } of models) await func(dbName, model)
}

const runMongoTest = async queryFunc => runTest("MongoDB", queryFunc)

const test1 = async () => {
  printTestMsg("Test 1: Querying on JSON column applying not null operator")
  const orders = await runMongoTest(() => mongoDB.Order.find({ order_fees: { $ne: null } }))
  print("orders: ", orders.length)

  await runSequelizeTests(async (dbName, model) => {
    await runTest(dbName, () => model.Order.findAll({ where: { order_fees: { [Sequelize.Op.ne]: null } } }))
  })
}

const searchEndsWithTest = async search => {
  printTestMsg("Searching: ", search)
  const orders = await runMongoTest(() =>
    mongoDB.Order.find({ marketplace_order_id: { $regex: new RegExp(search + "$") } })
  )
  print("orders: ", orders.length)

  await runSequelizeTests(async (dbName, model) => {
    await runTest(dbName, () =>
      model.Order.findAll({ where: { marketplace_order_id: { [Sequelize.Op.like]: `%${search}` } } })
    )
  })
}

const searchStartsWithTest = async search => {
  printTestMsg("Searching: ", search)
  await runMongoTest(() => mongoDB.Order.find({ marketplace_order_id: { $regex: new RegExp("^" + search) } }))

  await runSequelizeTests(async (dbName, model) => {
    await runTest(dbName, () =>
      model.Order.findAll({ where: { marketplace_order_id: { [Sequelize.Op.like]: `${search}%` } } })
    )
  })
}

const searchContainsTest = async search => {
  printTestMsg("Searching: ", search)
  await runMongoTest(() => mongoDB.Order.find({ marketplace_order_id: { $regex: new RegExp(search) } }))

  await runSequelizeTests(async (dbName, model) => {
    await runTest(dbName, () =>
      model.Order.findAll({ where: { marketplace_order_id: { [Sequelize.Op.like]: `%${search}%` } } })
    )
  })
}

const searchTester = async (message, func) => {
  printTestMsg(message)
  let search = "823"

  for (let i = 1; i <= 5; i++) {
    await func(search)
    ;[...Array(2)].forEach(_ => (search += Math.floor(Math.random() * 10)))
  }
}

;(async () => {
  try {
    await test1()
    await searchTester(
      "Test2: Querying on String column applying like operator that starts with specific characters(AAAA%)",
      searchStartsWithTest
    )
    await searchTester(
      "Test3: Querying on String column applying like operator that ends with specific characters(%AAAA)",
      searchEndsWithTest
    )
    await searchTester(
      "Test4: Querying on String column applying like operator that contains a substring(%AAAA%)",
      searchContainsTest
    )
  } catch (error) {
    console.log(error)
  } finally {
    process.exit(0)
  }
})()

// .sort({ created_at: -1 })
//         .limit(10)
