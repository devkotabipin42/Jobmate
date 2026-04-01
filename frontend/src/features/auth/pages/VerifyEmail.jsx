import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import API_URL from '../../../config/api.js'

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('loading') // loading, success, error
    const token = searchParams.get('token')
    const role = searchParams.get('role')

    useEffect(() => {
        if (token && role) {
            verifyEmail()
        } else {
            setStatus('error')
        }
    }, [])

    const verifyEmail = async () => {
        try {
            await axios.get(`${API_URL}/api/auth/verify-email?token=${token}&role=${role}`)
            setStatus('success')
        } catch (err) {
            setStatus('error')
        }
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 max-w-md w-full text-center'
            >
                {status === 'loading' && (
                    <>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className='w-12 h-12 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4'
                        />
                        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-2'>
                            Verifying your email...
                        </h2>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            Please wait a moment
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className='w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <span className='text-3xl'>✓</span>
                        </div>
                        <h2 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>
                            Email Verified!
                        </h2>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
                            Your account is now verified. You can login now.
                        </p>
                        <Link
                            to='/login'
                            className='block w-full bg-green-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors'
                        >
                            Go to Login
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className='w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <span className='text-3xl'>✕</span>
                        </div>
                        <h2 className='text-xl font-bold text-gray-800 dark:text-white mb-2'>
                            Verification Failed
                        </h2>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
                            Link is invalid or expired. Please register again.
                        </p>
                        <Link
                            to='/register'
                            className='block w-full bg-green-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors'
                        >
                            Register Again
                        </Link>
                    </>
                )}
            </motion.div>
        </div>
    )
}

export default VerifyEmail