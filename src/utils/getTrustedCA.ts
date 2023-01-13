import dotenv from 'dotenv'
dotenv.config()

import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'

const certs = path.resolve('certs')
const execAsync = promisify(exec)

export async function getTrustedCA(device_id: string, username: string, password: string) {
  const args = `-h http://${process.env.DOJOT_HOST} \
                -p ${process.env.DOJOT_PORT} \
                -i ${device_id} \
                -u ${username} \
                -s ${password}
  `

  const { stdout, stderr } = await execAsync(`${certs}/certreq.sh ${args}`, { cwd: certs })

  if (stderr) {
    console.log(stderr);
    return {
      status: 'fail',
      message: 'Could not generated a CA '
    }
  }
  console.log(stdout);
  return {
    status: 'ok',
    message: 'CA generated successfully'
  }
}