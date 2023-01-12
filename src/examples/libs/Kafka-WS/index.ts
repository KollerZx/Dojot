import { Dojot } from '../../../modules/dojot'

/** NOTE: Implementado conforme documentação
 * https://dojot.github.io/dojot/subscription-engine/kafka-ws/apiary_v0.7.1.html
 */

(async () => {
  const dojot = new Dojot("localhost", 8000, "admin", "admin")
  await dojot.listenKafka("admin")
})()
