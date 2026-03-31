import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../../components/Navbar.jsx";
import Footer from '../../../components/Footer.jsx'
import useJobs from '../hooks/useJobs.js'
import {
  fadeUp,
  staggerFadeUp,
  scrollFadeUp,
  scaleIn,
  textReveal,
  cleanupAnimations,
} from "../../../utils/animations.js";

const Home = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const searchRef = useRef(null);
  const statsRef = useRef(null);
  const categoriesRef = useRef(null);
  const ctaRef = useRef(null);
  const { latestJobs, loadLatestJobs,stats, loadStats  } = useJobs()
  

  useEffect(() => {
    loadLatestJobs()
    loadStats()
}, [])




  useEffect(() => {
    // Hero animations — GSAP
    textReveal(titleRef.current, 0.2);
    fadeUp(subtitleRef.current, 0.5);
    scaleIn(searchRef.current, 0.7);

    // Scroll triggered animations
    staggerFadeUp(".stat-item", 0.1);
    scrollFadeUp(".cat-item", categoriesRef.current);
    scrollFadeUp(ctaRef.current, ctaRef.current);

    return () => cleanupAnimations();
  }, []);

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden w-full'>
      <Navbar />

      {/* Hero */}
      <div className='bg-green-50 dark:bg-gray-800 py-20 px-6 text-center relative overflow-hidden w-full'>
        {/* Background blobs — Framer Motion */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-20 -right-20 w-80 h-80 bg-green-100 dark:bg-green-900 rounded-full pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-10 -left-10 w-60 h-60 bg-green-200 dark:bg-green-800 rounded-full pointer-events-none"
        />

        <div className="relative z-10">
          {/* Badge — Framer Motion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-700 border border-green-200 dark:border-gray-600 rounded-full px-4 py-2 text-sm text-green-700 dark:text-green-400 mb-6"
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
           The most trusted and verified career marketplace in Nepal.
          </motion.div>

          {/* Title — GSAP textReveal */}
          <h1
            ref={titleRef}
            className="text-5xl font-semibold text-green-900 dark:text-white mb-4 leading-tight"
          >
            Find your dream
            <br />
            <span className="text-green-600">job in Nepal</span>
          </h1>

          {/* Subtitle — GSAP fadeUp */}
          <p
            ref={subtitleRef}
            className="text-green-700 dark:text-gray-400 mb-8 max-w-lg mx-auto"
          >
            Verified jobs — Salary always visible — Mobile friendly
          </p>

          {/* Search — GSAP scaleIn */}
         <div
    ref={searchRef}
    className='bg-white dark:bg-gray-700 rounded-xl max-w-2xl mx-auto border border-gray-200 dark:border-gray-600'
>
    {/* Desktop Layout */}
    <div className='hidden md:flex gap-3 p-4 items-center'>
        <input
            type='text'
            placeholder='Job title, skills, company...'
            className='flex-1 outline-none text-sm bg-transparent dark:text-white dark:placeholder-gray-400'
        />
        <div className='w-px h-5 bg-gray-200 dark:bg-gray-600'></div>
        <select className='text-sm text-gray-500 dark:text-gray-300 outline-none bg-transparent cursor-pointer'>
            <option>All locations</option>
            <option>Kathmandu</option>
            <option>Pokhara</option>
            <option>Chitwan</option>
        </select>
        <div className='w-px h-5 bg-gray-200 dark:bg-gray-600'></div>
        <select className='text-sm text-gray-500 dark:text-gray-300 outline-none bg-transparent'>
            <option>All categories</option>
            <option>IT/Tech</option>
            <option>Finance</option>
            <option>NGO/INGO</option>
        </select>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
                to='/jobs'
                className='bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-700 block'
            >
                Search
            </Link>
        </motion.div>
    </div>

    {/* Mobile Layout */}
    <div className='md:hidden p-3 space-y-2'>
        <input
            type='text'
            placeholder='Job title, skills, company...'
            className='w-full outline-none text-sm bg-gray-50 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-500'
        />
        <div className='flex gap-2'>
            <select className='flex-1 text-sm text-gray-500 dark:text-gray-300 outline-none bg-gray-50 dark:bg-gray-600 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-500'>
                <option>All locations</option>
                <option>Kathmandu</option>
                <option>Pokhara</option>
                <option>Chitwan</option>
            </select>
            <select className='flex-1 text-sm text-gray-500 dark:text-gray-300 outline-none bg-gray-50 dark:bg-gray-600 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-500'>
                <option>All categories</option>
                <option>IT/Tech</option>
                <option>Finance</option>
                <option>NGO/INGO</option>
            </select>
        </div>
        <Link
            to='/jobs'
            className='bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 block text-center w-full'
        >
            Search
        </Link>
    </div>
</div>

          {/* Popular tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex gap-2 justify-center flex-wrap mt-5"
          >
            <span className="text-sm text-green-700 dark:text-gray-400">
              Popular:
            </span>
            {[
              "React Developer",
              "Accountant",
              "NGO Jobs",
              "Fresh Graduate",
              "Remote",
            ].map((tag, i) => (
              <motion.span
                key={i}
                whileHover={{ scale: 1.08, y: -2 }}
                className="bg-white dark:bg-gray-700 border border-green-200 dark:border-gray-600 rounded-full px-3 py-1 text-xs text-green-700 dark:text-green-400 cursor-pointer"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats — GSAP staggerFadeUp */}
      <div
        ref={statsRef}
        className='grid grid-cols-2 md:flex md:justify-center border-y border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      >
       {[
    { num: `${stats.totalJobs}+`, label: 'Verified jobs', color: 'text-green-600' },
    { num: `${stats.totalCompanies}+`, label: 'Companies', color: 'text-green-600' },
    { num: `${stats.totalJobSeekers}+`, label: 'Job seekers', color: 'text-green-600' },
    { num: stats.fakeJobs, label: 'Fake jobs', color: 'text-red-500' },
].map((stat, i) => (
    <div key={i} className='stat-item px-6 py-5 text-center border-r border-b md:border-b-0 last:border-r-0 border-gray-200 dark:border-gray-700'>
        <div className={`text-2xl font-semibold ${stat.color}`}>
            {stat.num}
        </div>
        <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
            {stat.label}
        </div>
    </div>
))}
      </div>

      {/* Categories — GSAP scrollFadeUp */}
      <div ref={categoriesRef} className="py-12 px-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          Browse by category
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Top hiring categories in Nepal — choose your field
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            {
              name: "IT / Tech",
              count: "142",
              color: "bg-green-50 dark:bg-green-900",
            },
            {
              name: "Finance",
              count: "89",
              color: "bg-blue-50 dark:bg-blue-900",
            },
            {
              name: "NGO/INGO",
              count: "67",
              color: "bg-amber-50 dark:bg-amber-900",
            },
            {
              name: "Marketing",
              count: "54",
              color: "bg-purple-50 dark:bg-purple-900",
            },
            {
              name: "Healthcare",
              count: "41",
              color: "bg-pink-50 dark:bg-pink-900",
            },
            {
              name: "Education",
              count: "38",
              color: "bg-red-50 dark:bg-red-900",
            },
          ].map((cat, i) => (
            <motion.div
              key={i}
              className="cat-item"
              whileHover={{ scale: 1.06, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/jobs"
                className={`${cat.color} border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:border-green-500 transition-colors cursor-pointer block`}
              >
                <div className="text-sm font-medium text-gray-800 dark:text-white mb-1">
                  {cat.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {cat.count} jobs
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
          {/* Latest Jobs Section */}
<div className='py-12 px-4 md:px-6 bg-gray-50 dark:bg-gray-900'>
    <div className='max-w-6xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
            <div>
                <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>
                    Latest Jobs
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                    Fresh verified opportunities
                </p>
            </div>
            <Link
                to='/jobs'
                className='text-sm text-green-600 hover:text-green-700 font-medium'
            >
                View all →
            </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {latestJobs.slice(0, 6).map((job, i) => (
                <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}
                    className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-green-400 transition-colors'
                >
                    <div className='flex items-start gap-3 mb-3'>
                        <div className='w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-semibold text-sm shrink-0'>
                                            {job.employer?.logo_url ? (
            <img src={job.employer.logo_url} alt={job.employer.company_name} className='w-full h-full object-cover' />
        ) : (
            job.employer?.company_name?.charAt(0) || 'C'
        )}
                                        </div>
                        <div className='flex-1 min-w-0'>
                            <h3 className='text-sm font-semibold text-gray-800 dark:text-white truncate'>
                                {job.title}
                            </h3>
                            <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                                {job.employer?.company_name} · {job.location}
                            </p>
                        </div>
                    </div>

                    <div className='flex gap-2 flex-wrap mb-3'>
                        <span className='text-xs bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium'>
                            ✓ Verified
                        </span>
                        <span className='text-xs bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full'>
                            Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                        </span>
                        <span className='text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full'>
                            {job.type}
                        </span>
                    </div>

                    <div className='flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700'>
                        <span className='text-xs text-gray-400'>
                            {job.application_count} applied
                        </span>
                        <Link
                            to={`/jobs/${job._id}`}
                            className='text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors'
                        >
                            Apply →
                        </Link>
                    </div>
                </motion.div>
            ))}
        </div>

        {latestJobs.length === 0 && (
            <div className='text-center py-10 text-gray-400 text-sm'>
                Loading jobs...
            </div>
        )}
    </div>
</div>
      {/* CTA — GSAP scrollFadeUp */}
      <div
        ref={ctaRef}
        className="text-center py-16 px-6 bg-green-900 dark:bg-gray-800"
      >
        <h2 className="text-2xl font-semibold text-white mb-3">
          Ready to find your next job?
        </h2>
        <p className="text-green-200 dark:text-gray-400 mb-6">
          Join thousands of job seekers finding verified jobs every day
        </p>
        <div className="flex gap-3 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/jobs"
              className="bg-white text-green-800 px-6 py-3 rounded-lg text-sm font-medium hover:bg-green-50 block"
            >
              Browse jobs
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/register"
              className="border border-white text-white px-6 py-3 rounded-lg text-sm hover:bg-green-800 dark:hover:bg-gray-700 block"
            >
              Create account
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
