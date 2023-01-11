import { TemplateDevice } from "../types";
import axios, { AxiosError } from 'axios';

export class Dojot {
  private jwt: string

  constructor(private host: string, private port: number, private username: string, private passwd: string) {
    this.jwt = ''
  }

  async auth(): Promise<void> {
    try {
      const { data } = await axios({
        method: 'post',
        url: `http://${this.host}:${this.port}/auth`,
        data: {
          "username": `${this.username}`,
          "passwd": `${this.passwd}`
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
      this.jwt = data.jwt

    } catch (error) {
      console.log(error);

    }
  }

  async createTemplate({ label, attrs }: TemplateDevice) {
    try {
      const { data } = await axios.post(`http://${this.host}:${this.port}/template`, {
        label,
        attrs
      }, {
        headers: {
          'authorization': `Bearer ${this.jwt}`
        }
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

  async getTemplates() {
    try {
      const { data } = await axios.get(`http://${this.host}:${this.port}/template`,
        {
          headers: {
            'authorization': `Bearer ${this.jwt}`,
            'Content-Type': 'Application/json'
          }
        })

      return data
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`"Request Axios Error" ${error.status}`)
      }
      else {
        throw new Error("Request Error")
      }
    }
  }
}