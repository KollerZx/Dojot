import { Kafka } from "kafkajs"
//NOTE: O consumer só funciona dessa forma, se expor no docker-compose a porta do kafka 9092:9092
const run = async () => {
    const kafka = new Kafka({
        clientId: 'my-app',
        brokers: ['kafka:9092']
    })

    const consumer = kafka.consumer({ groupId: 'my-group' })
    await consumer.connect()
    await consumer.subscribe({
        topic: 'admin.device-data',
        fromBeginning: true
    })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }: any) => {
            console.log(`Received message ${message.value.toString()}`)
        }
    })
}

run().catch(console.error)