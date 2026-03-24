import { createSlice } from '@reduxjs/toolkit'

const employerSlice = createSlice({
    name: 'employer',
    initialState: {
        myJobs: [],
        applications: [],
        isLoading: false,
        error: null
    },
    reducers: {
        setMyJobs: (state, action) => {
            state.myJobs = action.payload
        },
        setApplications: (state, action) => {
            state.applications = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        removeJob: (state, action) => {
            state.myJobs = state.myJobs.filter(j => j._id !== action.payload)
        }
    }
})

export const { setMyJobs, setApplications, setLoading, removeJob } = employerSlice.actions
export default employerSlice.reducer