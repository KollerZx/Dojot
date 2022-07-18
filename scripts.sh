curl -X POST http://localhost:5555/devices -H 'Content-Type:application/json' -d '{"host": "localhost", "port": "1883", "tenant":"admin", "device_id":"ddd6b7", "attr":"activation_code", "value": 2554546456 }' 

## mqtt com TLS
mosquitto_pub -h 192.168.0.123 -p 8883 -u admin:425871 -t admin:425871/attrs -m '{"temperature": 17.5}' --cert './cert_425871/cert.pem' --key './cert_425871/private.key' --cafile './ca/ca.pem'