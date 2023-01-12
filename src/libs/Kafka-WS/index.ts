import WebSocket from 'ws'
import { getTicket } from '../../utils/ticket'
import { Dojot } from '../../modules/dojot'

/** NOTE: Implementado conforme documentação
 * https://dojot.github.io/dojot/subscription-engine/kafka-ws/apiary_v0.7.1.html
 */
// (async () => {
//   try {
//     const ticket = await getTicket()

//     const upgradeUrl = `ws://localhost:8000/kafka-ws/v1/topics/admin.device-data?ticket=${ticket}`

//     const socket = new WebSocket(upgradeUrl)
//     socket.on('open', () => {
//       console.log('connected usando modulo ws', socket.OPEN)
//       socket.on('message', (data: any) => {
//         console.log(data.toString())
//       })
//     })
//   } catch (error) {
//     console.error('err', error)
//   }
// })()

(async () => {
  const dojot = new Dojot("localhost", 8000, "admin", "admin")
  await dojot.listenKafka("admin")
})()
