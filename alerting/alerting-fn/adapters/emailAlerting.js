const {Resend} = require('resend');

const resend = new Resend('re_jmYtXDQ7_372FABo7uioddRgEgX8Uqb84');

async function emailSender() {
    const {data} = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'eliseomurillo9@gmail.com',
        subject: `Alerting: Sensor ${id}`,
        html: `<h1>Threshold exceed for sensor ${id}</h1> </br><p>${error}</p></br><p>${params}</p>`
    });

    return data.id
}

module.exports = {emailSender};
