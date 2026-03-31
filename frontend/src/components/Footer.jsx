import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className='bg-gray-900 dark:bg-gray-950 text-gray-300 pt-12 pb-6 px-6'>
            <div className='max-w-6xl mx-auto'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10'>

                    {/* Company Info */}
                    <div>
                        <div className='text-2xl font-semibold text-white mb-3'>
                            Job<span className='text-green-400'>mate</span>
                        </div>
                        <p className='text-sm text-gray-400 leading-relaxed mb-4'>
                            Nepal’s first 100% verified job platform. Zero fake listings— mobile-first experience.
                        </p>
                        {/* Social Links */}
                        <div className='flex gap-3'>
                            {[
                                { icon: 'in', href: 'https://linkedin.com', label: 'LinkedIn' },
                                { icon: 'f', href: 'https://facebook.com', label: 'Facebook' },
                                { icon: 'ig', href: 'https://instagram.com', label: 'Instagram' },
                            ].map((social, i) => (
                                
                                 <a   key={i}
                                    href={social.href}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs text-gray-300 hover:bg-green-600 hover:text-white transition-colors'
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* For Job Seekers */}
                    <div>
                        <h3 className='text-sm font-semibold text-white mb-4'>For Job Seekers</h3>
                        <ul className='space-y-2'>
                            {[
                                { label: 'Browse Jobs', path: '/jobs' },
                                { label: 'Companies', path: '/companies' },
                                { label: 'Career Tips', path: '/career-tips' },
                                { label: 'AI Resume Scorer', path: '/resume-scorer' },
                                { label: 'My Applications', path: '/my-applications' },
                                { label: 'Saved Jobs', path: '/saved-jobs' },
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.path}
                                        className='text-sm text-gray-400 hover:text-green-400 transition-colors'
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* For Employers */}
                    <div>
                        <h3 className='text-sm font-semibold text-white mb-4'>For Employers</h3>
                        <ul className='space-y-2'>
                            {[
                                { label: 'Post a Job', path: '/employer/post-job' },
                                { label: 'Employer Dashboard', path: '/employer/dashboard' },
                                { label: 'Pricing', path: '/pricing' },
                                { label: 'Register as Employer', path: '/register' },
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.path}
                                        className='text-sm text-gray-400 hover:text-green-400 transition-colors'
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className='text-sm font-semibold text-white mb-4'>Company</h3>
                        <ul className='space-y-2'>
                            {[
                                { label: 'About Us', path: '/about' },
                                { label: 'Contact Us', path: '/contact' },
                                { label: 'Privacy Policy', path: '/privacy' },
                                { label: 'Terms & Conditions', path: '/terms' },
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.path}
                                        className='text-sm text-gray-400 hover:text-green-400 transition-colors'
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Contact */}
                        <div className='mt-4 space-y-2'>
                            
                              <a  href='mailto:hello@jobmate.com.np'
                                className='flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors'
                            >
                                hello@jobmate.com.np
                            </a>
                            
                             <a   href='tel:+977-9800000000'
                                className='flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-colors'
                            >
                                +977-9800000000
                            </a>
                            <p className='flex items-center gap-2 text-sm text-gray-400'>
                                Kathmandu, Nepal
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className='border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4'>
                    <p className='text-xs text-gray-500'>
                        © 2025 Jobmate Pvt. Ltd. All rights reserved.
                    </p>
                    <div className='flex gap-4'>
                        <Link to='/privacy' className='text-xs text-gray-500 hover:text-green-400'>Privacy Policy</Link>
                        <Link to='/terms' className='text-xs text-gray-500 hover:text-green-400'>Terms</Link>
                        <Link to='/contact' className='text-xs text-gray-500 hover:text-green-400'>Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer