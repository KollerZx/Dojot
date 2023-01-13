import dotenv from 'dotenv'
dotenv.config()

import { Dojot } from './dojot';

describe('Devices', () => {
  let dojot: Dojot
  let template_id: number
  let device_id: string
  let user_id: string
  beforeAll(async () => {
    const host = process.env.DOJOT_HOST
    const port = Number(process.env.DOJOT_PORT)
    const username = process.env.DOJOT_USERNAME
    const password = process.env.DOJOT_PASSWORD
    dojot = new Dojot(host, port, username, password)
    await dojot.auth()
  })

  afterEach(async () => {
    await dojot.deleteAllDevices()
    await dojot.deleteAllTemplates()
    if (user_id) await dojot.removeUser(user_id)
  })
  it('Should be able to register a new template', async () => {
    const response = await dojot.createTemplate({
      label: "Thermometer Template",
      attrs: [
        {
          label: "temperature",
          type: "dynamic",
          value_type: "float"
        },
        {
          label: "fan",
          type: "actuator",
          value_type: "float"
        }
      ]
    })

    expect(response).toHaveProperty('result', "ok")
  })

  it('Should return all templates', async () => {
    await dojot.createTemplate({
      label: "Thermometer Template",
      attrs: [
        {
          label: "temperature",
          type: "dynamic",
          value_type: "float"
        },
        {
          label: "fan",
          type: "actuator",
          value_type: "float"
        }
      ]
    })

    const data = await dojot.getTemplates()

    expect(data.templates.length).toBeGreaterThan(0)
  })

  it('Should be able to register a new device', async () => {
    const result = await dojot.createTemplate({
      label: "Tag RTLS Template",
      attrs: [
        {
          label: "Axis_X",
          type: "dynamic",
          value_type: "float"
        },
        {
          label: "Axis_Y",
          type: "dynamic",
          value_type: "float"
        }
      ]
    })

    template_id = result.template.id

    const response = await dojot.registerDevice({
      data: {
        templates: [
          template_id
        ],
        label: 'Tag-RTLS'
      }
    })

    const [device] = response.devices

    expect(device).toHaveProperty('id')
    expect(device).toHaveProperty('label', 'Tag-RTLS')

  })

  it('Should return all devices', async () => {
    const result = await dojot.createTemplate({
      label: "Tag RTLS Template",
      attrs: [
        {
          label: "Axis_X",
          type: "dynamic",
          value_type: "float"
        },
        {
          label: "Axis_Y",
          type: "dynamic",
          value_type: "float"
        }
      ]
    })

    template_id = result.template.id

    const response = await dojot.registerDevice({
      data: {
        templates: [
          template_id
        ],
        label: 'Tag-RTLS'
      },
      count: 3
    })

    expect(response.devices.length).toBe(3)
  })

  it('Should be able to create a new user', async () => {
    const [response] = await dojot.createUser({
      name: "catarino",
      username: "catarino",
      email: "catarino@aceno.com",
      confirmEmail: "catarino@aceno.com",
      profile: "user",
      service: "catarino"
    })
    user_id = response.user.id

    expect(response).toHaveProperty('message', 'user created')
  })

  it('Should be able to register a new device and generate a trusted CA', async () => {
    const result = await dojot.createTemplate({
      label: "Tag RTLS Template",
      attrs: [
        {
          label: "Axis_X",
          type: "dynamic",
          value_type: "float"
        },
        {
          label: "Axis_Y",
          type: "dynamic",
          value_type: "float"
        }
      ]
    })

    template_id = result.template.id

    const response = await dojot.registerDevice({
      data: {
        templates: [
          template_id
        ],
        label: 'Tag-RTLS'
      }
    })

    const [device] = response.devices

    device_id = device.id

    const responseCA = await dojot.generateTrustedCA(device_id)

    expect(responseCA).toHaveProperty('status', 'ok')
  })
})