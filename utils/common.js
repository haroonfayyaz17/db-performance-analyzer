const { singularize } = require("i")()
const merge = require("lodash/merge")
const reduce = require("lodash/reduce")
const moment = require("moment")

module.exports.makeCols = (type, cols) => reduce(cols, (acc, col) => merge(acc, { [col]: type }), {})
module.exports.humanizeTime = ms => {
  const duration = moment.duration(ms)
  const predicate = (arr, unit) => {
    const val = duration[unit]()
    return val ? [`${val} ${val === 1 ? singularize(unit) : unit}`].concat(arr) : arr
  }
  return ["seconds", "minutes", "hours"].reduce(predicate, [`${duration.milliseconds()} ms`]).join(" ")
}
