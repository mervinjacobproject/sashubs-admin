// apiConfig.ts
import axios, { AxiosInstance } from 'axios';
import ApiLoginUrl from 'src/commonExports/apiLoginUrl';



const ApiLoginClient: AxiosInstance = axios.create({
  baseURL: ApiLoginUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  } as any,
});

export default ApiLoginClient;
