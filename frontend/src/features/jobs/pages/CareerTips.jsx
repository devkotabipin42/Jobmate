import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../../../components/Navbar.jsx'
import { useEffect, useRef } from 'react'

const tips = [
    {
        id: 1,
        category: 'Resume',
        emoji: '📄',
        title: 'How to Craft a Standout Resume in 2026',
        summary: 'Beat ATS filters and impress modern recruiters with a sharp, tailored resume.',
        readTime: '4 min read',
        accent: '#3b82f6',
        accentLight: '#eff6ff',
        tag: 'Essential',
        content: [
            { heading: null, items: [
                { bold: 'Keep it to one page', text: ' — Especially if you have under 5 years of experience. Recruiters spend less than 10 seconds on a first scan.' },
                { bold: 'ATS-friendly format', text: ' — Use a clean layout with no tables, graphics, or columns that confuse automated screening systems.' },
                { bold: 'Tailor every application', text: ' — Customize your keywords to match each job description. Generic resumes get filtered out fast.' },
                { bold: 'Lead with impact, not duties', text: ' — Instead of "Responsible for backend APIs," write "Built REST APIs serving 10,000+ daily users."' },
                { bold: 'Quantify your achievements', text: ' — Numbers stand out: "Reduced load time by 40%", "Increased test coverage from 30% to 85%".' },
                { bold: 'Highlight your tech stack clearly', text: ' — Create a dedicated Skills section with categories (Frontend, Backend, DevOps, Tools).' },
                { bold: 'Include live links', text: ' — Add your GitHub profile, deployed project URLs, and LinkedIn. Dead links hurt credibility.' },
                { bold: 'Proofread twice', text: ' — Spelling errors or broken links are instant disqualifiers at top companies.' },
            ]}
        ]
    },
    {
        id: 2,
        category: 'Interview',
        emoji: '🎯',
        title: 'Mastering the Technical Interview in 2026',
        summary: 'From coding rounds to system design — strategies to land the offer.',
        readTime: '5 min read',
        accent: '#16a34a',
        accentLight: '#f0fdf4',
        tag: 'High Impact',
        content: [
            { heading: null, items: [
                { bold: 'Arrive prepared, not just on time', text: " — Research the company's tech stack, recent product launches, and engineering blog." },
                { bold: 'System design is non-negotiable', text: ' — Even for mid-level roles, expect questions on scalability, databases, and API architecture.' },
                { bold: 'Think out loud during coding rounds', text: ' — Interviewers evaluate your problem-solving approach, not just the final answer.' },
                { bold: 'Practice behavioral questions with STAR format', text: ' — Situation → Task → Action → Result. E.g. "Tell me about a time you debugged a critical production issue."' },
                { bold: 'Prepare your own questions', text: ' — Always ask about team structure, code review culture, and growth opportunities.' },
                { bold: 'Mock interviews are underrated', text: ' — Practice on Pramp or Interviewing.io at least 2 weeks before the real thing.' },
                { bold: 'Follow up within 24 hours', text: ' — Send a short genuine thank-you email referencing a specific topic from the interview.' },
                { bold: 'For AI-era interviews', text: ' — Expect questions on how you use AI tools in your workflow and how you validate AI-generated code.' },
            ]}
        ]
    },
    {
        id: 3,
        category: 'Salary',
        emoji: '💰',
        title: 'Salary Negotiation Strategies for 2026',
        summary: 'Negotiate confidently and maximize your total compensation package.',
        readTime: '4 min read',
        accent: '#d97706',
        accentLight: '#fffbeb',
        tag: 'Money',
        content: [
            { heading: null, items: [
                { bold: 'Research before you respond', text: ' — Use Glassdoor, LinkedIn Salary, and Levels.fyi to understand market rates for your role and location.' },
                { bold: 'Let them speak first', text: " — Don't volunteer a number early. If pushed, give a well-researched range, not a single figure." },
                { bold: 'Think total compensation', text: ' — Factor in bonuses, equity/stock options, remote flexibility, health insurance, and learning budgets.' },
                { bold: 'The 24-48 hour rule', text: ' — Always ask for time to review any offer before accepting.' },
                { bold: 'Counter with data, not emotion', text: ' — "Based on my research and the market rate for this role, I was expecting something closer to X."' },
                { bold: 'Silence is powerful', text: " — After stating your number, stop talking. Don't undersell yourself by rushing to fill the silence." },
                { bold: 'Get everything in writing', text: ' — Verbal promises mean nothing. Confirm all agreed terms in the official offer letter.' },
                { bold: 'In a tight market', text: ' — If the salary is firm, negotiate other perks: extra vacation days, signing bonus, or remote work policy.' },
            ]}
        ]
    },
    {
        id: 4,
        category: 'LinkedIn',
        emoji: '🔗',
        title: 'Optimizing Your LinkedIn for Tech Recruiters',
        summary: 'Turn your LinkedIn profile into an inbound recruiting machine.',
        readTime: '4 min read',
        accent: '#7c3aed',
        accentLight: '#f5f3ff',
        tag: 'Visibility',
        content: [
            { heading: null, items: [
                { bold: 'Headline beyond your job title', text: ' — Write what you build and for whom: "Full Stack Developer | React & Node.js | Building scalable web apps for startups."' },
                { bold: 'Professional photo is mandatory', text: ' — Profiles with photos get 21x more views. Use good lighting and a neutral background.' },
                { bold: 'Featured section is your portfolio', text: ' — Pin your best project, a live demo link, or a GitHub repo at the very top.' },
                { bold: 'About section = your elevator pitch', text: " — Summarize your expertise and what you're currently working on or looking for." },
                { bold: 'Keyword optimization matters', text: ' — Recruiters search by skills. Include "React", "Node.js", "MongoDB", "REST API", "Docker" in your descriptions.' },
                { bold: 'Turn on Open to Work', text: ' — Set visibility to "Recruiters only" to signal availability without alerting your current employer.' },
                { bold: 'Engage consistently', text: ' — Comment thoughtfully on industry posts. Profiles that engage get ranked higher in recruiter searches.' },
                { bold: 'Collect strategic recommendations', text: ' — Ask 2-3 colleagues or mentors to write specific recommendations about a shared project.' },
            ]}
        ]
    },
    {
        id: 5,
        category: 'Skills',
        emoji: '⚡',
        title: 'Most In-Demand Tech Skills for 2026',
        summary: 'The exact skills and tools employers are hiring for right now.',
        readTime: '5 min read',
        accent: '#db2777',
        accentLight: '#fdf2f8',
        tag: 'Updated 2026',
        content: [
            { heading: 'Frontend Development', items: [
                { bold: 'React.js & Next.js', text: ' — Still the industry standard for modern web apps.' },
                { bold: 'TypeScript', text: ' — Now preferred over plain JavaScript in most companies.' },
                { bold: 'Tailwind CSS', text: ' — Dominant in the modern frontend ecosystem.' },
            ]},
            { heading: 'Backend Development', items: [
                { bold: 'Node.js (Express / NestJS)', text: ' — High demand, especially in startups.' },
                { bold: 'Python (FastAPI / Django)', text: ' — Top choice for AI-integrated applications.' },
                { bold: 'Java (Spring Boot) / C# (.NET)', text: ' — Dominant in enterprise and banking.' },
            ]},
            { heading: 'AI & Modern Tooling', items: [
                { bold: 'Prompt Engineering & LLM integration', text: ' — OpenAI, Gemini, LangChain. A massive differentiator in 2026.' },
                { bold: 'MLOps basics', text: ' — Increasingly expected at senior levels.' },
            ]},
            { heading: 'DevOps & Infrastructure', items: [
                { bold: 'Docker & Kubernetes', text: ' — Essential for modern deployment pipelines.' },
                { bold: 'Cloud Basics (AWS / GCP / Azure)', text: ' — A strong career multiplier.' },
                { bold: 'CI/CD with GitHub Actions', text: ' — Expected in most team environments.' },
            ]},
            { heading: 'Non-Negotiables', items: [
                { bold: 'Git & GitHub', text: ' — Absolute mandatory skill. Clean commit history matters.' },
                { bold: 'System Design fundamentals', text: ' — Required for mid-to-senior interviews.' },
                { bold: 'PostgreSQL & MongoDB', text: ' — Top relational and NoSQL choices.' },
            ]},
        ]
    },
    {
        id: 6,
        category: 'Freelance',
        emoji: '🌍',
        title: 'Launching a Global Freelance Career',
        summary: 'Land international clients and build a sustainable freelance business.',
        readTime: '5 min read',
        accent: '#0d9488',
        accentLight: '#f0fdfa',
        tag: 'Business',
        content: [
            { heading: 'Choose the Right Platform', items: [
                { bold: 'Upwork', text: ' — Best for long-term, higher-paying contracts. Invest time in your profile.' },
                { bold: 'Fiverr', text: ' — Great for productized services (e.g., "I will build your MERN stack app").' },
                { bold: 'Toptal / Turing', text: ' — Rigorous vetting, but pays top-tier global rates for senior devs.' },
            ]},
            { heading: 'Win More Clients', items: [
                { bold: 'Your profile is a sales page', text: ' — Lead with the client problem. "I help startups launch faster" > "I know React."' },
                { bold: 'Address their specific problem in line one', text: ' — Avoid generic copy-paste proposal templates at all costs.' },
                { bold: 'Show one relevant past project', text: ' — Include a live link in every single proposal you send.' },
            ]},
            { heading: 'High-Demand Niches in 2026', items: [
                { bold: 'MERN / MEAN stack', text: ' — Web application development is always in demand.' },
                { bold: 'AI feature integration', text: ' — Chatbots, resume scorers, recommendation engines.' },
                { bold: 'API development & automation', text: ' — Third-party integrations and workflow automation.' },
            ]},
            { heading: 'Finances & Payments', items: [
                { bold: 'Payoneer or Wise', text: ' — Best options for receiving international payments efficiently.' },
                { bold: 'Track income from day one', text: ' — Stay organized for tax purposes from the very first client.' },
            ]},
        ]
    },
    {
        id: 7,
        category: 'GitHub',
        emoji: '🐙',
        title: 'Building a GitHub Portfolio That Gets You Hired',
        summary: "Turn your GitHub into a living resume that speaks louder than your CV.",
        readTime: '4 min read',
        accent: '#374151',
        accentLight: '#f9fafb',
        tag: 'Portfolio',
        content: [
            { heading: null, items: [
                { bold: 'Quality over quantity', text: ' — 3 to 5 strong, complete projects beat 20 unfinished repos. Recruiters judge depth, not count.' },
                { bold: 'Every repo needs a great README', text: ' — Include: what it does, tech stack, how to run it locally, and a live demo link.' },
                { bold: 'Pin your best 6 repositories', text: ' — Your pinned repos are the first thing any visitor sees. Make them count.' },
                { bold: 'Consistent green contributions graph', text: ' — Regular commit activity signals professionalism. Documentation updates count.' },
                { bold: 'Contribute to open source', text: ' — Even fixing a typo in a popular repo demonstrates real-world collaboration to employers.' },
                { bold: 'Write meaningful commit messages', text: ' — "fix bug" is not acceptable. Use: "fix: resolve null auth token on logout route".' },
                { bold: 'Add a GitHub profile README', text: ' — Create a special repo with your username to display your bio, skills, and featured projects.' },
                { bold: 'Tag your repos', text: ' — Add relevant topics (e.g., "mern-stack", "job-portal") to make your repos discoverable.' },
            ]}
        ]
    },
    {
        id: 8,
        category: 'AI & Future',
        emoji: '🤖',
        title: 'Thriving as a Developer in the AI Era',
        summary: 'How to stay relevant, competitive, and valuable as AI reshapes software development.',
        readTime: '6 min read',
        accent: '#4f46e5',
        accentLight: '#eef2ff',
        tag: 'Trending',
        content: [
            { heading: null, items: [
                { bold: 'AI will not replace you — but developers who use AI will', text: '. Learn GitHub Copilot, Cursor, and ChatGPT in your daily workflow.' },
                { bold: 'Shift from code writer to problem solver', text: ' — The most valued skill in 2026 is understanding systems and architecture, not just syntax.' },
                { bold: 'Build with AI, not just alongside it', text: ' — Add AI features to your projects: recommendation engines, chatbots, resume scorers. These stand out massively.' },
                { bold: 'Learn the basics of Prompt Engineering', text: ' — Getting structured, reliable outputs from LLMs is a real, monetizable skill right now.' },
                { bold: 'Understand LangChain or similar frameworks', text: ' — These are becoming standard for AI-powered backend development.' },
                { bold: 'Build and show in public', text: ' — Share your projects on LinkedIn and GitHub. Visible developers get noticed far more than those who code in silence.' },
                { bold: 'Stay T-shaped', text: ' — Be broadly skilled across the stack, but go deep in 1-2 areas. Pure generalists are becoming less competitive.' },
                { bold: 'Continuous learning is now survival', text: ' — Gartner predicts 80% of engineers will need to upskill by 2027. Make learning a weekly habit.' },
            ]}
        ]
    },
    {
        id: 9,
        category: 'Remote Jobs',
        emoji: '🏠',
        title: 'Landing & Succeeding in Remote Tech Jobs',
        summary: 'How to find, apply for, and thrive in remote developer positions worldwide.',
        readTime: '4 min read',
        accent: '#0891b2',
        accentLight: '#ecfeff',
        tag: 'Global',
        content: [
            { heading: 'Top Platforms for Remote Developer Jobs', items: [
                { bold: 'We Work Remotely', text: ' — One of the most active boards for remote tech roles.' },
                { bold: 'Remote OK', text: ' — Aggregates remote jobs from hundreds of companies.' },
                { bold: 'LinkedIn', text: ' — Filter by "Remote" in any job search and set job alerts.' },
                { bold: 'Wellfound (AngelList)', text: ' — Great for remote startup roles with equity.' },
            ]},
            { heading: 'How to Stand Out', items: [
                { bold: 'Async communication skills are judged before coding skills', text: ' — Write clear, concise messages and over-communicate your progress.' },
                { bold: 'Build a personal website or portfolio', text: ' — Remote employers rely heavily on online presence since they cannot meet you in person.' },
                { bold: 'Home office setup signals professionalism', text: ' — Clean background, decent lighting, and clear audio matter in remote interviews.' },
            ]},
            { heading: 'Succeed Once You Are Hired', items: [
                { bold: 'Attend standups prepared', text: ' — Document your work and contribute to discussions. Visibility matters when not in the same office.' },
                { bold: 'Get comfortable with remote tools', text: ' — Notion, Linear, Figma, Jira, Slack, and GitHub project boards are standard in remote teams.' },
                { bold: 'Watch out for remote job scams', text: ' — Legitimate jobs never ask you to pay upfront or share banking details before a signed contract.' },
            ]},
        ]
    },
]

const categories = ['All', 'Resume', 'Interview', 'Salary', 'LinkedIn', 'Skills', 'Freelance', 'GitHub', 'AI & Future', 'Remote Jobs']

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
        <div className='min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors'>
            <Navbar />

            {/* Hero Header */}
            <div className='relative overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'>
                <div
                    className='absolute inset-0 opacity-[0.03] dark:opacity-[0.06]'
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)', backgroundSize: '32px 32px' }}
                />
                <div className='relative max-w-5xl mx-auto px-4 md:px-6 py-14 text-center'>
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-green-100 dark:border-green-800'
                    >
                        <span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse' />
                        Updated for 2026
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className='text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight'
                    >
                        Career Tips
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className='text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto'
                    >
                        Practical, research-backed advice for tech professionals in Nepal and beyond.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className='flex justify-center gap-6 mt-5 text-sm text-gray-400 dark:text-gray-500'
                    >
                        <span>📚 {tips.length} guides</span>
                        <span>⏱ 4–6 min reads</span>
                        <span>🎯 Curated for developers</span>
                    </motion.div>
                </div>
            </div>

            <div className='max-w-5xl mx-auto px-4 md:px-6 py-8'>

                {/* Category filters */}
                <div className='flex gap-2 flex-wrap mb-8'>
                    {categories.map((cat) => (
                        <motion.button
                            key={cat}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                activeCategory === cat
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                            }`}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>

                {/* Tips Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {filtered.map((tip, i) => (
                        <motion.div
                            key={tip.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                            whileHover={{ y: -3, transition: { duration: 0.2 } }}
                            onClick={() => setSelected(tip)}
                            className='group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-gray-200/60 dark:hover:shadow-black/30 transition-all duration-200'
                        >
                            {/* Color accent bar */}
                            <div className='h-1' style={{ backgroundColor: tip.accent }} />

                            <div className='p-5'>
                                {/* Top row */}
                                <div className='flex items-start justify-between mb-3'>
                                    <span className='text-2xl'>{tip.emoji}</span>
                                    <span
                                        className='text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md'
                                        style={{ backgroundColor: tip.accentLight, color: tip.accent }}
                                    >
                                        {tip.tag}
                                    </span>
                                </div>

                                <p className='text-xs font-bold uppercase tracking-wider mb-1.5' style={{ color: tip.accent }}>
                                    {tip.category}
                                </p>

                                <h3 className='text-[15px] font-bold text-gray-900 dark:text-white mb-2 leading-snug'>
                                    {tip.title}
                                </h3>

                                <p className='text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4'>
                                    {tip.summary}
                                </p>

                                <div className='flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-800'>
                                    <span className='text-xs text-gray-400 dark:text-gray-500'>{tip.readTime}</span>
                                    <span className='text-xs font-semibold group-hover:translate-x-1 transition-transform inline-block' style={{ color: tip.accent }}>
                                        Read guide →
                                    </span>
                                </div>
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
                            className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            className='fixed inset-0 flex items-center justify-center z-50 px-4 py-6'
                            style={{ pointerEvents: 'none' }}
                        >
                            <div
                                ref={modalRef}
                                className='w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl overflow-y-auto max-h-[88vh] shadow-2xl'
                                style={{ pointerEvents: 'auto' }}
                            >
                                {/* Modal header accent bar */}
                                <div className='h-1.5 rounded-t-2xl' style={{ backgroundColor: selected.accent }} />

                                <div className='p-6'>
                                    {/* Modal top row */}
                                    <div className='flex items-start justify-between mb-5'>
                                        <div className='flex items-center gap-3'>
                                            <div
                                                className='w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0'
                                                style={{ backgroundColor: selected.accentLight }}
                                            >
                                                {selected.emoji}
                                            </div>
                                            <div>
                                                <p className='text-xs font-bold uppercase tracking-wider mb-0.5' style={{ color: selected.accent }}>
                                                    {selected.category}
                                                </p>
                                                <h2 className='text-lg font-bold text-gray-900 dark:text-white leading-tight'>
                                                    {selected.title}
                                                </h2>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelected(null)}
                                            className='ml-3 shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm'
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* Summary banner */}
                                    <div
                                        className='rounded-xl px-4 py-3 mb-5 text-sm font-medium'
                                        style={{ backgroundColor: selected.accentLight, color: selected.accent }}
                                    >
                                        {selected.summary}
                                    </div>

                                    {/* Content sections */}
                                    <div className='space-y-5'>
                                        {selected.content.map((section, si) => (
                                            <div key={si}>
                                                {section.heading && (
                                                    <div className='flex items-center gap-2 mb-2'>
                                                        <div className='w-1 h-4 rounded-full' style={{ backgroundColor: selected.accent }} />
                                                        <h3 className='text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest'>
                                                            {section.heading}
                                                        </h3>
                                                    </div>
                                                )}
                                                <div className='rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800'>
                                                    {section.items.map((item, ii) => (
                                                        <div
                                                            key={ii}
                                                            className='flex gap-3 px-4 py-3 border-b last:border-0 border-gray-50 dark:border-gray-800 text-sm leading-relaxed'
                                                        >
                                                            <span
                                                                className='shrink-0 mt-2 w-1.5 h-1.5 rounded-full'
                                                                style={{ backgroundColor: selected.accent }}
                                                            />
                                                            <span className='text-gray-600 dark:text-gray-300'>
                                                                <strong className='font-semibold text-gray-900 dark:text-white'>
                                                                    {item.bold}
                                                                </strong>
                                                                {item.text}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Modal footer */}
                                    <div className='mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between'>
                                        <span className='text-xs text-gray-400 dark:text-gray-500'>{selected.readTime}</span>
                                        <button
                                            onClick={() => setSelected(null)}
                                            className='text-sm font-semibold px-5 py-2 rounded-lg text-white transition-opacity hover:opacity-90'
                                            style={{ backgroundColor: selected.accent }}
                                        >
                                            Got it ✓
                                        </button>
                                    </div>
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