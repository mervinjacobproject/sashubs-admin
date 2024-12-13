import { createSlice } from '@reduxjs/toolkit';
import ApiClient from 'src/apiClient/apiClient/apiConfig';
import AppSink from 'src/commonExports/AppSink';

const initialState = {
  pageNames: [],
  loading: false,
  error: null
};

const dataSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess(state, action) {
      state.loading = false;
      state.pageNames = action.payload.map((item:any) => item);
    },
    fetchDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure } = dataSlice.actions;

export const fetchDataRole = (roleId: any) => async (dispatch: any) => {

  dispatch(fetchDataStart());
  try {
    const query = `query MyQuery {
      listUserPermission5AABS(filter: {UserId: {eq: ${roleId}}}) {
        items {
          CreatePermission
          ID
          PageId
          UserId
          ViewPermission
          WritePermission
        }
      }
    }`;

    const headers = {
      'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq',
      'Content-Type': 'application/json'
    };

    const response = await ApiClient.post(`${AppSink}`, { query }, { headers });
    const data = response.data.data.listUserPermission5AABS.items;
    dispatch(fetchDataSuccess(data));

    return data;
  }
  catch (error) {
    dispatch(fetchDataFailure(error));
  }
};

export default dataSlice.reducer;