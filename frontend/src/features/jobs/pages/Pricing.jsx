import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../../../components/Navbar.jsx'
import Footer from '../../../components/Footer.jsx'

const Pricing = () => {
    const [billing, setBilling] = useState('monthly')

    const plans = [
        {
            name: 'Free',
            price: { monthly: 0, yearly: 0 },
            description: 'Perfect for job seekers',
            color: 'border-gray-200 dark:border-gray-700',
            badge: null,
            features: [
                'Browse unlimited jobs',
                'Apply to 10 jobs/month',
                'Basic profile',
                'CV upload',
                'Job alerts',
                'AI Resume Scorer',
            ],
            notIncluded: [
                'Featured applications',
                'Priority support',
                'Resume Builder',
            ],
            cta: 'Get Started Free',
            ctaStyle: 'border border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900',
            link: '/register'
        },
        {
            name: 'Starter',
            price: { monthly: 999, yearly: 799 },
            description: 'For small local employers',
            color: 'border-green-500',
            badge: 'Most Popular',
            features: [
                '1 active job posting',
                'Company profile page',
                'Basic applicant tracking',
                'Email alerts on apply',
                'Candidate shortlist',
                'Basic support',
            ],
            notIncluded: [
                'Featured job listings',
                'AI candidate matching',
                'Priority account manager',
            ],
            cta: 'Start Starter Plan',
            ctaStyle: 'bg-green-600 text-white hover:bg-green-700',
            link: '/register'
        },
        {
            name: 'Growth',
            price: { monthly: 2999, yearly: 2399 },
            description: 'For growing hiring teams',
            color: 'border-blue-500',
            badge: 'Best for SMEs',
            features: [
                'Up to 5 active job postings',
                'Featured company profile',
                'Advanced applicant tracking',
                'Pipeline / Kanban view',
                'CRM — candidate notes',
                'Priority employer support',
                'Basic AI candidate matching',
                'Employer verification support',
            ],
            notIncluded: [
                'Dedicated account manager',
                'Custom branding',
            ],
            cta: 'Start Growth Plan',
            ctaStyle: 'bg-blue-600 text-white hover:bg-blue-700',
            link: '/register'
        },
        {
            name: 'Pro',
            price: { monthly: 6999, yearly: 5599 },
            description: 'For serious hiring teams and bulk recruitment',
            color: 'border-purple-500',
            badge: 'Best Value',
            features: [
                'Up to 15 active job postings',
                'Featured job listings',
                'Company verification badge',
                'Advanced analytics dashboard',
                'AI candidate matching',
                'Broadcast emails',
                'Dedicated account manager',
                'Phone + email support',
                'Custom company branding',
                'Priority listing in search',
            ],
            notIncluded: [],
            cta: 'Start Pro Plan',
            ctaStyle: 'bg-purple-600 text-white hover:bg-purple-700',
            link: '/register'
        }
    ]

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            <div className='bg-gradient-to-r from-green-600 to-green-800 px-6 py-16 text-center'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className='text-xs bg-white/20 text-white px-3 py-1 rounded-full mb-4 inline-block'>
                        Flexible Employer Pricing
                    </span>
                    <h1 className='text-4xl font-bold text-white mb-3'>
                        Choose the Right Hiring Plan
                    </h1>
                    <p className='text-green-200 text-sm max-w-md mx-auto mb-8'>
                        Free for job seekers. Simple and affordable plans for employers in Nepal.
                    </p>

                    <div className='inline-flex bg-white/10 rounded-xl p-1'>
                        {['monthly', 'yearly'].map(b => (
                            <button
                                key={b}
                                onClick={() => setBilling(b)}
                                className={`px-5 py-2 text-sm rounded-lg transition-all capitalize ${
                                    billing === b
                                        ? 'bg-white text-green-700 font-medium shadow-sm'
                                        : 'text-white'
                                }`}
                            >
                                {b}
                                {b === 'yearly' && (
                                    <span className='ml-1 text-xs bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded-full font-medium'>
                                        Save 20%
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            <div className='max-w-7xl mx-auto px-4 md:px-6 py-16'>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'>
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-white dark:bg-gray-800 border-2 ${plan.color} rounded-2xl p-6 relative ${
                                plan.badge === 'Most Popular' ? 'shadow-lg scale-105' : ''
                            }`}
                        >
                            {plan.badge && (
                                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-4 py-1 rounded-full font-medium ${
                                    plan.badge === 'Most Popular'
                                        ? 'bg-green-600 text-white'
                                        : plan.badge === 'Best for SMEs'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-purple-600 text-white'
                                }`}>
                                    {plan.badge}
                                </span>
                            )}

                            <div className='mb-6'>
                                <h2 className='text-xl font-bold text-gray-800 dark:text-white mb-1'>
                                    {plan.name}
                                </h2>
                                <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                                    {plan.description}
                                </p>
                                <div className='flex items-end gap-1 flex-wrap'>
                                    <span className='text-4xl font-bold text-gray-800 dark:text-white'>
                                        {plan.price[billing] === 0 ? 'Free' : `Rs. ${plan.price[billing]}`}
                                    </span>
                                    {plan.price[billing] > 0 && (
                                        <span className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                                            /month
                                        </span>
                                    )}
                                </div>
                                {billing === 'yearly' && plan.price.yearly > 0 && (
                                    <p className='text-xs text-green-600 mt-1'>
                                        Billed yearly — save Rs. {(plan.price.monthly - plan.price.yearly) * 12}/year
                                    </p>
                                )}
                            </div>

                            <Link
                                to={plan.link}
                                className={`w-full block text-center py-3 rounded-xl text-sm font-medium transition-colors mb-6 ${plan.ctaStyle}`}
                            >
                                {plan.cta}
                            </Link>

                            <div className='space-y-3'>
                                {plan.features.map((feature, j) => (
                                    <div key={j} className='flex items-center gap-2'>
                                        <div className='w-4 h-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0'>
                                            <span className='text-green-600 dark:text-green-300 text-xs'>✓</span>
                                        </div>
                                        <span className='text-sm text-gray-600 dark:text-gray-300'>{feature}</span>
                                    </div>
                                ))}
                                {plan.notIncluded.map((feature, j) => (
                                    <div key={j} className='flex items-center gap-2 opacity-40'>
                                        <div className='w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0'>
                                            <span className='text-gray-400 text-xs'>✕</span>
                                        </div>
                                        <span className='text-sm text-gray-400 line-through'>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
{/* Assisted Hiring */}
<motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className='mt-16 rounded-3xl p-8 md:p-10 text-white text-center border border-white/10 bg-gradient-to-r from-emerald-700 via-green-700 to-teal-800 shadow-2xl'
>
    <span className='text-xs bg-white/10 border border-white/15 px-3 py-1 rounded-full mb-3 inline-block backdrop-blur-sm'>
        Assisted Hiring Service
    </span>

    <h2 className='text-2xl md:text-3xl font-bold mb-2'>
        Need Help Finding the Right Staff?
    </h2>

    <p className='text-green-100 text-sm md:text-base max-w-2xl mx-auto mb-6 leading-relaxed'>
        Let our JobMate team handle sourcing, screening, shortlisting, and interview coordination for you.
    </p>

    <div className='bg-black/10 border border-white/10 backdrop-blur rounded-2xl p-6 max-w-2xl mx-auto mb-6'>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-2 mb-3'>
            <span className='text-4xl font-bold'>Rs 3,500</span>
            <span className='text-green-100 text-sm md:text-base'>per successful hire</span>
        </div>
        <p className='text-sm text-green-100 leading-relaxed'>
            Pay only when hiring is successful. Includes a 15-day replacement guarantee with no monthly commitment.
        </p>
    </div>

    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8 text-left'>
        {[
            'Urgent hiring support',
            'Bulk recruitment for multiple roles',
            'Verified candidate screening',
            'Interview scheduling support',
        ].map((item, i) => (
            <div key={i} className='flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3'>
                <span className='text-green-200 text-base'>✓</span>
                <span className='text-sm text-white'>{item}</span>
            </div>
        ))}
    </div>

    <Link
        to='/contact?service=assisted-hiring'
        className='bg-white text-emerald-800 px-8 py-3 rounded-xl text-sm font-semibold hover:bg-green-50 transition-colors inline-block shadow-lg'
    >
        Request Assisted Hiring
    </Link>
</motion.div>
                <div className='mt-16'>
                    <h2 className='text-2xl font-semibold text-gray-800 dark:text-white text-center mb-8'>
                        Frequently Asked Questions
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto'>
                        {[
                            {
                                q: 'Can I cancel anytime?',
                                a: 'Yes. You can cancel anytime, and your plan will remain active until the end of your billing cycle.'
                            },
                            {
                                q: 'Is JobMate free for workers?',
                                a: 'Yes. Job seekers can browse jobs, build profiles, and apply without paying any subscription fee.'
                            },
                            {
                                q: 'How can employers pay?',
                                a: 'Employers can pay using eSewa, Khalti, bank transfer, or manual invoice support.'
                            },
                            {
                                q: 'Which plan is best for a small business?',
                                a: 'Starter is best for small local employers hiring occasionally, while Growth is better for businesses hiring multiple roles.'
                            },
                        ].map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5'
                            >
                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-2'>
                                    {faq.q}
                                </h3>
                                <p className='text-sm text-gray-500 dark:text-gray-400 leading-relaxed'>
                                    {faq.a}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className='mt-16 text-center bg-green-900 dark:bg-gray-800 rounded-2xl p-10'>
                    <h2 className='text-2xl font-semibold text-white mb-3'>
                        Need custom hiring support?
                    </h2>
                    <p className='text-green-200 dark:text-gray-400 text-sm mb-6'>
                        Contact JobMate for bulk hiring, assisted recruitment, and custom employer plans.
                    </p>
                    <Link
                        to='/contact'
                        className='bg-white text-green-800 px-6 py-3 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors inline-block'
                    >
                        Contact Sales
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Pricing