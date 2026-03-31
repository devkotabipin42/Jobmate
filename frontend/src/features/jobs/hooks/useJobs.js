import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setJobs, setFilters } from '../job.slice.js'
import { fetchJobs, fetchJob , fetchStats } from '../services/job.api.js'
import { useEffect} from 'react'
import { useCallback } from 'react'
import axios from 'axios'
import API_URL from '../../../config/api.js'

const useJobs = () => {
    const dispatch = useDispatch()
    const { jobs, filters } = useSelector(state => state.jobs)
    const [loading, setLoading] = useState(false)
    const [latestJobs, setLatestJobs] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        loadJobs()
    }, [
        filters.keyword,
        filters.location,
        filters.category,
        filters.type,
        filters.experience
    ])

   const loadJobs = useCallback(async () => {
    setLoading(true)
    try {
        const data = await fetchJobs(filters)
        dispatch(setJobs(data))
    } catch (err) {
        setError('Failed to fetch jobs')
    } finally {
        setLoading(false)
    }
}, [filters])

useEffect(() => {
    loadJobs()
}, [loadJobs])

    const loadJob = async (id) => {
        setLoading(true)
        try {
            const data = await fetchJob(id)
            return data
        } catch (err) {
            setError('Failed to fetch job')
            return null
        } finally {
            setLoading(false)
        }
    }

    const handleFilter = (key, value) => {
        dispatch(setFilters({ [key]: value }))
    }

    const clearFilters = () => {
        dispatch(setFilters({
            keyword: '',
            location: '',
            category: '',
            type: '',
            experience: ''
        }))
    }
    const loadLatestJobs = async () => {
    try {
        const res = await axios.get(`${API_URL}/api/jobs`)
        setLatestJobs(res.data.jobs || [])
    } catch (err) {
        console.log(err)
    }
}
const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalJobSeekers: 0,
    fakeJobs: 0
})

const loadStats = async () => {
    try {
        const data = await fetchStats()
        setStats(data)
    } catch (err) {
        console.log(err)
    }
}

    return {
        jobs,
        filters,
        loading,
        error,
        loadJobs,
        latestJobs,
        loadJob,
        handleFilter,
        clearFilters,
        loadLatestJobs,
        stats,
        loadStats
    }
}

export default useJobs