import axios from 'axios'
import { getJWT } from '../utils/auth'

(async () => {

    try {
        const jwt = await getJWT()
        const device_id = '425871'
        const attr = 'temperature'
        const qtyRegisters = 3
        const { data } = await axios({
            method: 'get',
            url: `http://localhost:8000/history/device/${device_id}/history?lastN=${qtyRegisters}&attr=${attr}`,
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${jwt}`,
                'Accept': ['application/json', 'text/csv']
            }
        })

        console.log(data)

    } catch (error) {
        console.error(error)
    }
}
)()

