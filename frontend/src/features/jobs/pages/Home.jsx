import SEO from '../../../components/SEO.jsx'
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'
import { motion } from "framer-motion";
import Navbar from "../../../components/Navbar.jsx";
import Footer from '../../../components/Footer.jsx'
import useJobs from '../hooks/useJobs.js'
import {
  fadeUp, staggerFadeUp, scrollFadeUp,
  textReveal, cleanupAnimations,
} from "../../../utils/animations.js";

const previewJobs = [
  { title: 'Frontend Developer', company: 'TechCorp Nepal', location: 'Kathmandu', salary: 'Rs. 60–90k', type: 'Full-time', bg: 'bg-blue-500/10', text: 'text-blue-400', letter: 'F' },
  { title: 'UX Designer', company: 'Creative Studio', location: 'Remote', salary: 'Rs. 50–75k', type: 'Remote', bg: 'bg-purple-500/10', text: 'text-purple-400', letter: 'U' },
  { title: 'Bank Officer', company: 'NIC Asia Bank', location: 'Pokhara', salary: 'Rs. 45–65k', type: 'Full-time', bg: 'bg-amber-500/10', text: 'text-amber-400', letter: 'B' },
  { title: 'Program Officer', company: 'UNDP Nepal', location: 'Kathmandu', salary: 'Rs. 80–120k', type: 'Contract', bg: 'bg-emerald-500/10', text: 'text-emerald-400', letter: 'P' },
]

const categories = [
  { name: 'IT / Tech', count: '142', key: 'IT/Tech', iconBg: 'bg-green-500/10', countColor: 'text-green-400', border: 'hover:border-green-500/40',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className='stroke-green-400'><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { name: 'Finance', count: '89', key: 'Finance/Banking', iconBg: 'bg-blue-500/10', countColor: 'text-blue-400', border: 'hover:border-blue-500/40',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className='stroke-blue-400'><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> },
  { name: 'NGO/INGO', count: '67', key: 'NGO/INGO', iconBg: 'bg-amber-500/10', countColor: 'text-amber-400', border: 'hover:border-amber-500/40',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className='stroke-amber-400'><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
  { name: 'Marketing', count: '54', key: 'Marketing', iconBg: 'bg-purple-500/10', countColor: 'text-purple-400', border: 'hover:border-purple-500/40',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className='stroke-purple-400'><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
  { name: 'Healthcare', count: '41', key: 'Healthcare', iconBg: 'bg-pink-500/10', countColor: 'text-pink-400', border: 'hover:border-pink-500/40',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className='stroke-pink-400'><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
  { name: 'Education', count: '38', key: 'Education', iconBg: 'bg-red-500/10', countColor: 'text-red-400', border: 'hover:border-red-500/40',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className='stroke-red-400'><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
]

// Section badge component
const SectionBadge = ({ text }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className='inline-flex items-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/25 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-xs font-medium mb-4'
  >
    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }}
      className='w-1.5 h-1.5 bg-green-500 rounded-full' />
    {text}
  </motion.div>
)

const Home = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const categoriesRef = useRef(null);
  const ctaRef = useRef(null);
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const { latestJobs, loadLatestJobs, stats, loadStats, testimonials, loadTestimonials ,getRecommendedJobs} = useJobs()
  const { user } = useSelector(state => state.auth)
  const [recommendedJobs, setRecommendedJobs] = useState([])
  useEffect(() => {
    loadLatestJobs()
    loadStats()
    loadTestimonials()
    if (user && user.role === 'jobseeker') {
        getRecommendedJobs().then(data => setRecommendedJobs(data || []))
    }
  }, [user])

  useEffect(() => {
    textReveal(titleRef.current, 0.2);
    fadeUp(subtitleRef.current, 0.5);
    staggerFadeUp(".stat-item", 0.1);
    scrollFadeUp(".cat-item", categoriesRef.current);
    scrollFadeUp(ctaRef.current, ctaRef.current);
    return () => cleanupAnimations();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchKeyword) params.set('keyword', searchKeyword)
    if (searchLocation) params.set('location', searchLocation)
    navigate(`/jobs?${params.toString()}`)
  }
  const featuredJobs = latestJobs.filter(j => j.is_featured)
const displayJobs = featuredJobs.length >= 3 ? featuredJobs : latestJobs.slice(0, 6)

// Add this CSS for smooth infinite scroll
const scrollStyle = `
  @keyframes scrollUp {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }
  .auto-scroll {
    animation: scrollUp 15s linear infinite;
  }
  .auto-scroll:hover {
    animation-play-state: paused;
  }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`

  return (
    <div className='min-h-screen bg-white dark:bg-[#08111f] transition-colors duration-300 overflow-x-hidden w-full'>
      <SEO
    title="Jobs in Nawalparasi, Parasi, Butwal — Jobmate Nepal"
    description="Find verified jobs in Nawalparasi, Parasi, Butwal & Lumbini Pradesh. Factory jobs, NGO jobs, IT jobs — real salaries, verified employers. Nepal's #1 local job portal."
    keywords="nawalparasi jobs, parasi jobs, butwal jobs, lumbini pradesh jobs, factory jobs nawalparasi, ngo jobs lumbini, verified jobs nepal, rojgar nawalparasi 2026"
    url="/"
/>
      {/* ── HERO ─────────────────────────────────────────── */}
      <div className='relative overflow-hidden bg-white dark:bg-[#08111f] transition-colors duration-300'>

        {/* Grid pattern */}
        <div className='absolute inset-0 opacity-20 dark:opacity-100'
          style={{ backgroundImage: 'linear-gradient(rgba(22,163,74,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.06) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        />

        {/* Dark glows */}
        <div className='absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-0 dark:opacity-100 pointer-events-none'
          style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.15) 0%, transparent 65%)' }} />
        <div className='absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-0 dark:opacity-100 pointer-events-none'
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 65%)' }} />

        {/* Light blobs */}
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 8, repeat: Infinity }}
          className='absolute -top-20 -right-20 w-80 h-80 bg-green-100 rounded-full pointer-events-none dark:hidden' />
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className='absolute -bottom-10 -left-10 w-64 h-64 bg-green-200 rounded-full pointer-events-none dark:hidden' />

        <Navbar />

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-12 pb-0 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center'>

          {/* LEFT */}
          <div className='text-center lg:text-left'>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className='inline-flex items-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/25 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-xs font-medium mb-6'>
              <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} className='w-1.5 h-1.5 bg-green-500 rounded-full' />
              Nepal's First AI-Powered Job Platform
            </motion.div>

            <motion.h1 ref={titleRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className='font-extrabold leading-[1.0] mb-5 tracking-tight text-gray-900 dark:text-white'
              style={{ fontSize: 'clamp(42px, 6vw, 68px)' }}>
              Find Your<br />
              <span className='text-green-600 dark:text-green-400'>Dream Job</span><br />
              in Nepal
            </motion.h1>

            <motion.p ref={subtitleRef} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className='text-gray-500 dark:text-white/50 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto lg:mx-0'>
              100% verified companies. Salary always visible.<br className='hidden sm:block' />
              AI matches your CV to the perfect role — before you even apply.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className='mb-4'>
              <p className='text-xs text-gray-400 dark:text-white/30 uppercase tracking-widest mb-2'>
                Search {stats.totalJobs || '0'}+ verified jobs
              </p>
              {/* Desktop search */}
              <div className='hidden sm:flex items-stretch bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-1.5 focus-within:border-green-400 dark:focus-within:border-green-500/50 transition-colors'>
                <div className='flex items-center gap-2 flex-1 px-3'>
                  <svg className='w-4 h-4 text-gray-400 dark:text-white/25 shrink-0' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.35-4.35'/></svg>
                  <input value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder='Job title, skills or company...'
                    className='flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/25' />
                </div>
                <div className='w-px bg-gray-200 dark:bg-white/8 my-2' />
                <div className='flex items-center gap-2 px-3'>
                  <svg className='w-3.5 h-3.5 text-gray-400 dark:text-white/25 shrink-0' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'/><circle cx='12' cy='10' r='3'/></svg>
                  <select value={searchLocation} onChange={e => setSearchLocation(e.target.value)}
                    className='bg-transparent outline-none text-sm text-gray-500 dark:text-white/45 cursor-pointer min-w-[110px]'>
                    <option value=''>All Nepal</option>
                    <option>Kathmandu</option><option>Pokhara</option><option>Lalitpur</option><option>Chitwan</option><option>Remote</option>
                  </select>
                </div>
                <button onClick={handleSearch} className='bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors shrink-0'>
                  <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.35-4.35'/></svg>
                  Search Jobs
                </button>
              </div>
              {/* Mobile search */}
              <div className='sm:hidden space-y-2'>
                {/* Search input */}
<div className='flex items-center gap-2 bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 rounded-2xl px-4 py-5 shadow-md'>
    <svg className='w-6 h-6 text-gray-400 shrink-0' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.35-4.35'/></svg>
    <input value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
        placeholder='Job title, skills or company...'
        className='flex-1 bg-transparent outline-none text-2xl  text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 font-medium' />
</div>

<div className='flex gap-3'>
    <select value={searchLocation} onChange={e => setSearchLocation(e.target.value)}
        className='flex-1 bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 rounded-2xl px-4 py-5 text-base font-medium text-gray-600 dark:text-white/60 outline-none'>
        <option value=''>📍 All Nepal</option>
        <option>Kathmandu</option>
        <option>Pokhara</option>
        <option>Chitwan</option>
        <option>Nawalparasi</option>
        <option>Parasi</option>
        <option>Butwal</option>
        <option>Remote</option>
    </select>
    <button onClick={handleSearch}
        className='flex-1 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-2xl text-lg font-bold transition-colors py-5 flex items-center justify-center gap-2 shadow-md'>
        <svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><circle cx='11' cy='11' r='8'/><path d='m21 21-4.35-4.35'/></svg>
        Search
    </button>
</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className='flex items-center gap-2 flex-wrap justify-center lg:justify-start'>
              <span className='text-xs text-gray-400 dark:text-white/30'>Trending:</span>
              {['IT/Tech', 'Banking', 'NGO/INGO', 'Remote', 'Healthcare'].map((tag, i) => (
                <motion.span key={i} whileHover={{ scale: 1.05 }} onClick={() => navigate(`/jobs?keyword=${tag}`)}
                  className='bg-gray-100 dark:bg-white/4 border border-gray-200 dark:border-white/8 hover:border-green-400 dark:hover:border-green-500/40 hover:text-green-600 dark:hover:text-green-400 text-gray-500 dark:text-white/45 px-3 py-1 rounded-full text-xs cursor-pointer transition-all'>
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className='flex items-center gap-3 mt-5 justify-center lg:justify-start'>
              
              <p className='text-xs text-gray-500 dark:text-white/35'>
                <strong className='text-gray-700 dark:text-white/65'>{stats.totalJobSeekers || '0'}+</strong> job seekers joined
              </p>
            </motion.div>
          </div>

         
          {/* RIGHT — Real Job cards */}
{/* RIGHT — Smooth auto scrolling featured jobs */}
<div className='hidden lg:flex flex-col relative'>
  <style>{scrollStyle}</style>

  {/* Top fade */}
  <div className='absolute top-0 left-0 right-0 h-12 z-10 pointer-events-none bg-gradient-to-b from-white dark:from-[#08111f] to-transparent' />
  {/* Bottom fade */}
  <div className='absolute bottom-14 left-0 right-0 h-12 z-10 pointer-events-none bg-gradient-to-t from-white dark:from-[#08111f] to-transparent' />

  <div className='overflow-hidden no-scrollbar' style={{ height: '380px' }}>
    <div className='auto-scroll flex flex-col gap-2.5'>
      {[...displayJobs, ...displayJobs].map((job, i) => (
        <div key={`${job._id}-${i}`}
          className='bg-gray-50 dark:bg-white/3 border border-gray-200 dark:border-white/7 hover:border-green-400 dark:hover:border-green-500/30 rounded-2xl px-4 py-3 flex items-center gap-3 cursor-pointer transition-all duration-200 shrink-0'>
          
          {/* Logo */}
          <div className='w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-700 dark:text-green-400 font-black text-sm shrink-0 overflow-hidden border border-gray-100 dark:border-white/5'>
            {job.employer?.logo_url
              ? <img src={job.employer.logo_url} alt={job.employer.company_name} className='w-full h-full object-cover' />
              : job.employer?.company_name?.charAt(0) || 'C'}
          </div>

          {/* Info */}
          <div className='flex-1 min-w-0'>
            <div className='text-sm font-semibold text-gray-800 dark:text-white truncate'>{job.title}</div>
            <div className='text-xs text-gray-500 dark:text-white/35 truncate'>{job.employer?.company_name} · {job.location}</div>
            <div className='flex items-center gap-1 mt-0.5'>
              <div className='w-3 h-3 bg-green-600 rounded-full flex items-center justify-center text-white text-[7px]'>✓</div>
              <span className='text-xs text-green-600 dark:text-green-400'>Verified</span>
            </div>
          </div>

          {/* Salary */}
          <div className='text-right shrink-0'>
            <div className='text-xs font-semibold text-green-600 dark:text-green-400 mb-1'>
              Rs. {job.salary_min?.toLocaleString()}–{job.salary_max?.toLocaleString()}
            </div>
            <span className='text-[10px] px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 capitalize'>
              {job.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* AI chip */}
  <div className='flex items-center gap-2.5 bg-green-50 dark:bg-green-500/8 border border-green-200 dark:border-green-500/15 rounded-xl px-4 py-3 mt-3'>
    <div className='w-2 h-2 bg-green-500 rounded-full shrink-0 animate-pulse' />
    <span className='text-xs text-gray-500 dark:text-white/50'>
      <strong className='text-green-600 dark:text-green-400'>AI matched</strong> jobs to your profile — check CV Match
    </span>
  </div>
</div>
        </div>

        {/* Stats bar */}
        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-10 pb-0'>
          <div className='grid grid-cols-3 border border-gray-200 dark:border-white/6 rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/1'>
            {[
              { val: stats.totalJobs || '0', suffix: '+', label: 'Active Jobs' },
              { val: stats.totalCompanies || '0', suffix: '+', label: 'Verified Companies' },
              { val: stats.totalJobSeekers || '0', suffix: '+', label: 'Job Seekers' },
             
            ].map((s, i) => (
              <div key={i} className='stat-item py-5 px-4 text-center border-r border-b md:border-b-0 last:border-r-0 border-gray-200 dark:border-white/6 hover:bg-green-50 dark:hover:bg-green-500/5 transition-colors'>
                <div className='text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white mb-1'>
                  {s.val}<span className='text-green-600 dark:text-green-400'>{s.suffix}</span>
                </div>
                <div className='text-xs text-gray-400 dark:text-white/30 tracking-wide'>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className='h-12' />
      </div>

      {/* ── CATEGORIES ──────────────────────────────────── */}
      <div ref={categoriesRef} className='py-16 px-4 sm:px-6 bg-gray-50 dark:bg-[#0c1a2e]'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center mb-10'>
            <SectionBadge text='Explore Opportunities' />
            <h2 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3'>Browse by Category</h2>
            <p className='text-sm text-gray-500 dark:text-white/40 max-w-md mx-auto'>Top hiring categories in Nepal — find your perfect field</p>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
            {categories.map((cat, i) => (
              <motion.div key={i} className='cat-item'
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }} whileTap={{ scale: 0.96 }}>
                <Link to={`/jobs?category=${cat.key}`}
                  className={`bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 ${cat.border} rounded-2xl p-5 text-center block transition-all duration-200`}>
                  <div className={`w-12 h-12 ${cat.iconBg} rounded-xl flex items-center justify-center mx-auto mb-3`}>{cat.icon}</div>
                  <div className='text-sm font-semibold text-gray-800 dark:text-white'>{cat.name}</div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className='text-center mt-8'>
            <Link to='/jobs' className='inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors'>
              View all categories →
            </Link>
          </div>
        </div>
      </div>
        {/* ── RECOMMENDED JOBS ── */}
{user && user.role === 'jobseeker' && recommendedJobs.length > 0 && (
    <div className='py-16 px-4 sm:px-6 bg-white dark:bg-[#08111f]'>
        <div className='max-w-6xl mx-auto'>
            <div className='flex items-end justify-between gap-4 mb-8'>
                <div>
                    <SectionBadge text='Matched for You' />
                    <h2 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-white'>
                        Recommended Jobs ✨
                    </h2>
                    <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>
                        Based on your location, skills and preferences
                    </p>
                </div>
                <Link to='/jobs' className='text-sm text-green-600 dark:text-green-400 font-medium shrink-0'>
                    View all →
                </Link>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {recommendedJobs.slice(0, 6).map((job, i) => (
                    <motion.div key={job._id}
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                        whileHover={{ y: -4 }}
                        className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 hover:border-green-400 dark:hover:border-green-500/40 rounded-2xl p-5 transition-all group'>
                        <div className='flex items-start gap-3 mb-4'>
                            <div className='w-11 h-11 rounded-xl shrink-0 overflow-hidden bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-base border border-gray-100 dark:border-white/5'>
                                {job.employer?.logo_url
                                    ? <img src={job.employer.logo_url} alt={job.employer.company_name} className='w-full h-full object-cover' />
                                    : job.employer?.company_name?.charAt(0) || 'C'}
                            </div>
                            <div className='flex-1 min-w-0'>
                                <h3 className='text-sm font-semibold text-gray-800 dark:text-white truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors'>
                                    {job.title}
                                </h3>
                                <p className='text-xs text-gray-500 dark:text-white/35 truncate'>{job.employer?.company_name} · {job.location}</p>
                            </div>
                        </div>
                        <div className='flex gap-2 flex-wrap mb-4'>
                            <span className='text-xs bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 px-2.5 py-1 rounded-full font-medium'>
                                ✓ Verified
                            </span>
                            <span className='text-xs bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-white/60 border border-gray-200 dark:border-white/8 px-2.5 py-1 rounded-full'>
                                Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                            </span>
                        </div>
                        <div className='flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5'>
                            <span className='text-xs text-gray-400 dark:text-white/30 capitalize'>{job.type}</span>
                            <Link to={`/jobs/${job._id}`} className='text-xs bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg transition-colors font-medium'>
                                Apply →
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </div>
)}    
      {/* ── LATEST JOBS ─────────────────────────────────── */}
      <div className='py-16 px-4 sm:px-6 bg-white dark:bg-[#08111f]'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10'>
            <div>
              <SectionBadge text='Fresh Opportunities' />
              <h2 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-white'>Latest Jobs</h2>
              <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>Verified jobs posted today — apply before deadline</p>
            </div>
            <Link to='/jobs' className='text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors shrink-0'>
              View all jobs →
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {latestJobs.slice(0, 6).map((job, i) => (
              <motion.div key={job._id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 hover:border-green-400 dark:hover:border-green-500/40 rounded-2xl p-5 transition-all duration-200 group'>
                <div className='flex items-start gap-3 mb-4'>
                  <div className='w-11 h-11 rounded-xl shrink-0 overflow-hidden bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-base border border-gray-100 dark:border-white/5'>
                    {job.employer?.logo_url
                      ? <img src={job.employer.logo_url} alt={job.employer.company_name} className='w-full h-full object-cover' />
                      : job.employer?.company_name?.charAt(0) || 'C'}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white truncate mb-0.5 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors'>
                      {job.title}
                    </h3>
                    <p className='text-xs text-gray-500 dark:text-white/35 truncate'>{job.employer?.company_name} · {job.location}</p>
                  </div>
                </div>
                <div className='flex gap-2 flex-wrap mb-4'>
                  <span className='inline-flex items-center gap-1 text-xs bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 px-2.5 py-1 rounded-full font-medium'>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Verified
                  </span>
                  <span className='text-xs bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-white/60 border border-gray-200 dark:border-white/8 px-2.5 py-1 rounded-full'>
                    Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                  </span>
                  <span className='text-xs bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/40 border border-gray-200 dark:border-white/8 px-2.5 py-1 rounded-full capitalize'>{job.type}</span>
                </div>
                <div className='flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5'>
                  <div className='flex items-center gap-1.5'>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='text-red-400'>
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span className='text-xs text-gray-400 dark:text-white/30'>{new Date(job.deadline).toLocaleDateString()}</span>
                  </div>
                  <Link to={`/jobs/${job._id}`} className='text-xs bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg transition-colors font-medium'>Apply →</Link>
                </div>
              </motion.div>
            ))}
          </div>

          {latestJobs.length === 0 && (
            <div className='text-center py-16'>
              <div className='w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className='text-gray-400 dark:text-white/20'>
                  <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                </svg>
              </div>
              <p className='text-gray-400 dark:text-white/30 text-sm'>Loading jobs...</p>
            </div>
          )}
        </div>
      </div>

      {/* ── TESTIMONIALS ────────────────────────────────── */}
      {testimonials.length > 0 && (
        <div className='py-16 px-4 sm:px-6 bg-gray-50 dark:bg-[#0c1a2e]'>
          <div className='max-w-5xl mx-auto'>
            <div className='text-center mb-10'>
              <SectionBadge text='Success Stories' />
              <h2 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2'>What People Say</h2>
              <p className='text-sm text-gray-500 dark:text-white/40'>Job seekers and employers love Jobmate</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {testimonials.map((t, i) => (
                <motion.div key={t._id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6'>
                  <div className='flex gap-1 mb-4'>{[...Array(t.rating)].map((_, j) => <span key={j} className='text-yellow-400 text-sm'>★</span>)}</div>
                  <p className='text-sm text-gray-600 dark:text-white/60 leading-relaxed mb-4'>"{t.text}"</p>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/15 flex items-center justify-center text-green-700 dark:text-green-400 font-bold'>{t.name.charAt(0)}</div>
                    <div>
                      <p className='text-sm font-semibold text-gray-800 dark:text-white'>{t.name}</p>
                      <p className='text-xs text-gray-500 dark:text-white/35'>{t.role} · {t.company}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ─────────────────────────────────────────── */}
      <div ref={ctaRef} className='relative overflow-hidden py-20 px-6 bg-green-900 dark:bg-[#0a1628]'>
        <div className='absolute inset-0 opacity-10' style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className='absolute top-0 right-0 w-64 h-64 rounded-full opacity-20' style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 65%)' }} />
        <div className='relative z-10 text-center max-w-xl mx-auto'>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className='inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 px-4 py-1.5 rounded-full text-xs font-medium mb-6'>
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} className='w-1.5 h-1.5 bg-green-400 rounded-full' />
            Join 2,400+ Job Seekers
          </motion.div>
          <h2 className='text-3xl font-bold text-white mb-3'>Ready to find your next job?</h2>
          <p className='text-green-200/70 mb-8 text-sm'>Verified jobs. Transparent salaries. AI-powered matching.</p>
          <div className='flex gap-3 justify-center flex-wrap'>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to='/jobs' className='bg-white text-green-800 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-green-50 block transition-colors'>Browse Jobs →</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to='/register' className='border border-white/30 text-white px-6 py-3 rounded-xl text-sm hover:bg-white/10 block transition-colors'>Create Account</Link>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;