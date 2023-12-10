require("../config/mongoDb")
const startCase = require("lodash/startCase")
const { mySqlCreds, postgresCreds } = require("../config/sequelizeConfig")
const fs = require("fs")
const path = require("path")
const { Sequelize } = require("sequelize")
const { singularize } = require("i")()

const postgresSequelize = new Sequelize(...postgresCreds)
const mySqlSequelize = new Sequelize(...mySqlCreds)

const readDir = (dir, action) => fs.readdirSync(path.resolve(__dirname, dir)).forEach(action)

const getSequelizeModels = (dir, conn) => {
  const models = {}
  readDir(dir, file => {
    const model = require(path.join(__dirname, dir, file))(conn, Sequelize.DataTypes)
    const modelName = startCase(singularize(model.name))
    models[modelName] = model
  })
  return models
}

const getMongoModels = dir => {
  const models = {}
  readDir(dir, file => {
    const model = require(path.join(__dirname, dir, file))
    const modelName = startCase(singularize(model.modelName))
    models[modelName] = model
  })
  return models
}

const [mySqlDB, pgDB] = [mySqlSequelize, postgresSequelize].map(conn => getSequelizeModels("sequelizeModels", conn))
const mongoDB = getMongoModels("mongoModels")

module.exports = { mySqlDB, pgDB, mongoDB }
