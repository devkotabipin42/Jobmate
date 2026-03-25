import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../../../components/Navbar.jsx'
import Footer from '../../../components/Footer.jsx'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', subject: '', message: ''
    })
    const [sent, setSent] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSent(true)
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            <div className='bg-green-50 dark:bg-gray-800 py-16 px-6 text-center border-b border-gray-200 dark:border-gray-700'>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-3xl font-semibold text-green-900 dark:text-white mb-3'
                >
                    Contact Us
                </motion.h1>
                <p className='text-green-700 dark:text-gray-400 text-sm'>
                    Have any questions? We’re here to help!
                </p>
            </div>

            <div className='max-w-4xl mx-auto px-4 md:px-6 py-12'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='space-y-4'
                    >
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6'>
                            <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
                                Get in Touch
                            </h2>
                            <div className='space-y-4'>
                                {[
                                    { icon: '📧', label: 'Email', value: 'hello@jobmate.com.np', href: 'mailto:hello@jobmate.com.np' },
                                    { icon: '📱', label: 'Phone', value: '+977-9800000000', href: 'tel:+9779800000000' },
                                    { icon: '📍', label: 'Address', value: 'Kathmandu, Nepal', href: null },
                                    { icon: '🕒', label: 'Hours', value: 'Sun-Fri: 9AM - 6PM', href: null },
                                ].map((item, i) => (
                                    <div key={i} className='flex items-start gap-3'>
                                        <div className='w-8 h-8 bg-green-50 dark:bg-green-900 rounded-lg flex items-center justify-center text-sm shrink-0'>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className='text-xs text-gray-500 dark:text-gray-400'>{item.label}</p>
                                            {item.href ? (
                                                <a href={item.href} className='text-sm text-green-600 hover:underline'>
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p className='text-sm text-gray-800 dark:text-white'>{item.value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social */}
                        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6'>
                            <h3 className='text-sm font-medium text-gray-800 dark:text-white mb-3'>
                                Follow Us
                            </h3>
                            <div className='flex gap-3'>
                                {[
                                    { label: 'LinkedIn', href: 'https://linkedin.com' },
                                    { label: 'Facebook', href: 'https://facebook.com' },
                                    { label: 'Instagram', href: 'https://instagram.com' },
                                ].map((s, i) => (
                                    
                                      <a  key={i}
                                        href={s.href}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors'
                                    >
                                        {s.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6'
                    >
                        <h2 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
                            Send Message
                        </h2>

                        {sent ? (
                            <div className='text-center py-8'>
                                <div className='text-4xl mb-3'>✅</div>
                                <p className='text-sm font-medium text-green-600'>Message sent!</p>
                                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                    We will get back to you within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className='space-y-4'>
                                {[
                                    { label: 'Name', name: 'name', type: 'text', placeholder: 'Your name' },
                                    { label: 'Email', name: 'email', type: 'email', placeholder: 'your@email.com' },
                                    { label: 'Subject', name: 'subject', type: 'text', placeholder: 'How can we help?' },
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            required
                                            className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all'
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'>
                                        Message
                                    </label>
                                    <textarea
                                        placeholder='Your message...'
                                        rows={4}
                                        required
                                        className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-500 bg-white dark:bg-gray-700 dark:text-white transition-all resize-none'
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type='submit'
                                    className='w-full bg-green-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors'
                                >
                                    Send Message
                                </motion.button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Contact