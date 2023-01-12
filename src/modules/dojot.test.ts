import { Dojot } from './dojot';
describe('Devices', () => {
  let dojot: Dojot
  let template_id: number
  let device_id: string
  beforeAll(async () => {
    dojot = new Dojot('localhost', 8000, 'admin', 'admin')
    await dojot.auth()
  })

  afterEach(async () => {
    await dojot.deleteAllDevices()
    await dojot.deleteAllTemplates()
  })
  it('Deve ser possível cadastrar um novo template', async () => {
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

  it('Deve retornar todos templates cadastrados', async () => {
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

  it('Deve ser possível cadastrar um novo dispositivo', async () => {
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

  it('Deve retornar todos os dispositivos cadastrados', async () => {
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
})