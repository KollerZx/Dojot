import axios from 'axios'
import { getJWT } from './auth'
export async function getTicket() {
    const jwt = await getJWT()
    const { data } = await axios({
        method: 'get',
        url: 'http://localhost:8000/kafka-ws/v1/ticket',
        headers: {
            'authorization': `Bearer ${jwt}`
        }
    })
    const ticket = data.ticket
    return ticket
}
