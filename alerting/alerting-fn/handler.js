'use strict'
const {Resend} = require('resend');

const resend = new Resend('re_jmYtXDQ7_372FABo7uioddRgEgX8Uqb84');

module.exports = async (event, context) => {
    const result = {
        'body': JSON.stringify(event.body),
        'content-type': event.headers["content-type"]
    }

    const {id, error, params} = event.body;
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'eliseomurillo9@gmail.com',
            subject: `Alerting: Sensor ${id}`,
            html: `<h1>Threshold exceed for sensor ${id}</h1> </br><p>${error}</p></br><p>${params}</p>`
        });
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

