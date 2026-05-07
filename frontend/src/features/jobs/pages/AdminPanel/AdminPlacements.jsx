const statusStyle = {
    shortlisted: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300',
    interview: 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300',
    hired: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300'
}

const formatDate = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '-'
    return date.toLocaleDateString()
}

const formatSalary = (min, max) => {
    if (!min && !max) return '-'
    return `Rs. ${Number(min || 0).toLocaleString()}–${Number(max || 0).toLocaleString()}`
}

const AdminPlacements = ({ data, loading, onRefresh }) => {
    const counts = data?.counts || {
        shortlisted: 0,
        interview: 0,
        hired: 0,
        rejected: 0
    }

    const placements = data?.placements || []

    return (
        <div className='space-y-6'>
            <div className='rounded-2xl bg-white dark:bg-[#0c1a2e] border border-gray-200 dark:border-white/10 p-5'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div>
                        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Placement Tracker</h2>
                        <p className='text-sm text-gray-500 dark:text-white/45 mt-1'>
                            Track JobMate hiring pipeline: shortlisted, interview, hired, and rejected candidates.
                        </p>
                    </div>

                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className='px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50'
                    >
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                <div className='grid grid-cols-2 lg:grid-cols-5 gap-3 mt-5'>
                    <div className='rounded-xl bg-gray-50 dark:bg-white/5 p-4'>
                        <p className='text-xs text-gray-500 dark:text-white/40'>Total</p>
                        <p className='text-2xl font-bold text-gray-900 dark:text-white'>{data?.total || 0}</p>
                    </div>

                    {Object.entries(counts).map(([status, count]) => (
                        <div key={status} className='rounded-xl bg-gray-50 dark:bg-white/5 p-4'>
                            <p className='text-xs text-gray-500 dark:text-white/40 capitalize'>{status}</p>
                            <p className='text-2xl font-bold text-gray-900 dark:text-white'>{count || 0}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className='rounded-2xl bg-white dark:bg-[#0c1a2e] border border-gray-200 dark:border-white/10 overflow-hidden'>
                <div className='p-5 border-b border-gray-100 dark:border-white/10'>
                    <h3 className='text-base font-bold text-gray-900 dark:text-white'>Placement Pipeline</h3>
                    <p className='text-sm text-gray-500 dark:text-white/45 mt-1'>
                        These records come from application statuses.
                    </p>
                </div>

                {placements.length === 0 ? (
                    <div className='p-8 text-center'>
                        <p className='text-gray-600 dark:text-white/60 font-medium'>No placement records yet.</p>
                        <p className='text-sm text-gray-400 dark:text-white/35 mt-1'>
                            When employers move candidates to interview or hired, they will appear here.
                        </p>
                    </div>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead className='bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-white/45'>
                                <tr>
                                    <th className='text-left px-5 py-3 font-semibold'>Candidate</th>
                                    <th className='text-left px-5 py-3 font-semibold'>Job</th>
                                    <th className='text-left px-5 py-3 font-semibold'>Employer</th>
                                    <th className='text-left px-5 py-3 font-semibold'>Location</th>
                                    <th className='text-left px-5 py-3 font-semibold'>Salary</th>
                                    <th className='text-left px-5 py-3 font-semibold'>Status</th>
                                    <th className='text-left px-5 py-3 font-semibold'>Updated</th>
                                </tr>
                            </thead>

                            <tbody className='divide-y divide-gray-100 dark:divide-white/10'>
                                {placements.map(item => (
                                    <tr key={item._id} className='hover:bg-gray-50 dark:hover:bg-white/[0.03]'>
                                        <td className='px-5 py-4'>
                                            <p className='font-semibold text-gray-900 dark:text-white'>
                                                {item.candidate?.name || 'Unknown'}
                                            </p>
                                            <p className='text-xs text-gray-500 dark:text-white/35'>
                                                {item.candidate?.phone || item.candidate?.email || '-'}
                                            </p>
                                        </td>

                                        <td className='px-5 py-4'>
                                            <p className='font-medium text-gray-800 dark:text-white'>
                                                {item.job?.title || 'Unknown job'}
                                            </p>
                                            <p className='text-xs text-gray-500 dark:text-white/35'>
                                                {item.category || '-'} · {item.type || '-'}
                                            </p>
                                        </td>

                                        <td className='px-5 py-4 text-gray-700 dark:text-white/70'>
                                            {item.employer?.company_name || 'Employer missing'}
                                        </td>

                                        <td className='px-5 py-4 text-gray-700 dark:text-white/70'>
                                            {item.location || '-'}
                                        </td>

                                        <td className='px-5 py-4 text-gray-700 dark:text-white/70'>
                                            {formatSalary(item.salary_min, item.salary_max)}
                                        </td>

                                        <td className='px-5 py-4'>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle[item.status] || 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-white/60'}`}>
                                                {item.status}
                                            </span>
                                        </td>

                                        <td className='px-5 py-4 text-gray-500 dark:text-white/40'>
                                            {formatDate(item.lastUpdatedAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminPlacements