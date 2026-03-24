import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../../components/Navbar.jsx'
import { useEffect, useRef } from 'react'

const tips = [
    {
        id: 1,
        category: 'Resume',
        emoji: '📄',
        title: 'How to Create a Perfect Resume',
        summary: 'Resume tips for the Nepal job market',
        content: `
1. **Keep it one page** — HR has limited time
2. **For Nepali companies** — Include Name, Contact, Skills, Experience, Education
3. **Skills section is important** — Clearly list technical skills
4. **Add a photo** — Common practice in Nepal
5. **Use both Nepali + English** — Be comfortable in both
6. **Do not mention salary expectation** — Discuss it in the interview
7. **References** — Keep 2 references ready
        `,
        color: 'bg-blue-50 dark:bg-blue-900',
        textColor: 'text-blue-600 dark:text-blue-300',
        borderColor: 'border-blue-200 dark:border-blue-700'
    },
    {
        id: 2,
        category: 'Interview',
        emoji: '🎯',
        title: 'Interview Tips for Nepal',
        summary: 'How to make a strong impression in interviews',
        content: `
1. **Be on time** — Arrive 10–15 minutes early
2. **Dress formally** — Important in Nepal
3. **Research the company** — Check their website beforehand
4. **Prepare common questions:**
   - Tell me about yourself
   - Why do you want to join us?
   - What is your salary expectation?
5. **Speaking in Nepali is okay** — Do not force English
6. **Know the market salary** — Negotiate smartly
7. **Ask questions** — “What will be my role?” etc.
        `,
        color: 'bg-green-50 dark:bg-green-900',
        textColor: 'text-green-600 dark:text-green-300',
        borderColor: 'border-green-200 dark:border-green-700'
    },
    {
        id: 3,
        category: 'Salary',
        emoji: '💰',
        title: 'How to Negotiate Salary',
        summary: 'Salary negotiation guide for Nepal',
        content: `
1. **Know the market rate** — Check salary ranges on Jobmate
2. **Wait for the offer first** — Let them speak first
3. **Give a range** — “I am expecting 40,000 to 50,000”
4. **Check benefits** — PF, medical, bonus, leave
5. **Make a counter offer** — Ask 10–20% higher
6. **Get it in writing** — Do not forget the offer letter
7. **Average salary in Nepal:**
   - Fresh Graduate: 20,000 - 35,000
   - 1-2 years: 35,000 - 60,000
   - 3-5 years: 60,000 - 1,00,000
        `,
        color: 'bg-amber-50 dark:bg-amber-900',
        textColor: 'text-amber-600 dark:text-amber-300',
        borderColor: 'border-amber-200 dark:border-amber-700'
    },
    {
        id: 4,
        category: 'LinkedIn',
        emoji: '💼',
        title: 'How to Build a Strong LinkedIn Profile',
        summary: 'LinkedIn tips for IT jobs in Nepal',
        content: `
1. **Use a professional photo** — Clear and formal background
2. **Headline matters** — “Full Stack Developer | MERN Stack | Open to Work”
3. **About section** — Describe yourself in 3–4 lines
4. **Add skills** — At least 10 skills
5. **Add projects** — Include GitHub links
6. **Grow connections** — Connect with Nepali recruiters
7. **Stay active** — Like/comment on posts for visibility
8. **Open to Work** — Enable the green frame
        `,
        color: 'bg-purple-50 dark:bg-purple-900',
        textColor: 'text-purple-600 dark:text-purple-300',
        borderColor: 'border-purple-200 dark:border-purple-700'
    },
    {
        id: 5,
        category: 'Skills',
        emoji: '🚀',
        title: 'Top Skills for Nepal IT Market',
        summary: 'Most in-demand skills in 2025',
        content: `
**Frontend:**
- React.js — High demand
- Next.js — Growing fast
- Tailwind CSS — Must have

**Backend:**
- Node.js + Express
- PHP + Laravel
- Python + Django

**Database:**
- MongoDB
- MySQL / PostgreSQL

**Other:**
- Git / GitHub — Must
- Docker — Plus point
- AWS basics — Bonus
- AI/ML basics — Future

**Salary boost:**
React + Node + MongoDB = 50,000-80,000 (fresh)
        `,
        color: 'bg-pink-50 dark:bg-pink-900',
        textColor: 'text-pink-600 dark:text-pink-300',
        borderColor: 'border-pink-200 dark:border-pink-700'
    },
    {
        id: 6,
        category: 'Freelance',
        emoji: '🌐',
        title: 'How to Start Freelancing from Nepal',
        summary: 'Earn dollars using Upwork & Fiverr',
        content: `
1. **Platforms:**
   - Upwork — Best for long-term work
   - Fiverr — Best for beginners
   - Freelancer.com

2. **Payment methods in Nepal:**
   - Payoneer — Most popular
   - Wise (TransferWise)
   - Bank wire transfer

3. **Profile tips:**
   - Create profile in English
   - Add portfolio projects
   - Reviews matter — start with lower rates

4. **Popular services from Nepal:**
   - Web development
   - WordPress sites
   - Logo design
   - Data entry

5. **Average earning:**
   - Beginner: $300-500/month
   - Intermediate: $500-1500/month
   - Expert: $2000+/month
        `,
        color: 'bg-teal-50 dark:bg-teal-900',
        textColor: 'text-teal-600 dark:text-teal-300',
        borderColor: 'border-teal-200 dark:border-teal-700'
    },
]

const categories = ['All', 'Resume', 'Interview', 'Salary', 'LinkedIn', 'Skills', 'Freelance']

const CareerTips = () => {
    const [selected, setSelected] = useState(null)
    const [activeCategory, setActiveCategory] = useState('All')
    const modalRef = useRef(null)

    useEffect(() => {
    if (selected && modalRef.current) {
        modalRef.current.scrollTop = 0
    }
}, [selected])

    const filtered = activeCategory === 'All'
        ? tips
        : tips.filter(t => t.category === activeCategory)

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
            <Navbar />

            {/* Header */}
            <div className='bg-green-50 dark:bg-gray-800 py-10 px-4 text-center border-b border-gray-200 dark:border-gray-700'>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-3xl font-semibold text-green-900 dark:text-white mb-3'
                >
                    Career Tips
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className='text-green-700 dark:text-gray-400 text-sm'
                >
                    Practical tips for the Nepal job market
                </motion.p>
            </div>

            <div className='max-w-5xl mx-auto px-4 md:px-6 py-8'>

                {/* Category filters */}
                <div className='flex gap-2 flex-wrap mb-8'>
                    {categories.map((cat) => (
                        <motion.button
                            key={cat}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm transition-colors ${
                                activeCategory === cat
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-green-400'
                            }`}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>

                {/* Tips Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filtered.map((tip, i) => (
                        <motion.div
                            
                            key={tip.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -4 }}
                            onClick={() => setSelected(tip)}
                            className={`${tip.color} border ${tip.borderColor} rounded-xl p-5 cursor-pointer transition-colors hover:shadow-sm`}
                        >
                            <div className='text-3xl mb-3'>{tip.emoji}</div>
                            <span className={`text-xs font-medium ${tip.textColor} mb-2 block`}>
                                {tip.category}
                            </span>
                            <h3 className='text-sm font-medium text-gray-800 dark:text-white mb-2'>
                                {tip.title}
                            </h3>
                            <p className='text-xs text-gray-500 dark:text-gray-400'>
                                {tip.summary}
                            </p>
                            <div className={`mt-3 text-xs ${tip.textColor} font-medium`}>
                                Read more →
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selected && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelected(null)}
                            className='fixed inset-0 bg-black/50 z-40'
                        />
                        <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9, y: 20 }}
    className='fixed inset-0 flex items-center justify-center z-50 px-4'
    style={{ pointerEvents: 'none' }}
>
    <div
        className='w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl p-6 overflow-y-auto max-h-[80vh]'
        style={{ pointerEvents: 'auto' }}
    >
        <div className='flex items-start justify-between mb-4'>
            <div>
                <span className='text-3xl'>{selected.emoji}</span>
                <h2 className='text-lg font-semibold text-gray-800 dark:text-white mt-2'>
                    {selected.title}
                </h2>
            </div>
            <button
                onClick={() => setSelected(null)}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl shrink-0'
            >
                ✕
            </button>
        </div>

        <div>
            {selected.content.trim().split('\n').map((line, i) => (
                <p key={i} className='text-sm text-gray-600 dark:text-gray-300 mb-1'>
                    {line}
                </p>
            ))}
        </div>
    </div>
</motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CareerTips
