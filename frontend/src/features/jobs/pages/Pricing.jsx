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
            name: 'Basic',
            price: { monthly: 499, yearly: 399 },
            description: 'For growing employers',
            color: 'border-green-500',
            badge: 'Most Popular',
            features: [
                'Post up to 5 jobs/month',
                'Company profile page',
                'Applicant tracking',
                'Email alerts on apply',
                'Pipeline/Kanban view',
                'CRM — candidate notes',
                'Priority email support',
            ],
            notIncluded: [
                'Featured job listings',
                'Dedicated account manager',
            ],
            cta: 'Start Basic Plan',
            ctaStyle: 'bg-green-600 text-white hover:bg-green-700',
            link: '/register'
        },
        {
            name: 'Premium',
            price: { monthly: 999, yearly: 799 },
            description: 'For serious hiring teams',
            color: 'border-purple-500',
            badge: 'Best Value',
            features: [
                'Unlimited job postings',
                'Featured job listings',
                'Company verification badge',
                'Advanced analytics',
                'AI candidate matching',
                'Broadcast emails',
                'Dedicated account manager',
                'Phone + email support',
                'Custom company branding',
            ],
            notIncluded: [],
            cta: 'Start Premium Plan',
            ctaStyle: 'bg-purple-600 text-white hover:bg-purple-700',
            link: '/register'
        }
    ]

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            {/* Header */}
            <div className='bg-gradient-to-r from-green-600 to-green-800 px-6 py-16 text-center'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className='text-xs bg-white/20 text-white px-3 py-1 rounded-full mb-4 inline-block'>
                        Simple Pricing
                    </span>
                    <h1 className='text-4xl font-bold text-white mb-3'>
                        Choose Your Plan
                    </h1>
                    <p className='text-green-200 text-sm max-w-md mx-auto mb-8'>
                        Start free — upgrade when you need more. Nepal's most affordable job platform.
                    </p>

                    {/* Billing Toggle */}
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
                                        -20%
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Plans */}
            <div className='max-w-6xl mx-auto px-4 md:px-6 py-16'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
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
                                <div className='flex items-end gap-1'>
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

                {/* FAQ Section */}
                <div className='mt-16'>
                    <h2 className='text-2xl font-semibold text-gray-800 dark:text-white text-center mb-8'>
                        Frequently Asked Questions
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto'>
                        {[
                            {
                                q: 'Can I cancel anytime?',
                                a: 'Yes! Cancel anytime — no questions asked. Your plan stays active until the end of the billing period.'
                            },
                            {
                                q: 'Is there a free trial?',
                                a: 'Job seekers get a completely free plan forever. Employers can start with a 7-day free trial on any paid plan.'
                            },
                            {
                                q: 'How do I pay?',
                                a: 'We accept eSewa, Khalti, and bank transfer. International cards coming soon.'
                            },
                            {
                                q: 'What is a featured job?',
                                a: 'Featured jobs appear at the top of search results and on the home page — getting 5x more visibility.'
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

                {/* CTA */}
                <div className='mt-16 text-center bg-green-900 dark:bg-gray-800 rounded-2xl p-10'>
                    <h2 className='text-2xl font-semibold text-white mb-3'>
                        Still not sure?
                    </h2>
                    <p className='text-green-200 dark:text-gray-400 text-sm mb-6'>
                        Contact us — we will help you choose the right plan
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