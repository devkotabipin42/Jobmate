import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchJob } from "../services/job.api.js";
import useJobseeker from "../../../features/jobseeker/hooks/useJobseeker.js";
import Navbar from "../../../components/Navbar.jsx";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");
  const { toggleSaveJob,applyJob,  reportJob, matchCV } = useJobseeker();
  const [saved, setSaved] = useState(false);
  const [showReport, setShowReport] = useState(false)
const [reportReason, setReportReason] = useState('fake_job')
const [reportDesc, setReportDesc] = useState('')
const [reporting, setReporting] = useState(false)
const [reported, setReported] = useState(false)
const [matchResult, setMatchResult] = useState(null)
const [matching, setMatching] = useState(false)

const handleReport = async () => {
    setReporting(true)
    try {
        await reportJob(job._id, reportReason, reportDesc)
        setReported(true)
        setShowReport(false)
    } catch (err) {
        if (err.response?.data?.message === 'Already reported this job') {
            setReported(true)
            setShowReport(false)
        } else {
            console.log(err)
        }
    } finally {
        setReporting(false)
    }
}

  

  const loadJob = async () => {
    try {
      const data = await fetchJob(id);
      setJob(data.job);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadJob()
}, [id])
  const handleSave = async () => {
    try {
      await toggleSaveJob(id);
      setSaved(!saved);
    } catch (err) {
      console.log(err);
    }
  };
const handleApply = async () => {
  if (!user) {
    navigate("/login");
    return;
  }
  if (job.cv_required && !user.cv_url) {
        setError('This job requires a CV. Please upload your CV from your Profile first.')
        return
    }
  setApplying(true);
  try {
    await applyJob(id, "");
    setApplied(true);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to apply");
  } finally {
    setApplying(false);
  }
};

const handleMatch = async () => {
    if (!user) { navigate('/login'); return }
    setMatching(true)
    try {
        const result = await matchCV(id)
        setMatchResult(result)
    } catch (err) {
        setMatchResult({
            match_score: 0,
            matched_skills: [],
            missing_skills: [],
            verdict: 'Could not analyze — please try again.',
            should_apply: true
        })
    } finally {
        setMatching(false)
    }
}
if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );

  if (!job)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500">Job not found</p>
      </div>
    );

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors overflow-x-hidden'>
      <Navbar />

      <div className='max-w-4xl mx-auto px-4 md:px-6 py-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 md:p-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className='w-14 h-14 rounded-xl bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-xl shrink-0 overflow-hidden'>
    {job.employer?.logo_url ? (
        <img src={job.employer.logo_url} alt={job.employer.company_name} className='w-full h-full object-cover' />
    ) : (
        job.employer?.company_name?.charAt(0)
    )}
</div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white mb-1">
                  {job.title}
                </h1>
                <Link
    to={`/companies/${job.employer?._id}`}
    className='text-gray-500 dark:text-gray-400 hover:text-green-600 transition-colors'
>
    {job.employer?.company_name} · {job.location}
</Link>
              </div>
            </div>

            {/* Buttons — mobile full width */}
            {user?.role !== "employer" && (
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className={`flex-1 md:flex-none px-4 py-3 rounded-xl text-sm border transition-colors ${
                    saved
                      ? "border-green-500 text-green-600 bg-green-50 dark:bg-green-900"
                      : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-green-400"
                  }`}
                >
                  {saved ? "🔖 Saved" : "🔖 Save"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  disabled={applying || applied}
                  className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-medium transition-colors ${
                    applied
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-green-600 text-white hover:bg-green-700"
                  } disabled:opacity-60`}
                >
                  {applied
                    ? "✓ Applied!"
                    : applying
                      ? "Applying..."
                      : "Apply Now"}
                </motion.button>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {/* CV Match Result */}
{user?.role === 'jobseeker' && (
    <div className='mb-4'>
        {!matchResult ? (
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleMatch}
                disabled={matching}
                className='w-full border-2 border-dashed border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 py-3 rounded-xl text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900 transition-colors'
            >
                {matching ? (
                    <span className='flex items-center justify-center gap-2'>
                        <span className='w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin' />
                        Analyzing your CV...
                    </span>
                ) : '🎯 Check CV Match'}
            </motion.button>
        ) : (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='border border-gray-200 dark:border-gray-700 rounded-xl p-4'
            >
                {/* Score */}
                <div className='flex items-center justify-between mb-3'>
                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white'>CV Match Score</h3>
                    <span className={`text-lg font-bold ${
                        matchResult.match_score >= 60 ? 'text-green-600' : 'text-amber-500'
                    }`}>
                        {matchResult.match_score}%
                    </span>
                </div>

                {/* Progress bar */}
                <div className='w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 mb-3'>
                    <div
                        className={`h-2 rounded-full transition-all ${
                            matchResult.match_score >= 60 ? 'bg-green-500' : 'bg-amber-400'
                        }`}
                        style={{ width: `${matchResult.match_score}%` }}
                    />
                </div>

                {/* Verdict */}
                <p className='text-xs text-gray-600 dark:text-gray-300 mb-3'>{matchResult.verdict}</p>

                {/* Matched Skills */}
                {matchResult.matched_skills?.length > 0 && (
                    <div className='mb-2'>
                        <p className='text-xs font-medium text-green-600 mb-1'>✅ Matched Skills</p>
                        <div className='flex flex-wrap gap-1'>
                            {matchResult.matched_skills.map((s, i) => (
                                <span key={i} className='text-xs bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full'>{s}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Missing Skills */}
                {matchResult.missing_skills?.length > 0 && (
                    <div className='mb-3'>
                        <p className='text-xs font-medium text-red-500 mb-1'>❌ Missing Skills</p>
                        <div className='flex flex-wrap gap-1'>
                            {matchResult.missing_skills.map((s, i) => (
                                <span key={i} className='text-xs bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 px-2 py-0.5 rounded-full'>{s}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Apply or suggestion */}
                {!matchResult.should_apply && (
                    <div className='bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 rounded-lg p-3 text-xs text-amber-700 dark:text-amber-300'>
                        💡 Add missing skills to improve your chances before applying!
                    </div>
                )}
            </motion.div>
        )}
    </div>
)}
          {/* Badges */}
          <div className="flex gap-2 flex-wrap mb-6">
            <span className="text-xs bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full font-medium">
              ✓ Verified
            </span>
            <span className="text-xs bg-emerald-50 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-full font-medium">
              Rs. {job.salary_min?.toLocaleString()} –{" "}
              {job.salary_max?.toLocaleString()}
            </span>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full">
              {job.type}
            </span>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full">
              {job.experience}
            </span>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full">
              {job.category}
            </span>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            {[
              { label: "Location", value: job.location },
              { label: "Job Type", value: job.type },
              { label: "Experience", value: job.experience },
              {
                label: "Deadline",
                value: new Date(job.deadline).toLocaleDateString(),
              },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {item.label}
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white capitalize">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
              Job Description
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Company info */}
          {job.employer && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-3">
                About the company
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold">
                  {job.employer.company_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {job.employer.company_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {job.employer.location}
                    {job.employer.website && (
                      <>
                        {" "}
                        ·{" "}
                        <a
                          href={job.employer.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-600 hover:underline"
                        >
                          Visit website
                        </a>
                      </>
                    )}
                  </p>
                </div>
                {job.employer.is_verified && (
                  <span className="ml-auto text-xs bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                    ✓ Verified company
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Bottom apply */}
          {user?.role !== "employer" && !applied && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className={`px-6 py-3 rounded-xl text-sm border transition-colors ${
                  saved
                    ? "border-green-500 text-green-600 bg-green-50 dark:bg-green-900"
                    : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-green-400"
                }`}
              >
                {saved ? "🔖 Saved" : "🔖 Save"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApply}
                disabled={applying}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-60"
              >
                {applying ? "Applying..." : "Apply for this job"}
              </motion.button>
            </div>
          )}
          {/* Report Job */}
{user?.role === 'jobseeker' && (
    <div className='mt-4'>
        {reported ? (
            <p className='text-xs text-red-500 text-center'>✓ Job reported — we will review it</p>
        ) : (
            <button
                onClick={() => setShowReport(!showReport)}
                className='text-xs text-gray-400 hover:text-red-500 transition-colors w-full text-center'
            >
                🚩 Report this job
            </button>
        )}

        {showReport && !reported && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className='mt-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-4'
            >
                <p className='text-xs font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Why are you reporting this job?
                </p>
                <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-xs outline-none bg-white dark:bg-gray-600 dark:text-white mb-2'
                >
                    <option value='fake_job'>Fake Job</option>
                    <option value='misleading'>Misleading Information</option>
                    <option value='spam'>Spam</option>
                    <option value='inappropriate'>Inappropriate Content</option>
                    <option value='other'>Other</option>
                </select>
                <textarea
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    placeholder='Additional details (optional)...'
                    rows={2}
                    className='w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-xs outline-none bg-white dark:bg-gray-600 dark:text-white mb-2 resize-none'
                />
                <div className='flex gap-2'>
                    <button
                        onClick={handleReport}
                        disabled={reporting}
                        className='flex-1 bg-red-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50'
                    >
                        {reporting ? 'Submitting...' : 'Submit Report'}
                    </button>
                    <button
                        onClick={() => setShowReport(false)}
                        className='text-xs border border-gray-200 dark:border-gray-600 text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors'
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        )}
    </div>
)}
        </motion.div>
      </div>
    </div>
  );
};

export default JobDetail;
