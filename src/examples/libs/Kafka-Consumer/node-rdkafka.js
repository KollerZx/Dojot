const { Kafka: { Consumer } } = require('@dojot/microservice-sdk');

// NOTE: This implementation recommended by the lib, it only works this way if you expose kafka port 9092:9092 in docker-compose
const consumer = new Consumer({
    'enable.async.commit': true,
    'kafka.consumer': {
        'group.id': 'sdk-consumer-example',
        'metadata.broker.list': 'kafka:9092',
    }
});

// register on consumer's events
consumer.on('ready', () => console.log('Received ready event'));
consumer.on('disconnected', () => console.log('Received disconnected event'));
consumer.on('paused', () => console.log('Received paused event'));
consumer.on('resumed', () => console.log('Received resumed event'));
consumer.on('error.connecting', () => console.log('Received error.connecting event'));
consumer.on('error.processing', (cbId, data) => console.log(`Received error.processing event (cbId: ${cbId}: data: ${JSON.stringify(data)}`));

consumer.init().then(() => {
    // the target kafka topic, it could be a String or a RegExp
    const topic = "admin.device-data";
    // Register callback for processing incoming data
    consumer.registerCallback(topic, (data, ack) => {
        // Data processing
        const { value: payload } = data;
        console.log(`Payload: ${payload.toString()}`);
        ack();
    });
}).catch((error) => {
    console.error(`Caught an error: ${error.stack || error}`);
});