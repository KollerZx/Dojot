import { Dojot } from './dojot';
describe('Get Templates', () => {
  let dojot: Dojot

  beforeAll(async () => {
    dojot = new Dojot('localhost', 8000, 'admin', 'admin')
    await dojot.auth()
  })

  it('Deve retornar todos templates cadastrados', async () => {
    const data = await dojot.getTemplates()

    expect(data.templates.length).toBeGreaterThan(0)

  })
})