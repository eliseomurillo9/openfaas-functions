const {Resend} = require('resend');

const resend = new Resend('re_jmYtXDQ7_372FABo7uioddRgEgX8Uqb84');

async function alerting(report) {

        const {data, error} = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'eliseomurillo9@gmail.com',
            subject: `Alerting: Sensor ${report.id}`,
            html: `<h1>Threshold exceed for sensor ${report.id}</h1> </br><p>${report.alerts}</p>`
        });

        if (error) throw error;
        return data;
}
module.exports = {alerting};
