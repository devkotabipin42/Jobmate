import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import Navbar from '../../../components/Navbar.jsx'
import API_URL from '../../../config/api.js'


const Companies = () => {
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        loadCompanies()
    }, [])

    const loadCompanies = async () => {
        try {
            const res = await axios.get(
                `${API_URL}/api/employer/all`,
                { withCredentials: true }
            )
            setCompanies(res.data.employers)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const filtered = companies.filter(c =>
        c.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.location?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            <div className='bg-green-50 dark:bg-gray-800 py-10 px-4 text-center border-b border-gray-200 dark:border-gray-700'>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-3xl font-semibold text-green-900 dark:text-white mb-3'
                >
                    Top Companies in Nepal
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className='text-green-700 dark:text-gray-400 mb-6 text-sm'
                >
                    Find and connect with top employers
                </motion.p>
                <motion.input
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    type='text'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Search companies...'
                    className='w-full max-w-md mx-auto block border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                />
            </div>

            <div className='max-w-6xl mx-auto px-4 md:px-6 py-8'>
                {loading ? (
                    <div className='text-center py-20'>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto'
                        />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className='text-center py-20 text-gray-500 dark:text-gray-400'>
                        No companies found
                    </div>
                ) : (
                    <>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
                            {filtered.length} companies found
                        </p>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {filtered.map((company, i) => (
                                <motion.div
                                    key={company._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ y: -4 }}
                                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-green-400 transition-colors'
                                >
                                    {/* Logo + Name */}
                                    <div className='flex items-start gap-3 mb-4'>
                                        <div className='w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-xl shrink-0'>
                                            {company.company_name?.charAt(0)}
                                        </div>
                                        <div className='flex-1 min-w-0'>
                                            <div className='flex items-center gap-2'>
                                                <h3 className='text-sm font-medium text-gray-800 dark:text-white truncate'>
                                                    {company.company_name}
                                                </h3>
                                                {company.is_verified && (
                                                    <span className='text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-1.5 py-0.5 rounded-full shrink-0'>
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                                                {company.location || 'Nepal'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {company.description && (
                                        <p className='text-xs text-gray-600 dark:text-gray-300 mb-4 line-clamp-2'>
                                            {company.description}
                                        </p>
                                    )}

                                    {/* Tags */}
                                    <div className='flex gap-2 flex-wrap mb-4'>
                                        {company.is_premium && (
                                            <span className='text-xs bg-amber-50 dark:bg-amber-900 text-amber-600 dark:text-amber-300 px-2 py-1 rounded-full'>
                                                Premium
                                            </span>
                                        )}
                                        {company.website && (
                                            
                                             <a   href={company.website}
                                                target='_blank'
                                                rel='noreferrer'
                                                className='text-xs bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full hover:underline'
                                            >
                                                Website
                                            </a>
                                        )}
                                    </div>

                                   {/* Buttons */}
<div className='flex gap-2 mt-4'>
    <Link
        to={`/company/${company._id}`}
        className='flex-1 text-center text-sm bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium'
    >
        View Profile
    </Link>
    <Link
        to={`/jobs?company=${company._id}`}
        className='flex-1 text-center text-sm border border-green-600 text-green-600 dark:text-green-400 py-2.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900 transition-colors'
    >
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
    )
}

export default Companies