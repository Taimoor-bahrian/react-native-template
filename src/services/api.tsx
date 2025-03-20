import axios from 'axios'
import { Endpoints } from '@app/services/endpoints'

let token = 0

const Api = axios.create({ baseURL: Endpoints.baseUrl })

Api.interceptors.request.use(
  async (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },

  function (error) {
    return Promise.reject(error)
  },
)

Api.interceptors.response.use(
  function (response) {
    return response
  },

  async function (error) {
  
    if (error?.response?.status == 500) {
     
    } else if (error?.response?.status == 404) {
      
    } 
    return Promise.reject(error)
  },
)

export default Api