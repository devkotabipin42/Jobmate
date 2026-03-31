import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../features/themes/theme.slice.js'
import { motion, AnimatePresence } from 'framer-motion'
import useAuth from '../features/auth/hooks/useAuth.js'
const Navbar = () => {
    const { user } = useSelector(state => state.auth)
    const { isDark } = useSelector(state => state.theme)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)
    const { logoutUser } = useAuth()

    const handleLogout = async () => {
    await logoutUser()
    setMenuOpen(false)  
    }

    return (
        <nav className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 relative z-50'>
            <div className='flex items-center justify-between'>

                {/* Logo */}
               <Link to='/' className='flex items-center gap-2'>
    {/* <img src='/logo.png' alt='Jobmate' className='w-8 h-8 object-contain' /> */}
    <span className='text-xl font-semibold'>
        <span className='text-green-600'>Job</span>
        <span className='text-gray-800 dark:text-white'>mate</span>
    </span>
</Link>

                {/* Desktop Nav Links */}
                <div className='hidden md:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300'>
                    <Link to='/jobs' className='hover:text-green-600 transition-colors'>Jobs</Link>
                    <Link to='/companies' className='hover:text-green-600 transition-colors'>Companies</Link>
                    <Link to='/career-tips' className='hover:text-green-600 transition-colors'>Career tips</Link>
                </div>

                {/* Desktop Right */}
                <div className='hidden md:flex items-center gap-3'>
                    {/* Theme Toggle */}
                    <button
                        onClick={() => dispatch(toggleTheme())}
                        className='w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                    >
                        {isDark ? '☀️' : '🌙'}
                    </button>

                    {user ? (
                        <>
                            {/* Jobseeker links */}

                            {user?.role === 'admin' && (
    <Link
        to='/admin'
        className='text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium transition-colors'
    >
        Admin Panel
    </Link>
)}
                         {user.role === 'jobseeker' && (
    <>
        <Link
            to='/profile'
            className='text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors'
        >
            Profile
        </Link>
        <Link
            to='/my-applications'
            className='text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors'
        >
            Applications
        </Link>
        <Link
            to='/resume-scorer'
            className='text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors'
        >
            AI Resume
        </Link>
        <Link
            to='/resume-builder'
            className='text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors'
        >
            Resume Builder
        </Link>
    </>
)}

                            {/* Employer links */}
                            {user.role === 'employer' && (
                                <Link
                                    to='/employer/dashboard'
                                    className='text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 transition-colors'
                                >
                                    Dashboard
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className='text-sm border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white transition-colors'
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to='/login'
                                className='text-sm border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white transition-colors'
                            >
                                Login
                            </Link>
                            <Link
                                to='/register'
                                className='text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Right */}
                <div className='flex md:hidden items-center gap-2'>
                    <button
                        onClick={() => dispatch(toggleTheme())}
                        className='w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700'
                    >
                        {isDark ? '☀️' : '🌙'}
                    </button>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className='w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700'
                    >
                        <motion.span
                            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                            className='w-4 h-0.5 bg-gray-600 dark:bg-gray-300 block'
                        />
                        <motion.span
                            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                            className='w-4 h-0.5 bg-gray-600 dark:bg-gray-300 block'
                        />
                        <motion.span
                            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                            className='w-4 h-0.5 bg-gray-600 dark:bg-gray-300 block'
                        />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='md:hidden border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 space-y-1'
                    >
                        <Link
                            to='/jobs'
                            onClick={() => setMenuOpen(false)}
                            className='block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'
                        >
                            Jobs
                        </Link>
                        <Link
                            to='/companies'
                            onClick={() => setMenuOpen(false)}
                            className='block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'
                        >
                            Companies
                        </Link>
                        <Link
                            to='/career-tips'
                            onClick={() => setMenuOpen(false)}
                            className='block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'
                        >
                            Career tips
                        </Link>

                        <div className='border-t border-gray-200 dark:border-gray-700 pt-2 mt-2'>
                            {user ? (
                                <>
                                    {/* Jobseeker mobile links */}

                                        {user.role === 'admin' && (
    <Link
        to='/admin'
        onClick={() => setMenuOpen(false)}
        className='block px-3 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg font-medium'
    >
        Admin Panel
    </Link>
)}


                                    {user?.role === 'jobseeker' && (
    <>
        <Link to='/profile' onClick={() => setMenuOpen(false)}
            className='block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'>
            Profile
        </Link>
        <Link to='/my-applications' onClick={() => setMenuOpen(false)}
            className='block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'>
            My Applications
        </Link>
        <Link to='/resume-scorer' onClick={() => setMenuOpen(false)}
            className='block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'>
            AI Resume
        </Link>
        <Link to='/resume-builder' onClick={() => setMenuOpen(false)}
            className='block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'>
            Resume Builder
        </Link>
        <Link to='/saved-jobs' onClick={() => setMenuOpen(false)}
            className='block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'>
            Saved Jobs
        </Link>
    </>
)}

                                    {/* Employer mobile links */}
                                    {user.role === 'employer' && (
                                        <Link
                                            to='/employer/dashboard'
                                            onClick={() => setMenuOpen(false)}
                                            className='block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg'
                                        >
                                            Dashboard
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className='w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg'
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className='flex gap-2 px-3'>
                                    <Link
                                        to='/login'
                                        onClick={() => setMenuOpen(false)}
                                        className='flex-1 text-center text-sm border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg dark:text-white'
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to='/register'
                                        onClick={() => setMenuOpen(false)}
                                        className='flex-1 text-center text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700'
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar