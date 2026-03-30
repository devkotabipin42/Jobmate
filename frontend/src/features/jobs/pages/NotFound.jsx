import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../../components/Navbar.jsx'

const NotFound = () => {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            <div className='flex flex-col items-center justify-center min-h-[80vh] px-4 text-center'>
                {/* 404 Number */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className='text-9xl font-bold text-green-600 dark:text-green-500 mb-4'>
                        404
                    </h1>
                </motion.div>

                {/* Illustration */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className='mb-6'
                >
                    <svg viewBox='0 0 200 150' className='w-64 h-48 mx-auto'>
                        <rect x='40' y='30' width='120' height='90' rx='10' fill='#dcfce7' stroke='#22c55e' strokeWidth='2' />
                        <rect x='55' y='50' width='90' height='8' rx='4' fill='#22c55e' opacity='0.5' />
                        <rect x='55' y='65' width='70' height='8' rx='4' fill='#22c55e' opacity='0.3' />
                        <rect x='55' y='80' width='80' height='8' rx='4' fill='#22c55e' opacity='0.3' />
                        <circle cx='150' cy='100' r='25' fill='#fee2e2' stroke='#ef4444' strokeWidth='2' />
                        <line x1='143' y1='93' x2='157' y2='107' stroke='#ef4444' strokeWidth='3' strokeLinecap='round' />
                        <line x1='157' y1='93' x2='143' y2='107' stroke='#ef4444' strokeWidth='3' strokeLinecap='round' />
                    </svg>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className='text-2xl font-semibold text-gray-800 dark:text-white mb-3'
                >
                    Page Not Found
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className='text-gray-500 dark:text-gray-400 mb-8 max-w-md'
                >
                    Oops! The page you are looking for does not exist or has been moved.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className='flex gap-3 flex-wrap justify-center'
                >
                    <Link
                        to='/'
                        className='bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors'
                    >
                        Go to Home
                    </Link>
                    <Link
                        to='/jobs'
                        className='border border-green-600 text-green-600 dark:text-green-400 px-6 py-3 rounded-xl text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900 transition-colors'
                    >
                        Browse Jobs
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}

export default NotFound