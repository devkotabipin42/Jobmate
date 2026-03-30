import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setJobs, setFilters } from '../job.slice.js'
import { fetchJobs, fetchJob } from '../services/job.api.js'
import { useEffect} from 'react'
import { useCallback } from 'react'

const useJobs = () => {
    const dispatch = useDispatch()
    const { jobs, filters } = useSelector(state => state.jobs)
    const [loading, setLoading] = useState(false)
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

    return {
        jobs,
        filters,
        loading,
        error,
        loadJobs,
        loadJob,
        handleFilter,
        clearFilters
    }
}

export default useJobs