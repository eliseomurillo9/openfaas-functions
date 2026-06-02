'use strict'
const {discordalerting} = require("./adapters/discordAlerting");

module.exports = async (event, context) => {
    const alerts = event.body;
    try {
        console.log("RUNNING ALERTING")
        await discordalerting(alerts)
        return context
            .status(200)
            .succeed()
    } catch (error) {
        console.error('Error sending email:', error);
        return context
            .status(500)
            .succeed(error)
    }

}

