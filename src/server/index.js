
import { exec } from 'child_process'
import { promisify } from 'util'
async function mosquittoPub(host, port, tenant, device_id, attr, value) {

    const execAsync = promisify(exec)
    let command = `mosquitto_pub -h ${host} -p ${port}  \
                    -u ${tenant}:${device_id} \
                    -t ${tenant}:${device_id}/attrs \
                    -m '{"${attr}":${value}}' `
    const result = await execAsync(command)
    console.log(result.stdout)
    return result
}

export { mosquittoPub }
