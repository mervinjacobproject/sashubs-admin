// apiConfig.ts
import axios, { AxiosInstance } from 'axios'
import ApiLoginUrl from 'src/commonExports/apiLoginUrl'

const ApiLoginClient: AxiosInstance = axios.create({
  baseURL: ApiLoginUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
    // 'x-api-key': 'M00iB3EO2A3Gc9ZEcB9VR7zLdkQoBCO4ONdMqd07'
  } as any
})

export default ApiLoginClient
