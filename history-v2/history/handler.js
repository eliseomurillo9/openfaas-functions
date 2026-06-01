'use strict'

const {save} = require("./adapter/mongodb");
const {measure} = require("./utils/measure");
module.exports = async (event, context) => {
  console.time("==== Processing device data ====")
  const deviceItem = event.body

  if (!deviceItem) {
    console.timeEnd("==== Processing device data ====")
    return context.status(200).succeed(JSON.stringify({ message: 'No device data to process' }));
  }

  try {
    const {insertedId} = await save(deviceItem, "history")
    const alert = await measure(deviceItem)

    if (!alert && !insertedId) {
      throw Error("error handling device data")
    }
    console.timeEnd("==== Processing device data ====")
    return context
        .status(200)
        .succeed(JSON.stringify(insertedId));

  } catch (error) {
    console.timeEnd("==== Processing device data ====")
    console.error('Error saving alert: ', error)
    return context
        .status(500)
        .succeed(error)
  }
}
