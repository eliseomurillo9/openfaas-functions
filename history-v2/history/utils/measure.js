'use strict'
const {save} = require("../adapter/mongodb");
const {alerting} = require("./alerting");

const WARNING_LABEL = 'WARNING'
const CRITICAL_LABEL = 'CRITICAL'

const THRESHOLDS = {
    'TEMPERATURE': {
        'warning': 70,
        'critical': 90
    },
    'VIBRATION': {
        'warning': 4,
        'critical': 7
    },
    'ENERGY_CONSUMPTION': {
        'warning': 800,
        'critical': 1000
    }
}

const evaluateParameterAlert = (parameter, thresholds) => {

    if (parameter > thresholds.warning && parameter < thresholds.critical) {
        console.log(`WARNING: ${parameter}`)
        return {
            level: WARNING_LABEL,
            value: parameter,
            threshold: thresholds.warning
        }
    } else if (parameter > thresholds.critical) {
        console.log(`CRITICAL: ${parameter}`)
        return {
            level: CRITICAL_LABEL,
            value: parameter,
            threshold: thresholds.critical
        }
    } else {
        return false;
    }
}

const alertBuilder = (id, vibrationWarning, temperatureWarning, energyWarning, time) => {
    const warnings = {
        id,
        alerts: [],
        time: time ?? new Date(Date.now()).toISOString()
    }

    if (vibrationWarning) warnings.alerts.push(vibrationWarning)
    if (temperatureWarning) warnings.alerts.push(temperatureWarning)
    if (energyWarning) warnings.alerts.push(energyWarning)

    return warnings

}

async function measure(deviceData) {

    const {id, temperature, vibration, energyConsumption, time} = deviceData

    const vibrationAlerts = evaluateParameterAlert(vibration, THRESHOLDS.VIBRATION)
    const temperatureAlerts = evaluateParameterAlert(temperature, THRESHOLDS.TEMPERATURE)
    const energyConsumptionAlerts = evaluateParameterAlert(energyConsumption, THRESHOLDS.ENERGY_CONSUMPTION)

    if (vibrationAlerts || temperatureAlerts || energyConsumptionAlerts) {
        const message = alertBuilder(id, vibrationAlerts, temperatureAlerts, energyConsumptionAlerts, time)
        const hasCriticalAlert = message.alerts.find(alert => alert["level"] === CRITICAL_LABEL)
        const hasTwoAlerts = message.alerts.length >= 2

        if (hasCriticalAlert || hasTwoAlerts) {
            try {
                const {insertedId} = await save(message, "alerts")
                const alertness = await alerting(message)

                if (!alertness && !insertedId) {
                    return insertedId
                }
            } catch (error) {
                console.error('Error saving alert: ', error)
                throw error
            }
        }
    }

    return true;
}

module.exports = { measure };
