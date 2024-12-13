// apiConfig.ts
import axios, { AxiosInstance } from 'axios';
import ApiBaseUrl from 'src/commonExports/apiBaseUrl';



const ApiClient: AxiosInstance = axios.create({
  baseURL: ApiBaseUrl,
  timeout: 0,
  headers: {
    'Content-Type': 'application/json',
  } as any,
});

export default ApiClient;
