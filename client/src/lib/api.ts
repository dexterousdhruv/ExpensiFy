import axios, { AxiosRequestConfig } from "axios";


export const apiUrl = import.meta.env.VITE_API_URL + "/api" ||  "http://localhost:3000/api"

export const apiCall = (method: string, path: string, token?: string | any, params?: any, data?: any) => {
  const config: AxiosRequestConfig = {
    method,
    url: apiUrl + path,
    headers: {
      Access_Token: token,
    },
    ...(params && { params }), 
    ...(data && { data }), 
  }
  return axios(config)
}
