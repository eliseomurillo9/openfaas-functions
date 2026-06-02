import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 20,          // virtual users
    iterations: 100
};

export default function () {
    const payload = JSON.stringify({
        id: `sensor-${Math.floor(Math.random() * 100000)}`,
        temperature: Math.floor(Math.random() * 100),
        vibration: Math.floor(Math.random() * 30),
        energyConsumption: Math.floor(Math.random() * 100),
        time: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
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
