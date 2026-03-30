import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { setJobs, setLoading, setFilters } from '../job.slice.js'
import { fetchJobs } from '../services/job.api.js'
import Navbar from '../../../components/Navbar.jsx'
import useJobs from '../hooks/useJobs.js'



const FilterContent = ({ filters, handleFilter }) => (
    <div className='space-y-4'>
        {[
            {
                label: 'Location',
                key: 'location',
                options: ['All locations', 'Kathmandu', 'Pokhara', 'Chitwan', 'Lalitpur']
            },
            {
                label: 'Category',
                key: 'category',
                options: ['All categories', 'IT/Tech', 'Finance/Banking', 'NGO/INGO', 'Healthcare', 'Education', 'Marketing']
            },
            {
                label: 'Job Type',
                key: 'type',
                options: [
                    { label: 'All types', value: '' },
                    { label: 'Full time', value: 'full-time' },
                    { label: 'Part time', value: 'part-time' },
                    { label: 'Remote', value: 'remote' },
                    { label: 'Internship', value: 'internship' },
                ]
            },
            {
                label: 'Experience',
                key: 'experience',
                options: [
                    { label: 'All levels', value: '' },
                    { label: 'Fresh graduate', value: 'fresh' },
                    { label: '1-2 years', value: '1-2 years' },
                    { label: '3-5 years', value: '3-5 years' },
                    { label: '5+ years', value: '5+ years' },
                ]
            },
        ].map((filter) => (
            <div key={filter.key}>
                <label className='text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block font-medium'>
                    {filter.label}
                </label>
                <select
                    value={filters[filter.key] || ''}
                    onChange={(e) => handleFilter(filter.key, e.target.value)}
                    className='w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 outline-none bg-white dark:bg-gray-700 dark:text-white focus:border-green-500 transition-colors'
                >
                    {filter.options.map((opt) =>
                        typeof opt === 'string'
                            ? <option key={opt} value={opt.includes('All') ? '' : opt}>{opt}</option>
                            : <option key={opt.value} value={opt.value}>{opt.label}</option>
                    )}
                </select>
            </div>
        ))}
    </div>
)


   
const JobList = () => {
    const { jobs, filters, loading, loadJobs, handleFilter } = useJobs()
    const dispatch = useDispatch()
    
    const [keyword, setKeyword] = useState('')
    const [filterOpen, setFilterOpen] = useState(false)

    

    const handleSearch = (e) => {
        e.preventDefault()
        dispatch(setFilters({ keyword }))
    }

    
   
   

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            
            {/* Search bar */}
<div className='bg-green-50 dark:bg-gray-800 py-6 px-4 md:px-6 border-b border-gray-200 dark:border-gray-700'>
    <form onSubmit={handleSearch} className='flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto'>
        <input
            type='text'
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder='Search jobs...'
            className='flex-1 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white'
        />
        <div className='flex gap-2'>
            {/* Mobile filter button */}
            <button
                type='button'
                onClick={() => setFilterOpen(true)}
                className='md:hidden flex-1 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2.5 rounded-lg text-sm'
            >
                Filter
            </button>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type='submit'
                className='flex-1 sm:flex-none bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700'
            >
                Search
            </motion.button>
        </div>
    </form>
</div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {filterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setFilterOpen(false)}
                            className='fixed inset-0 bg-black/50 z-40 md:hidden'
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className='fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-800 z-50 p-6 overflow-y-auto md:hidden'
                        >
                            <div className='flex justify-between items-center mb-6'>
                                <h3 className='font-medium text-gray-800 dark:text-white'>Filters</h3>
                                <button
                                    onClick={() => setFilterOpen(false)}
                                    className='text-gray-500 dark:text-gray-400 text-xl'
                                >
                                    ✕
                                </button>
                            </div>
                            <FilterContent filters={filters} handleFilter={handleFilter} />
                            <button
                                onClick={() => setFilterOpen(false)}
                                className='w-full mt-6 bg-green-600 text-white py-3 rounded-lg text-sm font-medium'
                            >
                                Apply filters
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className='max-w-6xl mx-auto px-4 md:px-6 py-6 flex gap-6'>

                {/* Desktop Sidebar */}
                <div className='hidden md:block w-56 shrink-0'>
                    <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sticky top-4'>
                        <h3 className='text-sm font-medium text-gray-800 dark:text-white mb-4'>Filters</h3>
                       <FilterContent filters={filters} handleFilter={handleFilter} />
                    </div>
                </div>

                {/* Job Cards */}
                <div className='flex-1 min-w-0'>
                    <div className='flex justify-between items-center mb-4'>
                        <span className='text-sm text-gray-500 dark:text-gray-400'>
                            {jobs.length} jobs found
                        </span>
                    </div>

                    {loading ? (
                        <div className='text-center py-20'>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto'
                            />
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className='text-center py-20 text-gray-500 dark:text-gray-400'>
                            No jobs found
                        </div>
                    ) : (
                        <div className='space-y-3'>
                            {jobs.map((job, i) => (
                                <motion.div
                                    key={job._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ y: -2 }}
                                    className={`bg-white dark:bg-gray-800 border rounded-xl p-4 md:p-5 transition-colors ${
                                        job.is_featured
                                            ? 'border-green-500'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-green-400'
                                    }`}
                                >
                                    {job.is_featured && (
                                        <span className='text-xs bg-green-600 text-white px-2 py-1 rounded-full mb-3 inline-block'>
                                            Featured
                                        </span>
                                    )}

                                    <div className='flex items-start gap-3'>
                                        <div className='w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold text-sm shrink-0'>
                                            {job.employer?.logo_url ? (
            <img src={job.employer.logo_url} alt={job.employer.company_name} className='w-full h-full object-cover' />
        ) : (
            job.employer?.company_name?.charAt(0) || 'C'
        )}
                                        </div>

                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-start justify-between gap-2'>
                                                <div>
                                                    <h3 className='text-sm font-medium text-gray-800 dark:text-white'>
                                                        {job.title}
                                                    </h3>
                                               
                                                </div>
                                                <Link
                                                    to={`/jobs/${job._id}`}
                                                    className='text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 shrink-0'
                                                >
                                                    Apply
                                                </Link>
                                            </div>

                                            <div className='flex gap-2 flex-wrap mt-2'>
                                                <span className='text-xs bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium'>
                                                    ✓ Verified
                                                </span>
                                                <span className='text-xs bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full font-medium'>
                                                    Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                                                </span>
                                                <span className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full hidden sm:block'>
                                                    {job.type}
                                                </span>
                                                <span className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full hidden sm:block'>
                                                    {job.experience}
                                                </span>
                                            </div>

                                            <div className='flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700'>
                                                <span className='text-xs text-gray-400'>
                                                    {job.application_count} applications
                                                </span>
                                                <span className='text-xs text-gray-400'>
                                                    {new Date(job.deadline).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default JobList