import { createSlice } from '@reduxjs/toolkit'
import ApiClient from 'src/apiClient/apiClient/apiConfig'
import AppSink from 'src/commonExports/AppSink'

const initialState = {
  pageMaster: [],
  loading: false,
  error: null
}

const dataSlice = createSlice({
  name: 'pageMaster',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.loading = true
      state.error = null
    },
    fetchDataSuccess(state, action) {
      state.loading = false
      state.pageMaster = action.payload.map((item: any) => item)
    },
    fetchDataFailure(state, action) {
      state.loading = false
      state.error = action.payload
    }
  }
})
export const { fetchDataStart, fetchDataSuccess, fetchDataFailure } = dataSlice.actions

export const fetchDataPageMaster = () => async (dispatch: any) => {
  dispatch(fetchDataStart())
  try {
    const query = `query MyQuery {
            listPageMaster5AABS {
              items {
                GroupName
                ID
                PageName
                PageURL
              }
            }
          }`
    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    }
    const response = await ApiClient.post(`${AppSink}`, { query }, { headers })
    const data = response.data.data.listPageMaster5AABS.items
    dispatch(fetchDataSuccess(data))

    return data
  } catch (error) {
    dispatch(fetchDataFailure(error))
  }
}

export default dataSlice.reducer
