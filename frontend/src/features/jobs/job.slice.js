import { createSlice } from '@reduxjs/toolkit'

const jobSlice = createSlice({
    name: 'jobs',
    initialState: {
        jobs: [],
        currentJob: null,
        isLoading: false,
        error: null,
        filters: {
            keyword: '',
            location: '',
            category: '',
            type: '',
            experience: ''
        }
    },
    reducers: {
        setJobs: (state, action) => {
            state.jobs = action.payload
        },
        setCurrentJob: (state, action) => {
            state.currentJob = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        resetFilters: (state) => {
            state.filters = {
                keyword: '',
                location: '',
                category: '',
                type: '',
                experience: ''
            }
        }
    }
})

export const { setJobs, setCurrentJob, setLoading, setError, setFilters, resetFilters } = jobSlice.actions
export default jobSlice.reducer