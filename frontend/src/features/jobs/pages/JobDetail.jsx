import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fetchJob, fetchJobs } from "../services/job.api.js";
import useJobseeker from "../../../features/jobseeker/hooks/useJobseeker.js";
import Navbar from "../../../components/Navbar.jsx";
import Footer from "../../../components/Footer.jsx";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");
  const { toggleSaveJob, applyJob, reportJob, matchCV } = useJobseeker();
  const [saved, setSaved] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("fake_job");
  const [reportDesc, setReportDesc] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reported, setReported] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [matching, setMatching] = useState(false);

  useEffect(() => { loadJob() }, [id]);

  const loadJob = async () => {
    try {
      const data = await fetchJob(id);
      setJob(data.job);
      // Load similar jobs same category
      const similar = await fetchJobs({ category: data.job?.category })
      setSimilarJobs(similar.filter(j => j._id !== id).slice(0, 4))
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try { await toggleSaveJob(id); setSaved(!saved); }
    catch (err) { console.log(err); }
  };

  const handleApply = async () => {
    if (!user) { navigate("/login"); return; }
    if (job.cv_required && !user.cv_url) {
      setError("This job requires a CV. Please upload your CV from your Profile first.");
      return;
    }
    setApplying(true);
    try { await applyJob(id, ""); setApplied(true); }
    catch (err) { setError(err.response?.data?.message || "Failed to apply"); }
    finally { setApplying(false); }
  };

  const handleMatch = async () => {
    if (!user) { navigate("/login"); return; }
    setMatching(true);
    try {
      const result = await matchCV(id);
      setMatchResult(result);
    } catch (err) {
      setMatchResult({ match_score: 0, matched_skills: [], missing_skills: [], verdict: "Could not analyze — please try again.", should_apply: true });
    } finally { setMatching(false); }
  };

  const handleReport = async () => {
    setReporting(true);
    try {
      await reportJob(job._id, reportReason, reportDesc);
      setReported(true); setShowReport(false);
    } catch (err) {
      if (err.response?.data?.message === "Already reported this job") {
        setReported(true); setShowReport(false);
      }
    } finally { setReporting(false); }
  };

  const daysLeft = job ? Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : 0

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#08111f] flex items-center justify-center transition-colors">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-white dark:bg-[#08111f] flex items-center justify-center transition-colors">
      <div className="text-center">
        <p className="text-gray-500 dark:text-white/40 mb-4">Job not found</p>
        <Link to="/jobs" className="text-sm text-green-600 dark:text-green-400 hover:underline">Browse all jobs →</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#08111f] transition-colors duration-300">
      <div className="fixed inset-0 opacity-0 dark:opacity-100 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(22,163,74,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.03) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10">

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-white/35 hover:text-green-600 dark:hover:text-green-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Back to jobs
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT — Main Content ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Job Header Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl overflow-hidden">

              {job.is_featured && (
                <div className="bg-green-600 px-6 py-2 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span className="text-xs text-white font-semibold">Featured Job</span>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-500/10 border border-gray-100 dark:border-white/5 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-2xl shrink-0 overflow-hidden">
                    {job.employer?.logo_url
                      ? <img src={job.employer.logo_url} alt={job.employer.company_name} className="w-full h-full object-cover" />
                      : job.employer?.company_name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white mb-1 leading-tight">{job.title}</h1>
                    <Link to={`/companies/${job.employer?._id}`}
                      className="text-sm text-gray-500 dark:text-white/40 hover:text-green-600 dark:hover:text-green-400 transition-colors flex items-center gap-1 flex-wrap">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                      {job.employer?.company_name}
                      <span className="text-gray-300 dark:text-white/20">·</span>
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {job.location}
                    </Link>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-white/25">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/></svg>
                        {job.application_count || 0} applicants
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-xs bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 px-3 py-1.5 rounded-full font-medium">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    Verified
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white/60 border border-gray-200 dark:border-white/8 px-3 py-1.5 rounded-full font-semibold">
                    Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                  </span>
                  <span className="text-xs bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/40 border border-gray-200 dark:border-white/8 px-3 py-1.5 rounded-full capitalize">{job.type}</span>
                  <span className="text-xs bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/40 border border-gray-200 dark:border-white/8 px-3 py-1.5 rounded-full">{job.category}</span>
                  {daysLeft > 0 && daysLeft <= 7 && (
                    <span className="text-xs bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 px-3 py-1.5 rounded-full font-medium">
                      {daysLeft} days left
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* CV Match */}
            {user?.role === "jobseeker" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                {!matchResult ? (
                  <button onClick={handleMatch} disabled={matching}
                    className="w-full flex items-center justify-center gap-2 bg-white dark:bg-white/3 border-2 border-dashed border-green-300 dark:border-green-500/30 text-green-600 dark:text-green-400 py-3.5 rounded-2xl text-sm font-medium hover:bg-green-50 dark:hover:bg-green-500/5 transition-colors">
                    {matching ? (
                      <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full inline-block" />Analyzing your CV...</>
                    ) : (
                      <><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>Check AI CV Match</>
                    )}
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-white">AI CV Match Score</h3>
                      <span className={`text-2xl font-extrabold ${matchResult.match_score >= 60 ? "text-green-500" : "text-amber-500"}`}>
                        {matchResult.match_score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-white/5 rounded-full h-2 mb-4">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${matchResult.match_score}%` }} transition={{ duration: 1 }}
                        className={`h-2 rounded-full ${matchResult.match_score >= 60 ? "bg-green-500" : "bg-amber-400"}`} />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-white/50 mb-4">{matchResult.verdict}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {matchResult.matched_skills?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">✓ Matched Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {matchResult.matched_skills.map((s, i) => (
                              <span key={i} className="text-xs bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 px-2 py-0.5 rounded-full">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {matchResult.missing_skills?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-red-500 mb-2">✗ Missing Skills</p>
                          <div className="flex flex-wrap gap-1">
                            {matchResult.missing_skills.map((s, i) => (
                              <span key={i} className="text-xs bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 px-2 py-0.5 rounded-full">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Job Details Table */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-gray-100 dark:border-white/5">
                <h2 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <div className="w-1 h-5 bg-green-500 rounded-full" />
                  Job Details
                </h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-white/5">
                {[
                  { label: "Job Category", value: job.category, icon: "◈" },
                  { label: "Job Location", value: job.location, icon: "📍" },
                  { label: "Job Type", value: job.type, icon: "💼" },
                  { label: "Experience", value: job.experience, icon: "⭐" },
                  { label: "Salary", value: `Rs. ${job.salary_min?.toLocaleString()} – ${job.salary_max?.toLocaleString()}`, icon: "💰" },
                  { label: "Deadline", value: new Date(job.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), icon: "📅" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center px-5 py-3">
                    <span className="text-xs text-gray-400 dark:text-white/25 w-36 shrink-0">{item.label}</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-white capitalize">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Job Description */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6">
              <h2 className="text-base font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-green-500 rounded-full" />
                Job Description
              </h2>
              <p className="text-sm text-gray-600 dark:text-white/50 leading-relaxed whitespace-pre-line">{job.description}</p>
            </motion.div>

            {/* About Company */}
            {job.employer && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-6">
                <h2 className="text-base font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-green-500 rounded-full" />
                  About the Company
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-500/10 border border-gray-100 dark:border-white/5 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-xl shrink-0 overflow-hidden">
                    {job.employer.logo_url
                      ? <img src={job.employer.logo_url} alt={job.employer.company_name} className="w-full h-full object-cover" />
                      : job.employer.company_name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{job.employer.company_name}</p>
                      {job.employer.is_verified && (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 px-2 py-0.5 rounded-full font-medium">
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-white/35 mt-0.5">{job.employer.location}</p>
                    {job.employer.website && (
                      <a href={job.employer.website} target="_blank" rel="noreferrer"
                        className="text-xs text-green-600 dark:text-green-400 hover:underline mt-1 inline-block">
                        Visit website ↗
                      </a>
                    )}
                  </div>
                  <Link to={`/companies/${job.employer._id}`}
                    className="text-xs border border-gray-200 dark:border-white/8 text-gray-600 dark:text-white/40 px-3 py-2 rounded-xl hover:border-green-400 dark:hover:border-green-500/40 hover:text-green-600 dark:hover:text-green-400 transition-colors shrink-0">
                    View Profile
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Report */}
            {user?.role === "jobseeker" && (
              <div className="pb-4">
                {reported ? (
                  <p className="text-xs text-green-600 dark:text-green-400 text-center">✓ Job reported — we will review it</p>
                ) : (
                  <button onClick={() => setShowReport(!showReport)}
                    className="text-xs text-gray-400 dark:text-white/20 hover:text-red-500 transition-colors w-full text-center">
                    🚩 Report this job
                  </button>
                )}
                <AnimatePresence>
                  {showReport && !reported && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      className="mt-3 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-4">
                      <p className="text-xs font-semibold text-gray-700 dark:text-white/60 mb-3">Why are you reporting?</p>
                      <select value={reportReason} onChange={e => setReportReason(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-3 py-2 text-xs outline-none dark:text-white mb-2">
                        <option value="fake_job">Fake Job</option>
                        <option value="misleading">Misleading Information</option>
                        <option value="spam">Spam</option>
                        <option value="inappropriate">Inappropriate Content</option>
                        <option value="other">Other</option>
                      </select>
                      <textarea value={reportDesc} onChange={e => setReportDesc(e.target.value)}
                        placeholder="Additional details..." rows={2}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-3 py-2 text-xs outline-none dark:text-white mb-3 resize-none" />
                      <div className="flex gap-2">
                        <button onClick={handleReport} disabled={reporting}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50">
                          {reporting ? "Submitting..." : "Submit Report"}
                        </button>
                        <button onClick={() => setShowReport(false)}
                          className="text-xs border border-gray-200 dark:border-white/8 text-gray-500 dark:text-white/35 px-4 py-2.5 rounded-xl transition-colors">
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* ── RIGHT — Sticky Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">

              {/* Quick Apply Card */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-5">

                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 border border-gray-100 dark:border-white/5 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-lg overflow-hidden shrink-0">
                    {job.employer?.logo_url
                      ? <img src={job.employer.logo_url} alt={job.employer.company_name} className="w-full h-full object-cover" />
                      : job.employer?.company_name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{job.title}</p>
                    <p className="text-xs text-gray-500 dark:text-white/35 truncate">{job.employer?.company_name}</p>
                    <p className="text-xs text-gray-400 dark:text-white/25">{job.location}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2.5 mb-5">
                  {[
                    { label: "Salary", value: `Rs. ${job.salary_min?.toLocaleString()} – ${job.salary_max?.toLocaleString()}`, icon: <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
                    { label: "Type", value: job.type, icon: <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
                    { label: "Deadline", value: new Date(job.deadline).toLocaleDateString(), icon: <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-white/30">
                        {item.icon} {item.label}
                      </span>
                      <span className="text-xs font-semibold text-gray-800 dark:text-white capitalize">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Deadline warning */}
                {daysLeft > 0 && daysLeft <= 7 && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-2.5 mb-4 text-center">
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">⏰ Only {daysLeft} days left!</p>
                  </div>
                )}

                {/* Apply button */}
                {user?.role !== "employer" && (
                  <div className="space-y-2">
                    <button onClick={handleApply} disabled={applying || applied}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                        applied
                          ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      } disabled:opacity-60`}>
                      {applied ? (
                        <><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>Applied!</>
                      ) : applying ? (
                        <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />Applying...</>
                      ) : "Quick Apply →"}
                    </button>
                    <button onClick={handleSave}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm border transition-all ${
                        saved
                          ? "border-green-400 dark:border-green-500/50 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10"
                          : "border-gray-200 dark:border-white/8 text-gray-600 dark:text-white/40 hover:border-green-400"
                      }`}>
                      <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                      {saved ? "Saved" : "Save Job"}
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Similar Jobs</h3>
                    <Link to={`/jobs?category=${job.category}`} className="text-xs text-green-600 dark:text-green-400 hover:underline">View all →</Link>
                  </div>
                  <div className="divide-y divide-gray-50 dark:divide-white/3">
                    {similarJobs.map((sj, i) => (
                      <Link key={sj._id} to={`/jobs/${sj._id}`}
                        className="flex items-center gap-3 p-3.5 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors group">
                        <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-sm shrink-0 overflow-hidden border border-gray-100 dark:border-white/5">
                          {sj.employer?.logo_url
                            ? <img src={sj.employer.logo_url} alt={sj.employer.company_name} className="w-full h-full object-cover" />
                            : sj.employer?.company_name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 dark:text-white truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{sj.title}</p>
                          <p className="text-xs text-gray-400 dark:text-white/25 truncate">{sj.employer?.company_name}</p>
                          <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-0.5">Rs. {sj.salary_min?.toLocaleString()}–{sj.salary_max?.toLocaleString()}</p>
                        </div>
                        <svg className="w-3.5 h-3.5 text-gray-300 dark:text-white/15 group-hover:text-green-500 transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetail;