import SEO from '../../../components/SEO.jsx'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { setFilters } from '../job.slice.js'
import Navbar from '../../../components/Navbar.jsx'
import Footer from '../../../components/Footer.jsx'
import useJobs from '../hooks/useJobs.js'

const filterConfig = [
  { label: 'Location', key: 'location', options: [{ label: 'All Locations', value: '' }, { label: 'Kathmandu', value: 'Kathmandu' }, { label: 'Pokhara', value: 'Pokhara' }, { label: 'Lalitpur', value: 'Lalitpur' }, { label: 'Chitwan', value: 'Chitwan' }, { label: 'Remote', value: 'Remote' }] },
  { label: 'Category', key: 'category', options: [{ label: 'All Categories', value: '' }, { label: 'IT/Tech', value: 'IT/Tech' }, { label: 'Finance/Banking', value: 'Finance/Banking' }, { label: 'NGO/INGO', value: 'NGO/INGO' }, { label: 'Healthcare', value: 'Healthcare' }, { label: 'Education', value: 'Education' }, { label: 'Marketing', value: 'Marketing' }, { label: 'Hospitality', value: 'Hospitality' }] },
  { label: 'Job Type', key: 'type', options: [{ label: 'All Types', value: '' }, { label: 'Full Time', value: 'full-time' }, { label: 'Part Time', value: 'part-time' }, { label: 'Remote', value: 'remote' }, { label: 'Internship', value: 'internship' }, { label: 'Contract', value: 'contract' }] },
  { label: 'Experience', key: 'experience', options: [{ label: 'All Levels', value: '' }, { label: 'Fresh Graduate', value: 'fresh' }, { label: '1-2 Years', value: '1-2 years' }, { label: '3-5 Years', value: '3-5 years' }, { label: '5+ Years', value: '5+ years' }] },
]

const FilterContent = ({ filters, handleFilter, onClose }) => (
  <div className='space-y-5'>
    {filterConfig.map((filter) => (
      <div key={filter.key}>
        <label className='text-xs font-semibold text-gray-500 dark:text-white/30 uppercase tracking-widest mb-2 block'>
          {filter.label}
        </label>
        <select
          value={filters[filter.key] || ''}
          onChange={(e) => handleFilter(filter.key, e.target.value)}
          className='w-full text-sm border border-gray-200 dark:border-white/8 rounded-xl px-3 py-2.5 outline-none bg-white dark:bg-white/5 dark:text-white focus:border-green-500 dark:focus:border-green-500/50 transition-colors cursor-pointer'
        >
          {filter.options.map(opt => (
            <option key={opt.value} value={opt.value} className='dark:bg-[#0c1a2e]'>{opt.label}</option>
          ))}
        </select>
      </div>
    ))}
    {onClose && (
      <button onClick={onClose} className='w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors'>
        Apply Filters
      </button>
    )}
  </div>
)

const JobList = () => {
  const { jobs, filters, loading, handleFilter } = useJobs()
  const dispatch = useDispatch()
  const [keyword, setKeyword] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    dispatch(setFilters({ keyword }))
  }

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== '').length

  return (
    <div className='min-h-screen bg-white dark:bg-[#08111f] transition-colors duration-300'>
      <SEO
    title="Job Vacancies in Nawalparasi, Butwal, Lumbini — Browse All Jobs"
    description="Browse verified job vacancies in Nawalparasi, Parasi, Butwal & all of Nepal. Filter by location, salary, category. Apply instantly."
    keywords="job vacancy nawalparasi 2026, butwal job vacancy, lumbini jobs, nepal job search"
    url="/jobs"
/>

      {/* ── TOP SEARCH HERO ─────────────────────────────── */}
      <div className='relative overflow-hidden bg-white dark:bg-[#08111f]'>
        {/* Grid */}
        <div className='absolute inset-0 opacity-20 dark:opacity-100'
          style={{ backgroundImage: 'linear-gradient(rgba(22,163,74,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.06) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        {/* Glows */}
        <div className='absolute -top-10 -right-10 w-72 h-72 rounded-full opacity-0 dark:opacity-100 pointer-events-none'
          style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 65%)' }} />

        <Navbar />

        <div className='relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 text-center'>
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className='inline-flex items-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/25 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-xs font-medium mb-5'>
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} className='w-1.5 h-1.5 bg-green-500 rounded-full' />
            {jobs.length}+ Verified Jobs Available
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className='text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight'>
            Find Your Perfect Job
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className='text-sm text-gray-500 dark:text-white/40 mb-8'>
            All jobs verified — salary always visible
          </motion.p>

          {/* Search */}
          <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className='flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto'>
            <div className='flex-1 flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 focus-within:border-green-400 dark:focus-within:border-green-500/50 transition-colors'>
              <svg className='w-4 h-4 text-gray-400 dark:text-white/25 shrink-0' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.35-4.35'/></svg>
              <input type='text' value={keyword} onChange={e => setKeyword(e.target.value)}
                placeholder='Job title, skills or company...'
                className='flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/25' />
            </div>
            <div className='flex gap-2'>
              <button type='button' onClick={() => setFilterOpen(true)}
                className='md:hidden relative flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 px-4 py-3 rounded-2xl text-sm font-medium transition-colors'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><line x1='4' y1='6' x2='20' y2='6'/><line x1='8' y1='12' x2='16' y2='12'/><line x1='12' y1='18' x2='12' y2='18'/></svg>
                Filters
                {activeFiltersCount > 0 && <span className='absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold'>{activeFiltersCount}</span>}
              </button>
              <button type='submit' className='flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 justify-center transition-colors'>
                <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.35-4.35'/></svg>
                Search
              </button>
            </div>
          </motion.form>

          {/* Active filters chips */}
          {activeFiltersCount > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='flex items-center gap-2 flex-wrap justify-center mt-4'>
              <span className='text-xs text-gray-400 dark:text-white/30'>Active:</span>
              {Object.entries(filters).filter(([k, v]) => v).map(([key, val]) => (
                <motion.span key={key} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                  onClick={() => handleFilter(key, '')}
                  className='inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/25 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs cursor-pointer hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors'>
                  {val}
                  <svg className='w-3 h-3' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><path d='M18 6 6 18M6 6l12 12'/></svg>
                </motion.span>
              ))}
              <button onClick={() => filterConfig.forEach(f => handleFilter(f.key, ''))}
                className='text-xs text-gray-400 dark:text-white/30 hover:text-red-500 transition-colors'>
                Clear all
              </button>
            </motion.div>
          )}
        </div>
        <div className='h-4' />
      </div>

      {/* ── MOBILE FILTER DRAWER ─────────────────────────── */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)} className='fixed inset-0 bg-black/60 z-40 md:hidden' />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className='fixed left-0 top-0 h-full w-72 bg-white dark:bg-[#0c1a2e] border-r border-gray-200 dark:border-white/8 z-50 p-6 overflow-y-auto md:hidden'>
              <div className='flex justify-between items-center mb-6'>
                <h3 className='font-bold text-gray-800 dark:text-white'>Filters</h3>
                <button onClick={() => setFilterOpen(false)} className='w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-white/12 transition-colors'>
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><path d='M18 6 6 18M6 6l12 12'/></svg>
                </button>
              </div>
              <FilterContent filters={filters} handleFilter={handleFilter} onClose={() => setFilterOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <div className='max-w-6xl mx-auto px-4 sm:px-6 py-8 flex gap-6'>

        {/* Desktop Sidebar */}
        <div className='hidden md:block w-60 shrink-0'>
          <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-5 sticky top-6'>
            <div className='flex items-center justify-between mb-5'>
              <h3 className='text-sm font-bold text-gray-800 dark:text-white'>Filters</h3>
              {activeFiltersCount > 0 && (
                <button onClick={() => filterConfig.forEach(f => handleFilter(f.key, ''))}
                  className='text-xs text-red-500 hover:text-red-600 transition-colors'>Clear all</button>
              )}
            </div>
            <FilterContent filters={filters} handleFilter={handleFilter} />
          </div>
        </div>

        {/* Job Cards */}
        <div className='flex-1 min-w-0'>

          {/* Results header */}
          <div className='flex items-center justify-between mb-5'>
            <div>
              <span className='text-sm font-semibold text-gray-800 dark:text-white'>{jobs.length} jobs found</span>
              {activeFiltersCount > 0 && <span className='text-xs text-gray-400 dark:text-white/30 ml-2'>with {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}</span>}
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className='flex flex-col items-center justify-center py-24'>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mb-4' />
              <p className='text-sm text-gray-400 dark:text-white/30'>Finding jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            /* Empty state */
            <div className='text-center py-24'>
              <div className='w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='text-gray-400 dark:text-white/20'>
                  <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                </svg>
              </div>
              <p className='text-gray-800 dark:text-white font-semibold mb-1'>No jobs found</p>
              <p className='text-sm text-gray-400 dark:text-white/30 mb-4'>Try adjusting your filters</p>
              <button onClick={() => filterConfig.forEach(f => handleFilter(f.key, ''))}
                className='text-sm text-green-600 dark:text-green-400 hover:underline'>Clear all filters</button>
            </div>
          ) : (
            <div className='space-y-3'>
              {jobs.map((job, i) => (
                <motion.div key={job._id}
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -2 }}
                  className={`group bg-white dark:bg-white/3 rounded-2xl p-5 transition-all duration-200 border ${
                    job.is_featured
                      ? 'border-green-400 dark:border-green-500/50 ring-1 ring-green-400/20 dark:ring-green-500/10'
                      : 'border-gray-200 dark:border-white/7 hover:border-green-300 dark:hover:border-green-500/30'
                  }`}>

                  {/* Featured badge */}
                  {job.is_featured && (
                    <div className='flex items-center gap-1.5 mb-3'>
                      <span className='inline-flex items-center gap-1.5 text-xs bg-green-600 text-white px-3 py-1 rounded-full font-medium'>
                        <svg className='w-3 h-3' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/></svg>
                        Featured
                      </span>
                    </div>
                  )}

                  <div className='flex items-start gap-4'>
                    {/* Logo */}
                    <div className='w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-base shrink-0 overflow-hidden border border-gray-100 dark:border-white/5'>
                      {job.employer?.logo_url
                        ? <img src={job.employer.logo_url} alt={job.employer.company_name} className='w-full h-full object-cover' />
                        : job.employer?.company_name?.charAt(0) || 'C'}
                    </div>

                    <div className='flex-1 min-w-0'>
                      {/* Title row */}
                      <div className='flex items-start justify-between gap-3 mb-2'>
                        <div className='min-w-0'>
                          <h3 className='text-sm font-semibold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate mb-0.5'>
                            {job.title}
                          </h3>
                          <p className='text-xs text-gray-500 dark:text-white/35 truncate'>
                            {job.employer?.company_name} · {job.location}
                          </p>
                        </div>
                        <Link to={`/jobs/${job._id}`}
                          className='shrink-0 text-xs bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors font-medium'>
                          Apply →
                        </Link>
                      </div>

                      {/* Badges */}
                      <div className='flex gap-2 flex-wrap mb-3'>
                        <span className='inline-flex items-center gap-1 text-xs bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 px-2.5 py-1 rounded-full font-medium'>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          Verified
                        </span>
                        <span className='text-xs bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-white/55 border border-gray-200 dark:border-white/8 px-2.5 py-1 rounded-full'>
                          Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                        </span>
                        <span className='hidden sm:inline text-xs bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/8 px-2.5 py-1 rounded-full capitalize'>
                          {job.type}
                        </span>
                        <span className='hidden sm:inline text-xs bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/8 px-2.5 py-1 rounded-full'>
                          {job.experience}
                        </span>
                        <span className='hidden md:inline text-xs bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/8 px-2.5 py-1 rounded-full'>
                          {job.category}
                        </span>
                      </div>

                      {/* Footer */}
                      <div className='flex items-center justify-between pt-2.5 border-t border-gray-100 dark:border-white/5'>
                        <div className='flex items-center gap-3'>
                          <span className='flex items-center gap-1 text-xs text-gray-400 dark:text-white/25'>
                            <svg className='w-3 h-3' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/></svg>
                            {job.application_count} applied
                          </span>
                        </div>
                        <div className='flex items-center gap-1 text-xs text-gray-400 dark:text-white/25'>
                          <svg className='w-3 h-3 text-red-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/></svg>
                          {new Date(job.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default JobList