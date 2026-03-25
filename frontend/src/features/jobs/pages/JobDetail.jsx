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
  const { applyJob } = useJobseeker();
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");
  const { toggleSaveJob } = useJobseeker();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadJob();
  }, [id]);

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
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-green-50 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-xl shrink-0">
                {job.employer?.company_name?.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-1">
                  {job.title}
                </h1>
                <Link
    to={`/company/${job.employer?._id}`}
    className='text-gray-500 dark:text-gray-400 hover:text-green-600 transition-colors'
>
    {job.employer?.company_name} · {job.location}
</Link>
              </div>
            </div>

            {/* Buttons — mobile pe full width */}
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
                className="bg-green-600 text-white px-12 py-3 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-60"
              >
                {applying ? "Applying..." : "Apply for this job"}
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default JobDetail;
