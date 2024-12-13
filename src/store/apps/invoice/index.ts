// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import ApiClient from 'src/apiClient/apiClient/apiConfig'

interface DataParams {
  firstname: string
  dates?: Date[]
  status: string
  
}

interface AppState {
  data: any[]
  total: number
  params: DataParams
  allData: any[]
  loading: boolean;
}

const initialState: AppState = {
  data: [],
  total: 1,
  params: { firstname: '', status: '' }, 
  allData: [],
  loading: false,
}

export const appInvoiceSlice = createSlice({
  name: 'appInvoice',
  initialState,
  reducers: {
    setData: (state:any) => {
      state.loading = true
      state.error = null
    },
  },
})


export const fetchData = () => async () => {
  try {
    const response = await ApiClient.get('/api.php?moduletype=employee&apitype=list_all');

    return response.data; 

  } catch (error) {
    console.error('API Error:', error);
    throw error; 
  }
};
export default appInvoiceSlice.reducer

