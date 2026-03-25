import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../../../components/Navbar.jsx'
import Footer from '../../../components/Footer.jsx'

const Terms = () => {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            {/* Header */}
            <div className='bg-green-50 dark:bg-gray-800 py-16 px-6 text-center border-b border-gray-200 dark:border-gray-700'>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-3xl font-semibold text-green-900 dark:text-white mb-3'
                >
                    Terms & Conditions
                </motion.h1>
                <p className='text-green-700 dark:text-gray-400 text-sm'>
                    Last updated: March 2025
                </p>
                <p className='text-green-600 dark:text-gray-500 text-xs mt-2'>
                    Please read these terms carefully before using Jobmate.
                </p>
            </div>

            <div className='max-w-3xl mx-auto px-4 md:px-6 py-12'>

                {/* Intro */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl p-6 mb-8'
                >
                    <p className='text-sm text-green-800 dark:text-green-200 leading-relaxed'>
                        These Terms and Conditions govern your access to and use of Jobmate ("we", "us", "our"). By using our platform, you agree to these terms. If you do not agree, please do not use Jobmate.
                    </p>
                </motion.div>

                {/* Terminology */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4'
                >
                    <h2 className='text-base font-semibold text-gray-800 dark:text-white mb-4'>
                        Terminology
                    </h2>
                    <div className='space-y-3'>
                        {[
                            { term: 'Job Seeker', def: 'A person who uses Jobmate to search for jobs or career-related information.' },
                            { term: 'Employer', def: 'Any person or organization using Jobmate to post job vacancies or search for potential candidates.' },
                            { term: 'User', def: 'Anyone who visits or uses Jobmate — including both Employers and Job Seekers.' },
                            { term: 'Platform', def: 'The Jobmate website, mobile app, and all related services.' },
                            { term: 'Content', def: 'All text, images, job listings, resumes, and other materials on Jobmate.' },
                        ].map((item, i) => (
                            <div key={i} className='flex gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                                <span className='text-xs font-semibold text-green-600 dark:text-green-400 shrink-0 mt-0.5'>
                                    {item.term}:
                                </span>
                                <span className='text-xs text-gray-600 dark:text-gray-300'>
                                    {item.def}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Job Seeker Terms */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4'
                >
                    <h2 className='text-base font-semibold text-gray-800 dark:text-white mb-4'>
                        Terms for Job Seekers
                    </h2>
                    <div className='space-y-4'>
                        {[
                            {
                                title: '1. Account Registration',
                                content: 'You must provide accurate and complete information when creating your account. You are responsible for maintaining the security of your account and password.'
                            },
                            {
                                title: '2. Permitted Use',
                                content: 'You may use Jobmate to search for jobs and apply to positions. You may not use Jobmate for any illegal or unauthorized purpose. You must be at least 16 years old to use our platform.'
                            },
                            {
                                title: '3. Accurate Information',
                                content: 'All information in your profile, resume, and applications must be accurate and truthful. Providing false information may result in permanent account suspension.'
                            },
                            {
                                title: '4. Application Conduct',
                                content: 'Apply only for positions you are genuinely interested in. Do not spam employers with irrelevant applications. Respect employer communication and response times.'
                            },
                            {
                                title: '5. Limitation of Liability',
                                content: 'Jobmate does not guarantee job placement. We are not responsible for employer decisions or hiring outcomes. Job recommendations are suggestions only and may not be fully accurate.'
                            },
                        ].map((item, i) => (
                            <div key={i}>
                                <h3 className='text-sm font-medium text-gray-800 dark:text-white mb-1'>
                                    {item.title}
                                </h3>
                                <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                                    {item.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Employer Terms */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4'
                >
                    <h2 className='text-base font-semibold text-gray-800 dark:text-white mb-4'>
                        Terms for Employers
                    </h2>
                    <div className='space-y-4'>
                        {[
                            {
                                title: '1. Account Authorization',
                                content: 'Employer accounts are created on behalf of registered organizations only. You must have authority to post jobs on behalf of your organization.'
                            },
                            {
                                title: '2. Job Posting Guidelines',
                                content: 'All job postings must be genuine, accurate, and legal. Salary information is mandatory. Fake or misleading job posts are strictly prohibited and will result in immediate account suspension.'
                            },
                            {
                                title: '3. Candidate Data',
                                content: 'Candidate information accessed through Jobmate must be used only for legitimate hiring purposes. You may not sell, transfer, or share candidate data with third parties without explicit consent.'
                            },
                            {
                                title: '4. Employer Materials',
                                content: 'By uploading content (logos, job descriptions), you confirm you own or have permission to use the content. You grant Jobmate permission to display your materials on the platform.'
                            },
                            {
                                title: '5. Payment Terms',
                                content: 'Free tier includes 3 job posts per month. Premium features require subscription payment. Payments are non-refundable once processed. Subscriptions can be cancelled at any time.'
                            },
                            {
                                title: '6. Warranty Disclaimer',
                                content: 'Jobmate does not guarantee that job posts will attract qualified candidates. We are not responsible for hiring decisions or employment outcomes.'
                            },
                        ].map((item, i) => (
                            <div key={i}>
                                <h3 className='text-sm font-medium text-gray-800 dark:text-white mb-1'>
                                    {item.title}
                                </h3>
                                <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                                    {item.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* General Terms */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4'
                >
                    <h2 className='text-base font-semibold text-gray-800 dark:text-white mb-4'>
                        General Terms
                    </h2>
                    <div className='space-y-4'>
                        {[
                            {
                                title: 'Prohibited Activities',
                                content: 'Spam, harassment, fake profiles, illegal content, platform manipulation, scraping data, and any activity that disrupts the platform are strictly prohibited.'
                            },
                            {
                                title: 'Intellectual Property',
                                content: 'All Jobmate content, logos, and platform design are owned by Jobmate Pvt. Ltd. You may not copy, reproduce, or distribute our content without written permission.'
                            },
                            {
                                title: 'Account Suspension',
                                content: 'We reserve the right to suspend or terminate accounts that violate these terms, without prior notice. Serious violations may result in permanent bans.'
                            },
                            {
                                title: 'Security & Confidentiality',
                                content: 'We restrict access to personal information to authorized personnel only. We maintain technical and organizational security measures to protect your data.'
                            },
                            {
                                title: 'Governing Law',
                                content: 'These terms are governed by the laws of Nepal. Any disputes shall be resolved under the jurisdiction of courts in Kathmandu, Nepal.'
                            },
                            {
                                title: 'Changes to Terms',
                                content: 'We may update these terms at any time. Changes will be notified via email and platform announcement. Continued use after changes means you accept the updated terms.'
                            },
                        ].map((item, i) => (
                            <div key={i} className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                                <h3 className='text-xs font-semibold text-gray-800 dark:text-white mb-1'>
                                    {item.title}
                                </h3>
                                <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                                    {item.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Account Deletion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-4'
                >
                    <h2 className='text-base font-semibold text-gray-800 dark:text-white mb-3'>
                        Account Deactivation & Deletion
                    </h2>
                    <div className='space-y-2'>
                        <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                            <strong className='text-gray-800 dark:text-white'>Deactivation:</strong> You can deactivate your account at any time. Your profile will be hidden from the platform but data will be retained for 30 days.
                        </p>
                        <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                            <strong className='text-gray-800 dark:text-white'>Deletion:</strong> If you request account deletion, all associated data will be permanently deleted after 7 days. This action cannot be undone.
                        </p>
                        <p className='text-xs text-gray-600 dark:text-gray-300 leading-relaxed'>
                            To delete your account, contact us at hello@jobmate.com.np
                        </p>
                    </div>
                </motion.div>

                {/* Contact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl p-6 mb-8'
                >
                    <h2 className='text-base font-semibold text-gray-800 dark:text-white mb-3'>
                        Contact Us
                    </h2>
                    <p className='text-sm text-gray-600 dark:text-gray-300 mb-3'>
                        For any questions about these terms:
                    </p>
                    <div className='space-y-2'>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>📧 hello@jobmate.com.np</p>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>📱 +977-9800000000</p>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>📍 Kathmandu, Nepal</p>
                    </div>
                </motion.div>

                {/* CTA */}
                <div className='flex gap-3 justify-center'>
                    <Link
                        to='/privacy'
                        className='text-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        to='/contact'
                        className='text-sm bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors'
                    >
                        Contact Us
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Terms