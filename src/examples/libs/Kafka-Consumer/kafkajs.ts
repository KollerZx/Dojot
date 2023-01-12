import { Kafka } from "kafkajs"

// NOTE: This implementation it only works this way if you expose kafka port 9092:9092 in docker-compose
const run = async (tenant: string) => {
    const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['kafka:9092']
    })

    const consumer = kafka.consumer({ groupId: 'my-group' })
    await consumer.connect()
    await consumer.subscribe({
        topic: `${tenant}.device-data`,
        fromBeginning: true
    })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }: any) => {
            console.log(`Received message ${message.value.toString()}`)
        }
    })
}

run('admin').catch(console.error)