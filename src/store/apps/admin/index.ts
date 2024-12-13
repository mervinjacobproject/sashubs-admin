import { createSlice } from '@reduxjs/toolkit';
import ApiClient from 'src/apiClient/apiClient/apiConfig';
import AppSink from 'src/commonExports/AppSink';


const getUserIdFromLocalStorage = () => {
  return localStorage.getItem('adminLoginId');
};

// const fetchUserProfileData = async (userId: any) => {
//   try {
//     const query = `query MyQuery {
//       listUsers5AABS(filter: {ID: {eq: ${userId}}}) {
//         items {
//           Date
//           FirstName
//           ID
//           LastName
//           Password
//           ProfileImage
//           RoleId
//           Status
//           UserId
//           UserName
//           UserType
//         }
//       }
//     }`;
  
//     const headers = {
//       'x-api-key': 'da2-jowogob3crfi3fnfp4artz6syq', 
//       'Content-Type': 'application/json'
//     };

//     const response = await ApiClient.post(`${AppSink}`, { query }, { headers });
    
//     return response.data.data.listUsers5AABS.items;
//   } catch (error) {
//     console.error("Error fetching user profile data:", error);
//     throw error; 
//   }
// };

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUserProfile: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const fetchUserProfile = () => async (dispatch:any) => {
  try {
    dispatch(setLoading());
    const userId = getUserIdFromLocalStorage();
    if (!userId) {
      throw new Error('User ID not found in localStorage');
    }
    // const data = await fetchUserProfileData(userId);

    // dispatch(setUserProfile(data));
  } catch (error:any) {
    dispatch(setError(error.message));
  }
};

export const { setUserProfile, setLoading, setError } = userProfileSlice.actions;
export const selectUserProfile = (state:any) => state.userProfile;

export default userProfileSlice.reducer;
