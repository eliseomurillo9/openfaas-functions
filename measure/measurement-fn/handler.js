'use strict'
const NORMAL_LABEL = 'NORMAL'
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
module.exports = async (event, context) => {

    const {id, temperature, vibration, energyConsumption, time} = event.body

    const vibrationAlerts = evaluateParameterAlert(vibration, THRESHOLDS.VIBRATION)
    const temperatureAlerts = evaluateParameterAlert(temperature, THRESHOLDS.TEMPERATURE)
    const energyConsumptionAlerts = evaluateParameterAlert(energyConsumption, THRESHOLDS.ENERGY_CONSUMPTION)

    if (vibrationAlerts || temperatureAlerts || energyConsumptionAlerts) {
        const message = alertBuilder(id, vibrationAlerts, temperatureAlerts, energyConsumptionAlerts, time)
        const hasCriticalAlert = message.alerts.find(alert => alert.level === CRITICAL_LABEL)
        const hasTwoAlerts = message.alerts.length >= 2

        if (hasCriticalAlert || hasTwoAlerts) {
            console.log('ALERT: ', message)
        }
        return context
            .status(200)
            .succeed(message)

    }

    return context.status(200)
}

