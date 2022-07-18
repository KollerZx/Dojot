import express from 'express'
import { mosquittoPub } from './server'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/devices', async (req, res) => {
    try {
        const { host, port, tenant, device_id, attr, value } = req.body
        await mosquittoPub(host, port, tenant, device_id, attr, value)
        res.send('ok')
    } catch (error) {
        console.log(error)
    }
})

app.listen(5555, () => console.log('listening on port 5555'))

