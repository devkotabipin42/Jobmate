import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import JobseekerProfileModal from './JobseekerProfileModal.jsx'

const LoadingSpinner = () => (
    <div className='flex items-center justify-center py-20'>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className='w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full' />
    </div>
)

const statusColors = {
    applied: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    seen: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    shortlisted: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    interview: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    hired: 'bg-green-500/10 text-green-500 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
}

const kanbanColumns = {
    applied: { title: 'Applied', dot: 'bg-blue-500', bg: 'bg-blue-500/5 border-blue-500/15' },
    seen: { title: 'Seen', dot: 'bg-amber-500', bg: 'bg-amber-500/5 border-amber-500/15' },
    shortlisted: { title: 'Shortlisted', dot: 'bg-purple-500', bg: 'bg-purple-500/5 border-purple-500/15' },
    interview: { title: 'Interview', dot: 'bg-orange-500', bg: 'bg-orange-500/5 border-orange-500/15' },
    hired: { title: 'Hired', dot: 'bg-green-500', bg: 'bg-green-500/5 border-green-500/15' },
    rejected: { title: 'Rejected', dot: 'bg-red-500', bg: 'bg-red-500/5 border-red-500/15' },
}

// ── VERIFIED BADGE ────────────────────────────────────────
const VerifiedBadge = () => (
    <span className='inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0'>
        ⭐ Verified
    </span>
)

// ── EMPLOYER JOBS ─────────────────────────────────────────
export const EmployerJobs = ({ myJobs, loading, handleViewApplications, handleDeleteJob, deleting }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='min-w-0'>
        <div className='flex items-center justify-between mb-6'>
            <div>
                <h2 className='text-xl font-bold text-gray-800 dark:text-white'>My Jobs</h2>
                <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>{myJobs.length} jobs posted</p>
            </div>
            <Link to='/employer/post-job'
                className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors'>
                <svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg>
                Post New Job
            </Link>
        </div>

        {loading ? <LoadingSpinner /> : myJobs.length === 0 ? (
            <div className='text-center py-20 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                <div className='w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                    <svg className='w-7 h-7 text-green-500' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'><rect x='2' y='7' width='20' height='14' rx='2'/><path d='M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2'/></svg>
                </div>
                <p className='text-gray-800 dark:text-white font-semibold mb-1'>No jobs posted yet</p>
                <p className='text-sm text-gray-400 dark:text-white/25 mb-4'>Start attracting candidates today</p>
                <Link to='/employer/post-job' className='bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors'>
                    Post your first job
                </Link>
            </div>
        ) : (
            <div className='space-y-3'>
                {myJobs.map((job, i) => (
                    <motion.div key={job._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 hover:border-green-300 dark:hover:border-green-500/30 rounded-2xl p-5 transition-all group'>
                        <div className='flex items-start justify-between gap-3 mb-3'>
                            <div className='flex-1 min-w-0'>
                                <div className='flex items-center gap-2 flex-wrap mb-1'>
                                    <h3 className='text-sm font-semibold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors'>{job.title}</h3>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${job.is_active ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/35 border-gray-200 dark:border-white/8'}`}>
                                        {job.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    {job.is_verified && (
                                        <span className='text-[10px] bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-full font-medium flex items-center gap-1'>
                                            <svg className='w-2.5 h-2.5' fill='none' stroke='currentColor' strokeWidth='3' viewBox='0 0 24 24'><polyline points='20 6 9 17 4 12'/></svg>
                                            Verified
                                        </span>
                                    )}
                                </div>
                                <p className='text-xs text-gray-500 dark:text-white/35'>{job.location} · {job.type} · {job.category}</p>
                            </div>
                            <div className='text-right shrink-0'>
                                <p className='text-sm font-bold text-gray-800 dark:text-white'>{job.application_count}</p>
                                <p className='text-xs text-gray-400 dark:text-white/25'>applicants</p>
                            </div>
                        </div>

                        <div className='flex items-center gap-2 mb-4'>
                            <span className='text-xs bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-white/50 border border-gray-200 dark:border-white/8 px-2.5 py-1 rounded-full'>
                                Rs. {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                            </span>
                            <span className='text-xs text-gray-400 dark:text-white/25'>
                                Deadline: {new Date(job.deadline).toLocaleDateString()}
                            </span>
                        </div>

                        <div className='flex gap-2 flex-wrap'>
                            <button onClick={() => handleViewApplications(job)}
                                className='flex-1 text-xs bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20 py-2.5 rounded-xl hover:bg-green-100 dark:hover:bg-green-500/15 transition-colors font-semibold'>
                                Applications ({job.application_count})
                            </button>
                            <Link to={`/employer/edit-job/${job._id}`}
                                className='text-xs border border-gray-200 dark:border-white/8 text-gray-600 dark:text-white/40 px-4 py-2.5 rounded-xl hover:border-green-400 dark:hover:border-green-500/40 hover:text-green-600 dark:hover:text-green-400 transition-colors'>
                                Edit
                            </Link>
                            <button onClick={() => handleDeleteJob(job._id)} disabled={deleting === job._id}
                                className='text-xs border border-red-200 dark:border-red-500/20 text-red-500 px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/5 transition-colors disabled:opacity-50'>
                                {deleting === job._id ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        )}
    </motion.div>
)

// ── EMPLOYER APPLICATIONS ─────────────────────────────────
export const EmployerApplications = ({ applications, selectedJob, viewMode, setViewMode, handleStatusUpdate, handleDragEnd, handleTabChange }) => {
    const [profileModal, setProfileModal] = useState(null)
    if (!selectedJob) return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className='text-center py-20 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                <div className='w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4'>
                    <svg className='w-7 h-7 text-blue-400' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'><path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/></svg>
                </div>
                <p className='text-gray-800 dark:text-white font-semibold mb-1'>No job selected</p>
                <p className='text-sm text-gray-400 dark:text-white/25 mb-4'>Select a job to view its applications</p>
                <button onClick={() => handleTabChange('jobs')} className='bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors'>
                    Go to My Jobs
                </button>
            </div>
        </motion.div>
    )

    return (
        <>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h2 className='text-xl font-bold text-gray-800 dark:text-white'>{selectedJob.title}</h2>
                    <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>{applications.length} total applicants</p>
                </div>
                <div className='flex bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-2xl p-1'>
                    {[{ id: 'list', label: 'List' }, { id: 'kanban', label: 'Pipeline' }].map(m => (
                        <button key={m.id} onClick={() => setViewMode(m.id)}
                            className={`px-4 py-2 text-xs rounded-xl transition-all font-medium ${viewMode === m.id ? 'bg-white dark:bg-white/10 text-green-600 dark:text-green-400 shadow-sm' : 'text-gray-500 dark:text-white/35'}`}>
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>

            {applications.length === 0 ? (
                <div className='text-center py-20 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                    <p className='text-gray-800 dark:text-white font-semibold mb-1'>No applications yet</p>
                    <p className='text-sm text-gray-400 dark:text-white/25'>Applications will appear here when candidates apply</p>
                </div>
            ) : viewMode === 'list' ? (
                <div className='space-y-3'>
                    {applications.map((app, i) => (
                        <motion.div key={app._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-5'>
                            <div className='flex items-start justify-between gap-3 mb-3'>
                                <div className='flex items-center gap-3'>
                                    {/* Avatar with verified ring */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold shrink-0 ${
                                        app.user?.is_verified_jobseeker
                                            ? 'bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-400 dark:border-amber-500/50 text-amber-600 dark:text-amber-400'
                                            : 'bg-green-500/10 border border-green-500/20 text-green-500'
                                    }`}>
                                        {app.user?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <div className='flex items-center gap-1.5 flex-wrap'>
                                            <p className='text-sm font-semibold text-gray-800 dark:text-white'>{app.user?.name}</p>
                                            {app.user?.is_verified_jobseeker && <VerifiedBadge />}
                                        </div>
                                        <p className='text-xs text-gray-500 dark:text-white/35'>{app.user?.location || 'No location'}</p>
                                        {/* Skills preview */}
                                        {app.user?.skills?.length > 0 && (
                                            <div className='flex gap-1 flex-wrap mt-1'>
                                                {app.user.skills.slice(0, 3).map((skill, j) => (
                                                    <span key={j} className='text-[10px] bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/40 px-2 py-0.5 rounded-full'>
                                                        {skill}
                                                    </span>
                                                ))}
                                                {app.user.skills.length > 3 && (
                                                    <span className='text-[10px] text-gray-400 dark:text-white/25'>+{app.user.skills.length - 3}</span>
                                                )}
                                            </div>
                                        )}
                                        {/* View Profile button */}
                                        <button onClick={() => setProfileModal({ id: app.user?._id, name: app.user?.name })}
                                            className='text-xs text-green-600 dark:text-green-400 hover:underline mt-1 flex items-center gap-1'>
                                            <svg className='w-3 h-3' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/><circle cx='12' cy='7' r='4'/></svg>
                                            View Full Profile
                                        </button>
                                    </div>
                                </div>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 border ${statusColors[app.status] || statusColors.applied}`}>
                                    {app.status}
                                </span>
                            </div>

                            {app.cover_letter && (
                                <div className='bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 rounded-xl p-3 mb-3'>
                                    <p className='text-xs text-gray-600 dark:text-white/50 line-clamp-2'>{app.cover_letter}</p>
                                </div>
                            )}

                            {app.cv_url && (
                                <div className='flex gap-3 mb-3'>
                                    <a href={app.cv_url} target='_blank' rel='noreferrer'
                                        className='text-xs text-green-600 dark:text-green-400 hover:underline flex items-center gap-1'>
                                        <svg className='w-3 h-3' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>
                                        View CV
                                    </a>
                                </div>
                            )}

                            <div className='flex gap-2 flex-wrap'>
                                {Object.keys(kanbanColumns).map(status => (
                                    <button key={status} onClick={() => handleStatusUpdate(app._id, status)}
                                        className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors ${
                                            app.status === status
                                                ? 'bg-green-600 text-white'
                                                : 'border border-gray-200 dark:border-white/8 text-gray-500 dark:text-white/35 hover:border-green-400 dark:hover:border-green-500/40'
                                        }`}>
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                // Kanban
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className='flex gap-3 pb-4' style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        {Object.entries(kanbanColumns).map(([status, col]) => {
                            const colApps = applications.filter(a => a.status === status)
                            return (
                                <div key={status} className='shrink-0 w-64'>
                                    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl mb-2 border ${col.bg}`}>
                                        <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                                        <span className='text-xs font-semibold text-gray-700 dark:text-white/60'>{col.title}</span>
                                        <span className='ml-auto text-xs bg-white dark:bg-white/10 text-gray-600 dark:text-white/50 px-2 py-0.5 rounded-full font-medium'>{colApps.length}</span>
                                    </div>
                                    <Droppable droppableId={status}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps}
                                                className={`min-h-32 rounded-xl p-2 transition-colors ${snapshot.isDraggingOver ? 'bg-green-50 dark:bg-green-500/5' : 'bg-gray-50 dark:bg-white/2'}`}>
                                                {colApps.map((app, i) => (
                                                    <Draggable key={app._id} draggableId={app._id} index={i}>
                                                        {(provided, snapshot) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                                                                className={`bg-white dark:bg-white/5 rounded-xl p-3 mb-2 border transition-shadow ${
                                                                    app.user?.is_verified_jobseeker
                                                                        ? 'border-amber-200 dark:border-amber-500/20'
                                                                        : 'border-gray-100 dark:border-white/7'
                                                                } ${snapshot.isDragging ? 'shadow-lg rotate-1' : ''}`}>
                                                                <div className='flex items-center gap-2 mb-2'>
                                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 ${
                                                                        app.user?.is_verified_jobseeker
                                                                            ? 'bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-400 dark:border-amber-500/50 text-amber-600 dark:text-amber-400'
                                                                            : 'bg-green-500/10 text-green-500'
                                                                    }`}>
                                                                        {app.user?.name?.charAt(0)}
                                                                    </div>
                                                                    <div className='min-w-0 flex-1'>
                                                                        <div className='flex items-center gap-1 flex-wrap'>
                                                                            <p className='text-xs font-semibold text-gray-800 dark:text-white truncate'>{app.user?.name}</p>
                                                                            {app.user?.is_verified_jobseeker && (
                                                                                <span className='text-[9px] text-amber-600 dark:text-amber-400'>⭐</span>
                                                                            )}
                                                                        </div>
                                                                        <p className='text-xs text-gray-400 dark:text-white/25 truncate'>{app.user?.location || 'No location'}</p>
                                                                    </div>
                                                                </div>
                                                                {/* Skills in kanban */}
                                                                {app.user?.skills?.length > 0 && (
                                                                    <div className='flex gap-1 flex-wrap mb-2'>
                                                                        {app.user.skills.slice(0, 2).map((skill, j) => (
                                                                            <span key={j} className='text-[9px] bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/30 px-1.5 py-0.5 rounded-full'>
                                                                                {skill}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {app.cv_url && (
                                                                    <a href={app.cv_url} target='_blank' rel='noreferrer' className='text-xs text-green-600 dark:text-green-400 hover:underline'>View CV</a>
                                                                )}
                                                                <p className='text-xs text-gray-400 dark:text-white/20 mt-2'>{new Date(app.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            )
                        })}
                    </div>
                </DragDropContext>
            )}
        </motion.div>

        {/* Jobseeker Profile Modal */}
        {profileModal && (
            <JobseekerProfileModal
                userId={profileModal.id}
                userName={profileModal.name}
                onClose={() => setProfileModal(null)}
            />
        )}
        </>
    )
}