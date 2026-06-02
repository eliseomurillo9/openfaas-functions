async function alerting(report) {
    const webhookUrl = "https://discord.com/api/webhooks/1511273176376545300/3W6ZL4I2YpaMOsgM1_Rpf8VqTrJaIKiqO7csJsJlckvDPpst1RL18Y26GsExM3JIl3RC"

    if (!webhookUrl) {
        throw new Error("Missing DISCORD_WEBHOOK_URL");
    }

    const alertsText = report.alerts
        .map((alert, index) => {
            return [
                `**Alert ${index + 1}**`,
                `Level: ${alert.level}`,
                `Value: ${alert.value}`,
                `Threshold: ${alert.threshold}`,
            ].join("\n");
        })
        .join("\n\n");

    const message = {
        content: "🚨 New IoT warning detected",
        embeds: [
            {
                title: `Sensor ${report.id}`,
                color: 15158332,
                fields: [
                    {
                        name: "Time",
                        value: report.time ?? new Date().toISOString(),
                        inline: false,
                    },
                    {
                        name: "Alerts",
                        value: alertsText || "No alert details",
                        inline: false,
                    },
                ],
            },
        ],
    };

    const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Discord webhook failed: ${response.status} - ${errorBody}`);
    }

    return true;

}

module.exports = {alerting};
