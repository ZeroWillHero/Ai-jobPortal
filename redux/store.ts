import { configureStore } from '@reduxjs/toolkit'
import employeeReducer from './features/employeeSlice'
import jobsReducer from './features/jobSlice'
import authReducer from './features/authSlice'
import questionReducer from './features/questionSlice'

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    jobs: jobsReducer,
    auth: authReducer,
    questions: questionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
