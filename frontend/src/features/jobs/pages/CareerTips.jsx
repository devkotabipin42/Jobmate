import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../../components/Navbar.jsx'
import { useEffect, useRef } from 'react'

const tips = [
    {
        id: 1,
        category: 'Resume',
        
        title: 'How to Craft a Standout Resume',
        summary: 'Essential resume tips to get past the ATS and impress recruiters.',
        content: `
1. **Keep it concise** — Aim for one page, especially if you have under 5 years of experience.
2. **Standard structure** — Include clear sections for Contact Info, Skills, Experience, and Education.
3. **Highlight your tech stack** — Ensure your technical skills are prominently listed and categorized.
4. **Professional formatting** — Use a clean, ATS-friendly layout without overly complex graphics.
5. **Tailor to the role** — Adjust your keywords based on the specific job description.
6. **Focus on achievements** — Quantify your experience (e.g., "Improved load time by 30%").
7. **Keep references ready** — Have 2-3 professional references available upon request.
        `,
        color: 'bg-blue-50 dark:bg-blue-900',
        textColor: 'text-blue-600 dark:text-blue-300',
        borderColor: 'border-blue-200 dark:border-blue-700'
    },
    {
        id: 2,
        category: 'Interview',
        
        title: 'Mastering the Technical Interview',
        summary: 'Strategies to make a strong impression during your interviews.',
        content: `
1. **Punctuality matters** — Log in or arrive 5–10 minutes before the scheduled time.
2. **Dress appropriately** — Smart casual is generally safe, but match the company culture.
3. **Do your homework** — Research the company's recent projects, tech stack, and core values.
4. **Prepare for standard behavioral questions:**
   - "Tell me about a challenging project."
   - "Why do you want to join our engineering team?"
   - "How do you handle disagreements on technical decisions?"
5. **Communicate your thought process** — During coding rounds, explain your logic out loud.
6. **Have questions ready** — Always ask about the team structure, daily workflow, or growth opportunities.
7. **Follow up** — Send a brief "Thank you" email within 24 hours of the interview.
        `,
        color: 'bg-green-50 dark:bg-green-900',
        textColor: 'text-green-600 dark:text-green-300',
        borderColor: 'border-green-200 dark:border-green-700'
    },
    {
        id: 3,
        category: 'Salary',
       
        title: 'Strategies for Salary Negotiation',
        summary: 'How to confidently negotiate your compensation package.',
        content: `
1. **Know your market value** — Research average salaries for your role, experience level, and location.
2. **Timing is key** — Wait for the employer to bring up numbers or extend an offer first.
3. **Provide a range** — When asked, give a realistic salary range rather than a single fixed number.
4. **Look at the total package** — Consider bonuses, equity, remote work options, and health benefits, not just the base pay.
5. **Don't accept immediately** — Ask for 24-48 hours to review the official offer letter before signing.
6. **Be professional but firm** — If making a counter-offer, justify it with your skills and market research.
7. **Get everything in writing** — Ensure all agreed-upon terms are clearly stated in the final contract.
        `,
        color: 'bg-amber-50 dark:bg-amber-900',
        textColor: 'text-amber-600 dark:text-amber-300',
        borderColor: 'border-amber-200 dark:border-amber-700'
    },
    {
        id: 4,
        category: 'LinkedIn',
        
        title: 'Optimizing Your LinkedIn Profile',
        summary: 'How to attract tech recruiters and build a professional network.',
        content: `
1. **Professional headshot** — Use a clear, high-quality photo with good lighting.
2. **Compelling headline** — Go beyond just your job title (e.g., "Full Stack Developer | React & Node.js | Building Scalable Web Apps").
3. **Engaging 'About' section** — Summarize your expertise, current focus, and what you're passionate about in tech.
4. **Showcase your work** — Add links to your GitHub, live projects, or portfolio directly to your profile.
5. **Collect recommendations** — Ask former colleagues or mentors to write a brief recommendation for you.
6. **Engage with the community** — Share your learnings, comment on industry news, and connect with peers.
7. **Signal your availability** — Use the "Open to Work" feature (visibility can be set to recruiters only).
        `,
        color: 'bg-purple-50 dark:bg-purple-900',
        textColor: 'text-purple-600 dark:text-purple-300',
        borderColor: 'border-purple-200 dark:border-purple-700'
    },
    {
        id: 5,
        category: 'Skills',
        
        title: 'In-Demand Tech Skills for 2026',
        summary: 'The top programming languages and tools companies are looking for.',
        content: `
**Frontend Development:**
- React.js & Next.js — Industry standards for modern web apps.
- TypeScript — Increasingly preferred over plain JavaScript.
- Tailwind CSS / CSS-in-JS — For scalable styling.

**Backend Development:**
- Node.js (Express/NestJS) — High demand for JavaScript ecosystems.
- Python (Django/FastAPI) — Excellent for data-heavy applications.
- Java (Spring Boot) / C# (.NET) — Dominant in enterprise environments.

**Database & Infrastructure:**
- PostgreSQL & MongoDB — Top relational and NoSQL choices.
- Docker & Kubernetes — Essential for modern deployment.
- Cloud Basics (AWS / GCP / Azure) — A major advantage for any developer.

**Version Control:**
- Git & GitHub/GitLab workflows — Absolute mandatory requirement.
        `,
        color: 'bg-pink-50 dark:bg-pink-900',
        textColor: 'text-pink-600 dark:text-pink-300',
        borderColor: 'border-pink-200 dark:border-pink-700'
    },
    {
        id: 6,
        category: 'Freelance',
        
        title: 'Launching a Global Freelance Career',
        summary: 'How to secure international clients and build a freelance business.',
        content: `
1. **Choose the right platform:**
   - Upwork — Great for finding higher-paying, long-term contracts.
   - Fiverr — Good for selling highly specific, productized services.
   - Toptal / Turing — For senior developers who can pass rigorous vetting.

2. **Optimize your profile:**
   - Write a clear, client-focused bio highlighting how you solve problems.
   - Include a strong portfolio with live links and code repositories.
   - Start with competitive rates to build a strong review history.

3. **Master your proposals:**
   - Avoid generic copy-paste templates.
   - Address the client's specific problem in the very first sentence.

4. **Popular freelance niches:**
   - Custom Web Application Development (MERN/MEAN stack)
   - API Integration & Automation
   - UI/UX Design to Code conversions

5. **Manage your finances:**
   - Set up international payment gateways like Payoneer, Wise, or PayPal depending on your region.
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
