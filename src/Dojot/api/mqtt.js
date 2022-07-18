import fs from 'fs'
import mqtt from 'mqtt'
import path from 'path'
/** NOTE: Deve ser gerado um certificado para cada dispositivo cadastrado
 * Através do script: certereq.sh
 * ou Através da interface do dojot
 */
const options = {
    key: fs.readFileSync(path.join(__dirname, './certs/cert_425871/private.key')),
    cert: fs.readFileSync(path.join(__dirname, './certs/cert_425871/cert.pem')),
    ca: fs.readFileSync(path.join(__dirname, './certs/ca/ca.pem')),
    clientId: 'simple-mqtt-client',
    checkServerIdentity: function (servername, cert) {
        return undefined
    },
    rejectUnauthorized: false,
    protocol: 'mqtts',
    username: 'admin',
    password: 'admin'
}

const client = mqtt.connect('mqtts://192.168.0.123:8883', options)

async function runMqtt(tenant, device_id, attr, value) {
    client.on('connect', () => {
        console.log('connected', client.connected)
        client.subscribe(`${tenant}:${device_id}/attrs`)
        setInterval(() => {
            let value = Math.floor(Math.random() * 100)
            client.publish(`${tenant}:${device_id}/attrs`, `{"${attr}":${value}}`)
        }, 3000)
    })

    client.on('message', (topic, message) => {
        console.log('msg recebida', message)
    })
}

runMqtt('admin', '425871', 'temperature')