import http from 'k6/http';
import {check, sleep} from 'k6';

export const options = {
    vus: 20,          // virtual users
    iterations: 300
};

export default function () {
    const payload = JSON.stringify({
        id: `sensor-${Math.floor(Math.random() * 100000)}`,

        temperature: Math.random() < 0.1
            ? Math.floor(Math.random() * 30) + 70
            : Math.floor(Math.random() * 45) + 20,

        vibration: Math.random() < 0.1
            ? Number((Math.random() * 5 + 4).toFixed(2))
            : Number((Math.random() * 3.5).toFixed(2)),

        energyConsumption: Math.random() < 0.1
            ? Math.floor(Math.random() * 400) + 800
            : Math.floor(Math.random() * 500) + 250,

        time: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(
        'http://127.0.0.1:8080/function/history',
        payload,
        params
    );

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}
