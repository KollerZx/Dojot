import { RegisterDeviceRequest, TemplateDevice, CreateUserRequest } from "../types";
import axios, { AxiosError } from 'axios';
import { randomUUID } from "crypto";
import WebSocket from 'ws'
export class Dojot {
  private jwt: string
  private ticket: string
  private url: string
  private headers: any

  constructor(private host: string, private port: number, private username: string, private passwd: string) {
    this.jwt = ''
    this.url = `http://${this.host}:${this.port}`
  }

  async auth(): Promise<void> {
    try {
      const { data } = await axios({
        method: 'post',
        url: `${this.url}/auth`,
        data: {
          "username": `${this.username}`,
          "passwd": `${this.passwd}`
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })

      this.jwt = data.jwt

      this.headers = {
        'Authorization': `Bearer ${this.jwt}`,
        'Content-Type': 'application/json'
      }

    } catch (error) {
      console.log(error);

    }
  }

  async getTicketKafka() {
    await this.auth()
    const { data } = await axios.get(`${this.url}/kafka-ws/v1/ticket`, {
      headers: this.headers
    })

    this.ticket = data.ticket
  }

  // TODO: Analisar se o service pode ser o company_id

  async createUser({ name, username, email, confirmEmail, profile, service }: CreateUserRequest) {
    try {

      const id = randomUUID()
      const { data } = await axios.post(`${this.url}/auth/user`, {
        name,
        username,
        profile,
        email,
        confirmEmail,
        service,
        id
      }, {
        headers: this.headers
      })

      return data
    } catch (error) {
      console.log(error);

    }

  }

  async removeUser(id: string) {
    try {
      const { data } = await axios.delete(`${this.url}/auth/user/${id}`, {
        headers: this.headers
      })

      return data
    } catch (error) {
      console.log(error);
    }
  }

  async createTemplate({ label, attrs }: TemplateDevice) {
    try {
      const { data } = await axios.post(`${this.url}/template`, {
        label,
        attrs
      }, {
        headers: this.headers
      })

      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`"Request Axios Error on Create Template" ${error.message}`)
      }
      else {
        throw new Error("Request Error")
      }
    }

  }

  async getTemplates() {
    try {
      const { data } = await axios.get(`${this.url}/template`,
        {
          headers: this.headers
        })

      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`"Request Axios Error" ${error.message}`)
      }
      else {
        throw new Error("Request Error")
      }
    }
  }

  async registerDevice({ data: { label, templates }, count = 1, verbose = false }: RegisterDeviceRequest) {
    try {
      if (count > 1 && verbose) {
        verbose = false
      }
      const { data } = await axios.post(`${this.url}/device?count=${count}&verbose=${verbose}`, {
        label,
        templates
      },
        {
          headers: this.headers
        }
      )
      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`"Request Axios Error on Register Device" ${error.message}`)
      }
      else {
        throw new Error("Request Error")
      }
    }
  }

  async getHistory(device_id: string, attr: string, limit?: number) {
    try {
      const { data } = await axios.get(`http:${this.host}:${this.port}/history/device/${device_id}/history?attr=${attr}&${limit}`, {
        headers: this.headers
      })

      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`"Request Axios Error" ${error.message}`)
      }
      else {
        throw new Error("Request Error")
      }
    }

  }

  async deleteAllTemplates() {
    try {
      const { data } = await axios.delete(`${this.url}/template`, {
        headers: this.headers
      })

      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`"Request Axios Error" ${error.message}`)
      }
      else {
        throw new Error("Request Error")
      }
    }
  }

  async deleteTemplate(id: number) {
    try {
      const { data } = await axios.delete(`${this.url}/template/${id}`, {
        headers: this.headers
      })

      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`"Request Axios Error" ${error.message}`)
      }
      else {
        throw new Error("Request Error")
      }
    }
  }

  async deleteAllDevices() {
    try {
      const { data } = await axios.delete(`${this.url}/device`, {
        headers: this.headers
      })

      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`"Request Axios Error" ${error.message}`)
      }
      else {
        throw new Error("Request Error")
      }
    }
  }

  async deleteDevice(id: string) {
    try {
      const { data } = await axios.delete(`${this.url}/device/${id}`, {
        headers: this.headers
      })

      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`"Request Axios Error" ${error.message}`)
      }
      else {
        throw new Error("Request Error")
      }
    }
  }

  async listenKafka(tenant: string) {
    try {
      await this.getTicketKafka()
      const urlUpgrade = `ws://${this.host}:${this.port}/kafka-ws/v1/topics/${tenant}.device-data?ticket=${this.ticket}`
      const socket = new WebSocket(urlUpgrade)

      socket.on('open', () => {
        console.log('connected', socket.readyState)
        socket.on('message', (data: any) => {
          console.log(data.toString())
        })
      })
    } catch (error) {
      console.error('err', error)
    }

  }
}