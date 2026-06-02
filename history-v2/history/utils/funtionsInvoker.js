async function measureInvoker(deviceData) {
    await fetch("http://gateway.openfaas.svc.cluster.local:8080/async-function/measurement-fn", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(deviceData)
    })
}


module.exports = { measureInvoker }
