import fs from 'node:fs'

import mqtt, { IClientOptions } from 'mqtt'

/** NOTE: Deve ser gerado um certificado para cada dispositivo cadastrado
 * Através do script: certereq.sh
 * ou Através da interface do dojot
 */

const device_id = '35d145'
const options: IClientOptions = {
    key: fs.readFileSync(`./certs/cert_${device_id}/private.key`),
    cert: fs.readFileSync(`./certs/cert_${device_id}/cert.pem`),
    ca: fs.readFileSync('./certs/ca/ca.pem'),
    clientId: 'simple-mqtt-client',
    rejectUnauthorized: false,
    protocol: 'mqtts',
    username: 'admin',
    password: 'admin',
    host: '192.168.0.159',
    port: 8883
}
// 'mqtts://192.168.0.123:8883
const client = mqtt.connect(options)

async function runMqtt(tenant: string, device_id: string, attr: string, value?: number) {
    client.on('connect', () => {
        console.log('connected', client.connected)
        client.subscribe(`${tenant}:${device_id}/attrs`)
        if (!value) {
            setInterval(() => {
                let value = Math.floor(Math.random() * 100)
                client.publish(`${tenant}:${device_id}/attrs`, `{"${attr}":${value}}`)
            }, 3000)
        }
        client.publish(`${tenant}:${device_id}/attrs`, `{"${attr}":${value}}`)
    })

    client.on('message', (topic, message) => {
        console.log('msg recebida', message)
    })
}

runMqtt('admin', '35d145', 'temperature')