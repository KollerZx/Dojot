import axios from 'axios'

export async function getJWT() {
    const { data } = await axios({
        method: 'post',
        url: 'http://localhost:8000/auth',
        data: {
            "username": "admin",
            "passwd": "admin"
        },
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const { jwt } = data
    return jwt
}
