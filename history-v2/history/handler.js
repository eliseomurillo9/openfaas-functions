'use strict'
const {measureInvoker} = require('./utils/funtionsInvoker');
const {save} = require("./adapter/mongodb");
module.exports = async (event, context) => {
  console.time("==== Processing device data ====")
  const deviceData = event.body

  try {
    await measureInvoker(deviceData)
    const {insertedId} = await save(deviceData, "history")
    if (!insertedId) {
      throw new Error("error handling device data")
    }
    return context
        .status(200)
        .succeed(JSON.stringify(insertedId));

  } catch (error) {
    console.error('Error saving alert: ', error)
    return context
        .status(500)
        .succeed(error)
  }
}
