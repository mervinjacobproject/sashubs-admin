import axios, { AxiosInstance } from 'axios';
import PrintUrl from 'src/commonExports/printUrl';



const PrintApiClient: AxiosInstance = axios.create({
  baseURL: PrintUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  } as any,
});

export default PrintApiClient;