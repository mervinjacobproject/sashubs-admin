// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import userProfileReducer from 'src/store/apps/admin';
import dataReducer from 'src/store/apps/role';
import pageMaster from 'src/store/apps/pageMaster'

export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    calendar,
    permissions,
    userProfile: userProfileReducer,
    role: dataReducer,
    pageMaster


  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const { dispatch } = store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>