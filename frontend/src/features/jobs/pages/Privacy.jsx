import { motion } from 'framer-motion'
import Navbar from '../../../components/Navbar.jsx'
import Footer from '../../../components/Footer.jsx'

const Privacy = () => {
    const sections = [
        {
            title: '1. Information We Collect',
            content: `When you use Jobmate, we collect the following information:
            
- Personal Information: Name, email address, phone number, location
- Professional Information: Resume/CV, work experience, education, skills
- Account Information: Username, password (encrypted), profile photo
- Usage Data: Pages visited, jobs viewed, applications submitted
- Device Information: IP address, browser type, device type

This information is collected when you register, apply for jobs, or use our platform.`
        },
        {
            title: '2. How We Use Your Information',
            content: `Your information is used to:

- Match you with relevant job opportunities
- Allow employers to review your applications
- Send job alerts and platform notifications
- Improve our platform and user experience
- Ensure platform security and prevent fraud
- Comply with legal requirements

We do NOT sell your personal information to third parties.`
        },
        {
            title: '3. Information Sharing',
            content: `We share your information only in these cases:

- With Employers: When you apply for a job, your profile and CV are shared with that employer only
- Service Providers: Trusted partners who help us operate our platform (hosting, email services)
- Legal Requirements: When required by law or government authority
- Business Transfer: In case of merger or acquisition, with prior notice

Your information is never sold to advertisers or marketing companies.`
        },
        {
            title: '4. Data Security',
            content: `We take security seriously:

- All passwords are encrypted using bcrypt hashing
- Data is transmitted over HTTPS (SSL encryption)
- Regular security audits are conducted
- Access to user data is strictly limited to authorized personnel
- We use industry-standard security practices

However, no method of transmission over the internet is 100% secure. We strive to protect your data but cannot guarantee absolute security.`
        },
        {
            title: '5. Cookies',
            content: `Jobmate uses cookies to:

- Keep you logged in (session cookies)
- Remember your preferences (theme, language)
- Analyze platform usage to improve our services
- Ensure platform security

You can disable cookies in your browser settings, but some features may not work properly.`
        },
        {
            title: '6. Your Rights',
            content: `You have the following rights:

- Access: View all personal information we have about you
- Update: Edit your profile and personal information at any time
- Delete: Request deletion of your account and all associated data
- Portability: Download your data in a readable format
- Opt-out: Unsubscribe from marketing emails at any time

To exercise these rights, contact us at hello@jobmate.com.np`
        },
        {
            title: '7. Resume & CV Privacy',
            content: `Your resume is confidential:

- Only employers you apply to can view your resume
- You can update or delete your resume at any time
- We do not share your resume without your consent
- Employers cannot download your resume without your application

Your career information is yours — we just help you share it with the right employers.`
        },
        {
            title: '8. Children\'s Privacy',
            content: `Jobmate is not intended for users under 16 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.`
        },
        {
            title: '9. Changes to This Policy',
            content: `We may update this privacy policy from time to time. When we do:

- We will notify you via email
- We will post the updated policy on this page
- The "Last Updated" date will be revised

Continued use of Jobmate after changes means you accept the updated policy.`
        },
        {
            title: '10. Contact Us',
            content: `For any privacy-related questions or concerns:

📧 Email: hello@jobmate.com.np
📱 Phone: +977-9800000000
📍 Address: Kathmandu, Nepal

We will respond to all privacy inquiries within 48 hours.`
        },
    ]

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            <div className='bg-green-50 dark:bg-gray-800 py-16 px-6 text-center border-b border-gray-200 dark:border-gray-700'>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-3xl font-semibold text-green-900 dark:text-white mb-3'
                >
                    Privacy Policy
                </motion.h1>
                <p className='text-green-700 dark:text-gray-400 text-sm'>
                    Last updated: March 2025
                </p>
                <p className='text-green-600 dark:text-gray-500 text-xs mt-2'>
                    Jobmate Pvt. Ltd. · Kathmandu, Nepal
                </p>
            </div>

            <div className='max-w-3xl mx-auto px-4 md:px-6 py-12'>

                {/* Intro */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl p-6 mb-6'
                >
                    <p className='text-sm text-green-800 dark:text-green-200 leading-relaxed'>
                        This Privacy Policy explains how Jobmate ("we", "us", "our") collects, uses, and protects your personal information when you use our platform. By using Jobmate, you agree to the collection and use of information as described in this policy.
                    </p>
                </motion.div>

                <div className='space-y-4'>
                    {sections.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6'
                        >
                            <h2 className='text-sm font-semibold text-gray-800 dark:text-white mb-3'>
                                {section.title}
                            </h2>
                            <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line'>
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Privacy