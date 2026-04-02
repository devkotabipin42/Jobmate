import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../../../components/Navbar.jsx'
import useEmployer from '../../employer/hooks/useEmployer.js'
import CompanyMap from '../../../components/CompanyMap.jsx'
const CompanyProfile = () => {
    const { id } = useParams()
    const [company, setCompany] = useState(null)
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const { getCompanyProfile } = useEmployer()

    useEffect(() => {
        loadCompany()
    }, [id])

   const loadCompany = async () => {
    setLoading(true)
    try {
        const data = await getCompanyProfile(id)
        if (data) {
            setCompany(data.company)
            setJobs(data.jobs)
        }
    } catch (err) {
        console.log(err)
    } finally {
        setLoading(false)
    }
}

    if (loading) return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full'
            />
        </div>
    )

    if (!company) return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
            <p className='text-gray-500'>Company not found</p>
        </div>
    )

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-x-hidden'>
            <Navbar />

            <div className='max-w-4xl mx-auto px-4 md:px-6 py-8'>

                {/* Company Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden mb-6'
                >
                    {/* Cover */}
                    <div className='h-28 bg-gradient-to-r from-green-600 to-green-400' />

                    <div className='px-6 pb-6'>
                        <div className='flex items-end justify-between -mt-10 mb-4'>
                         
                            {company.is_verified && (
                                <span className='text-xs bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-700 font-medium'>
                                    ✓ Verified Company
                                </span>
                            )}
                        </div>

                       <div className='w-20 h-20 rounded-2xl bg-white dark:bg-gray-700 border-4 border-white dark:border-gray-800 flex items-center justify-center text-green-600 font-bold text-3xl shadow-sm overflow-hidden'>
    {company.logo_url ? (
        <img
            src={company.logo_url}
            alt={company.company_name}
            className='w-full h-full object-cover'
        />
    ) : (
        company.company_name?.charAt(0)
    )}
</div>
<h1 className='text-xl font-semibold text-gray-800 dark:text-white mb-1'>
    {company.company_name}
</h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                             {company.location || 'Nepal'}
                        </p>

                        {company.description && (
                            <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4'>
                                {company.description}
                            </p>
                        )}

                        {/* Contact Info */}
                        <div className='flex flex-wrap gap-3'>
                            {company.website && (
                                
                                   <a href={company.website}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='flex items-center gap-2 text-xs bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors'
                                >
                                    Visit Website
                                </a>
                            )}
                            {company.email && (
                                
                                  <a  href={`mailto:${company.email}`}
                                    className='flex items-center gap-2 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors'
                                >
                                    {company.email}
                                </a>
                            )}
                            {company.phone && (
                                
                                 <a   href={`tel:${company.phone}`}
                                    className='flex items-center gap-2 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors'
                                >
                                     {company.phone}
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className='grid grid-cols-3 gap-3 mb-6'>
                    {[
                        { label: 'Active Jobs', value: jobs.filter(j => j.is_active).length, color: 'text-green-600' },
                        { label: 'Total Jobs', value: jobs.length, color: 'text-blue-600' },
                        { label: 'Applications', value: jobs.reduce((a, j) => a + j.application_count, 0), color: 'text-purple-600' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center'
                        >
                            <p className={`text-2xl font-semibold ${stat.color}`}>{stat.value}</p>
                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
                {/* Company Details */}
{(company.industry || company.company_size || company.founded_year) && (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-6'
    >
        <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-4'>Company Details</h3>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {company.industry && (
                <div>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Industry</p>
                    <p className='text-sm font-medium text-gray-800 dark:text-white'>{company.industry}</p>
                </div>
            )}
            {company.company_size && (
                <div>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Company Size</p>
                    <p className='text-sm font-medium text-gray-800 dark:text-white'>{company.company_size} employees</p>
                </div>
            )}
            {company.founded_year && (
                <div>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Founded</p>
                    <p className='text-sm font-medium text-gray-800 dark:text-white'>{company.founded_year}</p>
                </div>
            )}
        </div>

        {/* Social Links */}
        {(company.social_links?.linkedin || company.social_links?.facebook) && (
            <div className='flex gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700'>
                {company.social_links?.linkedin && (
                    <a href={company.social_links.linkedin} target='_blank' rel='noreferrer'
                        className='text-xs bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors'>
                        💼 LinkedIn
                    </a>
                )}
                {company.social_links?.facebook && (
                    <a href={company.social_links.facebook} target='_blank' rel='noreferrer'
                        className='text-xs bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors'>
                        📘 Facebook
                    </a>
                )}
            </div>
        )}
    </motion.div>
)}
                {/* Map */}
                    <CompanyMap location={company.location} companyName={company.company_name} />
                {/* Active Jobs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
                        Open Positions ({jobs.filter(j => j.is_active).length})
                    </h2>

                    {jobs.length === 0 ? (
                        <div className='text-center py-10 text-gray-500 dark:text-gray-400'>
                            No open positions right now
                        </div>
                    ) : (
                        <div className='space-y-3'>
                            {jobs.map((job, i) => (
                                <motion.div
                                    key={job._id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ y: -2 }}
                                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-green-400 transition-colors'
                                >
                                    <div className='flex items-start justify-between gap-3'>
                                        <div>
                                            <h3 className='text-sm font-medium text-gray-800 dark:text-white'>
                                                {job.title}
                                            </h3>
                                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                                                {job.location} · {job.type}
                                            </p>
                                            <div className='flex gap-2 flex-wrap mt-2'>
                                                <span className='text-xs bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full'>
                                                    Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                                                </span>
                                                <span className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full'>
                                                    {job.experience}
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/jobs/${job._id}`}
                                            className='text-xs bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shrink-0'
                                        >
                                            Apply
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default CompanyProfile