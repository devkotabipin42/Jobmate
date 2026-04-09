import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import Navbar from '../../../components/Navbar.jsx'
import Footer from '../../../components/Footer.jsx'
import API_URL from '../../../config/api.js'

const Companies = () => {
    const [companies, setCompanies] = useState([])
    const [featuredCompanies, setFeaturedCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        loadCompanies()
        loadFeaturedCompanies()
    }, [])

    const loadCompanies = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/employer/all`, { withCredentials: true })
            setCompanies(res.data.employers)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const loadFeaturedCompanies = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/featured-companies`)
            setFeaturedCompanies(res.data.companies || [])
        } catch (err) {
            console.log(err)
        }
    }

    const filtered = companies.filter(c => {
        const matchSearch = c.company_name?.toLowerCase().includes(search.toLowerCase()) ||
            c.location?.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'all' || (filter === 'verified' && c.is_verified)
        return matchSearch && matchFilter
    })

    return (
        <div className='min-h-screen bg-white dark:bg-[#08111f] transition-colors duration-300'>

            {/* ── HERO ─────────────────────────────────────── */}
            <div className='relative overflow-hidden bg-white dark:bg-[#08111f]'>
                <div className='absolute inset-0 opacity-20 dark:opacity-100'
                    style={{ backgroundImage: 'linear-gradient(rgba(22,163,74,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.06) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
                <div className='absolute -top-10 -right-10 w-72 h-72 rounded-full opacity-0 dark:opacity-100 pointer-events-none'
                    style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 65%)' }} />
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 8, repeat: Infinity }}
                    className='absolute -top-10 -right-10 w-64 h-64 bg-green-100 rounded-full pointer-events-none dark:hidden' />

                <Navbar />

                <div className='relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center'>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className='inline-flex items-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/25 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-xs font-medium mb-5'>
                        <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }}
                            className='w-1.5 h-1.5 bg-green-500 rounded-full' />
                        {companies.filter(c => c.is_verified).length + featuredCompanies.length} Companies on Jobmate
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className='text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight'>
                        Top Companies in Nepal
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className='text-sm text-gray-500 dark:text-white/40 mb-8'>
                        Discover verified employers — apply with confidence
                    </motion.p>

                    {/* Search */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className='flex flex-col sm:flex-row gap-2 max-w-xl mx-auto'>
                        <div className='flex-1 flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 focus-within:border-green-400 dark:focus-within:border-green-500/50 transition-colors'>
                            <svg className='w-4 h-4 text-gray-400 dark:text-white/25 shrink-0' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.35-4.35'/></svg>
                            <input type='text' value={search} onChange={e => setSearch(e.target.value)}
                                placeholder='Search companies or location...'
                                className='flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/25' />
                            {search && (
                                <button onClick={() => setSearch('')}>
                                    <svg className='w-3.5 h-3.5 text-gray-400' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><path d='M18 6 6 18M6 6l12 12'/></svg>
                                </button>
                            )}
                        </div>
                        <div className='flex bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-1'>
                            {[{ val: 'all', label: 'All' }, { val: 'verified', label: '✓ Verified' }].map(f => (
                                <button key={f.val} onClick={() => setFilter(f.val)}
                                    className={`flex-1 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                                        filter === f.val ? 'bg-green-600 text-white' : 'text-gray-500 dark:text-white/45'
                                    }`}>
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
                <div className='h-4' />
            </div>

            {/* ── FEATURED COMPANIES ───────────────────────── */}
            {featuredCompanies.length > 0 && !search && (
                <div className='bg-white dark:bg-[#08111f] py-10 px-4 sm:px-6 border-b border-gray-100 dark:border-white/5'>
                    <div className='max-w-6xl mx-auto'>
                        {/* Section header */}
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='flex items-center gap-2'>
                                <div className='w-6 h-6 bg-amber-500 rounded-lg flex items-center justify-center'>
                                    <svg className='w-3.5 h-3.5 text-white' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/></svg>
                                </div>
                                <h2 className='text-base font-bold text-gray-800 dark:text-white'>Featured Companies</h2>
                            </div>
                            <span className='text-xs bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 px-2.5 py-1 rounded-full font-medium'>
                                Premium Partners
                            </span>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                            {featuredCompanies.map((company, i) => (
                                <motion.div key={company._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    whileHover={{ y: -4 }}
                                    className='group relative bg-white dark:bg-white/3 border border-amber-200 dark:border-amber-500/20 hover:border-amber-400 dark:hover:border-amber-500/40 rounded-2xl p-5 transition-all duration-200'>

                                    {/* Featured badge */}
                                    <div className='absolute top-3 right-3'>
                                        <span className='inline-flex items-center gap-1 text-[10px] bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded-full font-semibold'>
                                            <svg className='w-2.5 h-2.5' fill='currentColor' viewBox='0 0 24 24'><path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/></svg>
                                            Featured
                                        </span>
                                    </div>

                                    {/* Logo + Name */}
                                    <div className='flex items-start gap-3 mb-3 pr-16'>
                                        <div className='w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 flex items-center justify-center font-bold text-xl text-gray-500 dark:text-white/30 shrink-0 overflow-hidden'>
                                            {company.logo_url
                                                ? <img src={company.logo_url} alt={company.name} className='w-full h-full object-cover' />
                                                : company.name?.charAt(0)}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <h3 className='text-sm font-semibold text-gray-800 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors'>
                                                {company.name}
                                            </h3>
                                            <div className='flex items-center gap-1 mt-0.5'>
                                                <svg className='w-3 h-3 text-gray-400 dark:text-white/25' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/><circle cx='12' cy='10' r='3'/></svg>
                                                <p className='text-xs text-gray-500 dark:text-white/35 truncate'>{company.location || 'Nepal'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {company.description && (
                                        <p className='text-xs text-gray-500 dark:text-white/40 mb-3 line-clamp-2 leading-relaxed'>
                                            {company.description}
                                        </p>
                                    )}

                                    {/* Tags */}
                                    <div className='flex gap-2 flex-wrap mb-4'>
                                        {company.industry && (
                                            <span className='text-xs bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/8 px-2.5 py-1 rounded-full'>
                                                {company.industry}
                                            </span>
                                        )}
                                        {company.website && (
                                            <a href={company.website} target='_blank' rel='noreferrer'
                                                className='text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors'>
                                                Website ↗
                                            </a>
                                        )}
                                    </div>

                                    {/* View Jobs button */}
                                    <Link to={`/jobs?keyword=${company.name}`}
                                        className='w-full block text-center text-xs bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl transition-colors font-semibold'>
                                        View Jobs →
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── ALL COMPANIES ─────────────────────────────── */}
            <div className='bg-gray-50 dark:bg-[#0c1a2e] py-10 px-4 sm:px-6 min-h-[40vh]'>
                <div className='max-w-6xl mx-auto'>

                    {/* Section header */}
                    {featuredCompanies.length > 0 && !search && (
                        <div className='flex items-center gap-2 mb-6'>
                            <h2 className='text-base font-bold text-gray-800 dark:text-white'>All Companies</h2>
                            <span className='text-xs text-gray-400 dark:text-white/25'>({filtered.length} total)</span>
                        </div>
                    )}

                    {loading ? (
                        <div className='flex flex-col items-center justify-center py-24'>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mb-4' />
                            <p className='text-sm text-gray-400 dark:text-white/30'>Loading companies...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className='text-center py-24'>
                            <div className='w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                                <svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' className='text-gray-400 dark:text-white/20'>
                                    <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/>
                                </svg>
                            </div>
                            <p className='text-gray-800 dark:text-white font-semibold mb-1'>No companies found</p>
                            <p className='text-sm text-gray-400 dark:text-white/30'>Try a different search</p>
                        </div>
                    ) : (
                        <>
                            {!featuredCompanies.length && (
                                <div className='flex items-center justify-between mb-6'>
                                    <p className='text-sm font-semibold text-gray-800 dark:text-white'>
                                        {filtered.length} <span className='font-normal text-gray-500 dark:text-white/35'>companies found</span>
                                    </p>
                                </div>
                            )}

                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {filtered.map((company, i) => (
                                    <motion.div key={company._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        whileHover={{ y: -4 }}
                                        className='group bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 hover:border-green-300 dark:hover:border-green-500/30 rounded-2xl p-5 transition-all duration-200'>

                                        {/* Logo + Name */}
                                        <div className='flex items-start gap-3 mb-4'>
                                            <div className='w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-xl shrink-0 overflow-hidden border border-gray-100 dark:border-white/5'>
                                                {company.logo_url
                                                    ? <img src={company.logo_url} alt={company.company_name} className='w-full h-full object-cover' />
                                                    : company.company_name?.charAt(0)}
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <div className='flex items-center gap-2 flex-wrap'>
                                                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors'>
                                                        {company.company_name}
                                                    </h3>
                                                    {company.is_verified && (
                                                        <span className='inline-flex items-center gap-1 text-[10px] bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 px-2 py-0.5 rounded-full font-medium shrink-0'>
                                                            <svg width='8' height='8' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3'><polyline points='20 6 9 17 4 12'/></svg>
                                                            Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <div className='flex items-center gap-1 mt-1'>
                                                    <svg className='w-3 h-3 text-gray-400 dark:text-white/25 shrink-0' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/><circle cx='12' cy='10' r='3'/></svg>
                                                    <p className='text-xs text-gray-500 dark:text-white/35 truncate'>{company.location || 'Nepal'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {company.description && (
                                            <p className='text-xs text-gray-500 dark:text-white/40 mb-4 line-clamp-2 leading-relaxed'>
                                                {company.description}
                                            </p>
                                        )}

                                        {/* Meta tags */}
                                        <div className='flex gap-2 flex-wrap mb-4'>
                                            {company.industry && (
                                                <span className='text-xs bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/8 px-2.5 py-1 rounded-full'>
                                                    {company.industry}
                                                </span>
                                            )}
                                            {company.company_size && (
                                                <span className='text-xs bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/8 px-2.5 py-1 rounded-full'>
                                                    {company.company_size} employees
                                                </span>
                                            )}
                                            {company.website && (
                                                <a href={company.website} target='_blank' rel='noreferrer'
                                                    className='text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-2.5 py-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-500/15 transition-colors'>
                                                    Website ↗
                                                </a>
                                            )}
                                        </div>

                                        {/* Buttons */}
                                        <div className='flex gap-2 pt-3 border-t border-gray-100 dark:border-white/5'>
                                            <Link to={`/companies/${company._id}`}
                                                className='flex-1 text-center text-xs bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl transition-colors font-semibold'>
                                                View Profile
                                            </Link>
                                            <Link to={`/jobs?location=${company.location || ''}`}
                                                className='flex-1 text-center text-xs border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 py-2.5 rounded-xl hover:border-green-400 dark:hover:border-green-500/40 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium'>
                                                View Jobs
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Companies