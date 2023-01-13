curl -X POST http://localhost:5555/devices -H 'Content-Type:application/json' -d '{"host": "localhost", "port": "1883", "tenant":"admin", "device_id":"35d145", "attr":"activation_code", "value": 2554546456 }' 

## mqtt com TLS
mosquitto_pub -h 192.168.0.123 -p 8883 -u admin:35d145 -t admin:35d145/attrs -m '{"temperature": 17.5}' --cert './cert_35d145/cert.pem' --key './cert_35d145/private.key' --cafile './ca/ca.pem'


./certreq.sh \
  -h http://localhost \
  -p 8000 \
  -i 'bf981a' \
  -u 'admin' \
  -s 'admin'


curl -X POST http://localhost:8000/auth/user \
-H "Authorization: Bearer ${JWT}" \
-H 'Content-Type:application/json' \
-d ' {
  "name": "chileno",
  "username": "chileno",
  "profile: "user",
  "email:"chileno@aceno.com",
  "confirmEmail":"chileno@aceno.com",
  "service": "admin",
  "id": "0b7b2ec8-8c88-5ebc-b0c6-8b42f6f515c7"
}'


JWT=$(curl -s -X POST http://localhost:8000/auth \
-H 'Content-Type:application/json' \
-d '{"username": "admin", "passwd" : "admin"}' | jq -r ".jwt")


curl -X POST http://localhost:8000/template \
-H "Authorization: Bearer ${JWT}" \
-H 'Content-Type:application/json' \
-d ' {
  "label": "Thermometer Template",
  "attrs": [
    {
      "label": "temperature",
      "type": "dynamic",
      "value_type": "float"
    },
    {
      "label": "fan",
      "type": "actuator",
      "value_type": "float"
    }
  ]
}'


curl -X POST http://localhost:8000/device \
-H "Authorization: Bearer ${JWT}" \
-H 'Content-Type:application/json' \
-d ' {
  "templates": [
    "1"
  ],
  "label": "device"
}'