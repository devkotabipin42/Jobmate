import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../../components/Navbar.jsx'
import Footer from '../../../components/Footer.jsx'

const About = () => {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            {/* Hero */}
            <div className='bg-green-600 py-20 px-6 relative overflow-hidden'>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className='absolute -top-20 -right-20 w-96 h-96 bg-green-500 rounded-full pointer-events-none'
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                    className='absolute -bottom-20 -left-20 w-80 h-80 bg-green-700 rounded-full pointer-events-none'
                />
                <div className='max-w-4xl mx-auto relative z-10'>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-center'
                    >
                        <h1 className='text-4xl md:text-5xl font-semibold text-white mb-4'>
                            About <span className='text-green-200'>Jobmate</span>
                        </h1>
                        <p className='text-green-100 text-lg mb-8 max-w-2xl mx-auto'>
                            Nepal's first 100% verified job platform — connecting job seekers with trusted employers since 2025.
                        </p>
                        <Link
                            to='/jobs'
                            className='bg-white text-green-700 px-8 py-3 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors inline-block'
                        >
                            Explore Jobs
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Who Are We */}
            <div className='max-w-5xl mx-auto px-4 md:px-6 py-16'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16'
                >
                    <div>
                        <h2 className='text-2xl font-semibold text-gray-800 dark:text-white mb-4'>
                            Who Are We?
                        </h2>
                        <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4'>
                            Jobmate is Nepal's most trusted job platform, committed to connecting the right candidates with the right opportunities. We understand how important the right job is for someone's future and how the right talent can change a company.
                        </p>
                        <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
                            We stand out from other platforms by offering salary transparency, job verification, and an AI-powered resume scorer — completely free for job seekers.
                        </p>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        {[
                            { num: '1,240+', label: 'Verified Jobs', color: 'text-green-600' },
                            { num: '850+', label: 'Companies', color: 'text-blue-600' },
                            { num: '12,000+', label: 'Job Seekers', color: 'text-purple-600' },
                            { num: '0', label: 'Fake Jobs', color: 'text-red-500' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center'
                            >
                                <p className={`text-2xl font-semibold ${stat.color}`}>{stat.num}</p>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* What We Do */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='mb-16'
                >
                    <h2 className='text-2xl font-semibold text-gray-800 dark:text-white mb-2 text-center'>
                        What We Do?
                    </h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400 text-center mb-8'>
                        We provide end-to-end hiring solutions for Nepal
                    </p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                        {[
                            { icon: '', title: 'Job Listings', desc: 'Verified job postings from trusted companies across Nepal.' },
                            { icon: '', title: 'AI Resume Scorer', desc: 'Free AI-powered resume analysis and improvement suggestions.' },
                            { icon: '', title: 'Job Matching', desc: 'Smart matching between candidates and job requirements.' },
                            { icon: '', title: 'Employer Dashboard', desc: 'Complete hiring management tool for employers.' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -4 }}
                                className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center'
                            >
                                <div className='text-3xl mb-3'>{item.icon}</div>
                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-2'>
                                    {item.title}
                                </h3>
                                <p className='text-xs text-gray-500 dark:text-gray-400 leading-relaxed'>
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Mission Vision Goal */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-16'>
                    {[
                        {
                            icon: '',
                            title: 'Our Mission',
                            desc: 'To provide verified, transparent and accessible job opportunities to every job seeker in Nepal — with salary always visible and no fake listings.',
                            color: 'border-green-500 bg-green-50 dark:bg-green-900'
                        },
                        {
                            icon: '',
                            title: 'Our Vision',
                            desc: "To become Nepal's most trusted job platform — where every job seeker finds their dream job and every employer finds the right talent.",
                            color: 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                        },
                        {
                            icon: '',
                            title: 'Our Goal',
                            desc: 'To reduce unemployment in Nepal by connecting 100,000+ job seekers with verified employers by 2026.',
                            color: 'border-purple-500 bg-purple-50 dark:bg-purple-900'
                        },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`border-t-4 ${item.color} rounded-xl p-6`}
                        >
                            <div className='text-3xl mb-3'>{item.icon}</div>
                            <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-2'>
                                {item.title}
                            </h3>
                            <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Why Jobmate */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 mb-16'
                >
                    <h2 className='text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center'>
                        Why Jobmate?
                    </h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        {[
                            { icon: '✓', title: '100% Verified Jobs', desc: 'Every job is manually verified — no fake listings allowed.' },
                            { icon: '💰', title: 'Salary Always Visible', desc: 'Salary is mandatory — no hidden information.' },
                            { icon: '📱', title: 'Mobile Friendly', desc: 'Apply easily from your phone — fast and smooth.' },
                            { icon: '🤖', title: 'AI Powered', desc: 'Free AI Resume Scorer to improve your resume.' },
                            { icon: '🇳🇵', title: 'Nepal Focused', desc: 'Built specifically for Nepal job market.' },
                            { icon: '⚡', title: 'Real Time Updates', desc: 'Track application status in real time.' },
                        ].map((item, i) => (
                            <div key={i} className='flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl'>
                                <div className='w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-sm shrink-0'>
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className='text-sm font-medium text-gray-800 dark:text-white mb-0.5'>
                                        {item.title}
                                    </h3>
                                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Team */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='mb-16'
                >
                    <h2 className='text-2xl font-semibold text-gray-800 dark:text-white mb-2 text-center'>
                        Our Team
                    </h2>
                    <p className='text-sm text-gray-500 dark:text-gray-400 text-center mb-8'>
                        The people behind Jobmate
                    </p>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto'>
                        {[
                            { name: 'Bipin Devkota', role: 'Founder & Full Stack Developer', location: 'Kathmandu, Nepal', desc: 'IT Engineering student passionate about building technology solutions for Nepal.' },
                            { name: 'Sujata Devkota', role: 'Co-Founder & Marketing Lead', location: 'Kathmandu, Nepal', desc: 'Leading marketing and business development, connecting employers and job seekers.' },
                        ].map((member, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center'
                            >
                                <div className='w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-3xl mx-auto mb-4'>
                                    {member.name.charAt(0)}
                                </div>
                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-1'>
                                    {member.name}
                                </h3>
                                <p className='text-xs text-green-600 dark:text-green-400 mb-1'>
                                    {member.role}
                                </p>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mb-3'>
                                    📍 {member.location}
                                </p>
                                <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                                    {member.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* FAQ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='mb-16'
                >
                    <h2 className='text-2xl font-semibold text-gray-800 dark:text-white mb-8 text-center'>
                        Frequently Asked Questions
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {[
                            { q: 'Is Jobmate free for job seekers?', a: 'Yes! Jobmate is completely free for job seekers — browse jobs, apply, and use AI Resume Scorer at no cost.' },
                            { q: 'How are jobs verified?', a: 'Every job posting is manually reviewed by our team before going live. We verify company registration and contact details.' },
                            { q: 'How do I contact Jobmate?', a: 'Email us at hello@jobmate.com.np or call +977-9800000000. We respond within 24 hours.' },
                            { q: 'Can employers post jobs for free?', a: 'Employers get 3 free job posts per month. For more postings, check our premium plans.' },
                            { q: 'Is my data safe on Jobmate?', a: 'Yes. We use industry-standard encryption. Your data is never sold to third parties.' },
                            { q: 'How does AI Resume Scorer work?', a: 'Paste your resume text and our AI analyzes it against industry standards, giving you a score and improvement suggestions.' },
                        ].map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4'
                            >
                                <h3 className='text-sm font-medium text-gray-800 dark:text-white mb-2'>
                                    {faq.q}
                                </h3>
                                <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                                    {faq.a}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='bg-green-600 rounded-2xl p-10 text-center'
                >
                    <h2 className='text-2xl font-semibold text-white mb-3'>
                        Ready to find your dream job?
                    </h2>
                    <p className='text-green-100 text-sm mb-6'>
                        Join thousands of job seekers finding verified jobs every day
                    </p>
                    <div className='flex gap-3 justify-center flex-wrap'>
                        <Link
                            to='/jobs'
                            className='bg-white text-green-700 px-6 py-3 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors'
                        >
                            Browse Jobs
                        </Link>
                        <Link
                            to='/register'
                            className='border border-white text-white px-6 py-3 rounded-xl text-sm hover:bg-green-700 transition-colors'
                        >
                            Create Account
                        </Link>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    )
}

export default About