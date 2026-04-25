import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useOps from '../../hooks/useOps.js'

const AgentEarnings = () => {
    const { loading, fetchSalaryRecords, fetchMyTasks } = useOps()
    const [records, setRecords] = useState([])
    const [tasks, setTasks] = useState([])

    useEffect(() => { load() }, [])

    const load = async () => {
        try {
            const [r, t] = await Promise.all([fetchSalaryRecords(), fetchMyTasks()])
            setRecords(r || [])
            setTasks(t || [])
        } catch (err) { console.error(err) }
    }

    const current = records[0]
    const completedTasks = tasks.filter(t => ['completed','verified'].includes(t.status)).length
    const monthName = (m) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1]

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 pb-20'>
            <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3'>
                <p className='text-xs text-gray-500'>My Earnings</p>
                <p className='text-lg font-bold text-gray-900 dark:text-white'>💰 Salary & Bonuses</p>
            </div>

            <div className='p-4 space-y-4'>
                {current && (
                    <div className='bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white'>
                        <p className='text-xs opacity-80'>{monthName(current.month)} {current.year}</p>
                        <p className='text-3xl font-bold mt-1'>NPR {current.net_payable?.toLocaleString()}</p>
                        <p className='text-xs opacity-80 mt-1'>{current.payment_status === 'paid' ? '✓ Paid' : '⏳ Pending'}</p>
                        <div className='grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/20'>
                            <div>
                                <p className='text-xs opacity-70'>Visits</p>
                                <p className='text-lg font-semibold'>{current.visits_count}</p>
                            </div>
                            <div>
                                <p className='text-xs opacity-70'>Conversions</p>
                                <p className='text-lg font-semibold'>{current.conversions_count}</p>
                            </div>
                        </div>
                    </div>
                )}

                {!current && !loading && (
                    <div className='bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700'>
                        <p className='text-sm text-gray-500 text-center'>Abhi koi salary record nahi. Mahine ke end mein calculate hoga.</p>
                        <div className='grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700'>
                            <div className='text-center'>
                                <p className='text-xs text-gray-500'>This month visits</p>
                                <p className='text-2xl font-bold text-blue-600'>{completedTasks}</p>
                            </div>
                            <div className='text-center'>
                                <p className='text-xs text-gray-500'>Tasks pending</p>
                                <p className='text-2xl font-bold text-amber-600'>{tasks.filter(t => t.status === 'assigned').length}</p>
                            </div>
                        </div>
                    </div>
                )}

                {current && (
                    <div className='bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700'>
                        <p className='text-xs font-semibold text-gray-500 uppercase mb-3'>Breakdown</p>
                        <div className='space-y-2 text-sm'>
                            <div className='flex justify-between'><span className='text-gray-600 dark:text-gray-400'>Base pay</span><span className='text-gray-900 dark:text-white'>NPR {current.base_amount?.toLocaleString()}</span></div>
                            <div className='flex justify-between'><span className='text-gray-600 dark:text-gray-400'>Visit incentives</span><span className='text-gray-900 dark:text-white'>NPR {current.visit_incentive_total?.toLocaleString()}</span></div>
                            <div className='flex justify-between'><span className='text-gray-600 dark:text-gray-400'>Conversion bonus</span><span className='text-green-600'>NPR {current.conversion_bonus_total?.toLocaleString()}</span></div>
                            <div className='flex justify-between font-semibold pt-2 border-t border-gray-100 dark:border-gray-700'><span className='text-gray-900 dark:text-white'>Total</span><span className='text-gray-900 dark:text-white'>NPR {current.net_payable?.toLocaleString()}</span></div>
                        </div>
                    </div>
                )}

                <div>
                    <p className='text-xs font-semibold text-gray-500 uppercase mb-2'>History</p>
                    <div className='space-y-2'>
                        {records.slice(1).map(r => (
                            <div key={r._id} className='bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 flex justify-between items-center'>
                                <div>
                                    <p className='text-sm font-medium text-gray-900 dark:text-white'>{monthName(r.month)} {r.year}</p>
                                    <p className='text-xs text-gray-500'>{r.visits_count} visits · {r.conversions_count} conv</p>
                                </div>
                                <div className='text-right'>
                                    <p className='text-sm font-semibold text-gray-900 dark:text-white'>NPR {r.net_payable?.toLocaleString()}</p>
                                    <p className={`text-xs ${r.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>{r.payment_status}</p>
                                </div>
                            </div>
                        ))}
                        {records.length <= 1 && <p className='text-center text-xs text-gray-500 py-4'>No history yet</p>}
                    </div>
                </div>
            </div>

            <div className='fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around py-2'>
                <Link to='/agent' className='flex flex-col items-center py-1 px-3 text-gray-500'>
                    <span className='text-lg'>🏠</span>
                    <span className='text-[10px]'>Tasks</span>
                </Link>
                <Link to='/agent/earnings' className='flex flex-col items-center py-1 px-3 text-blue-600'>
                    <span className='text-lg'>💰</span>
                    <span className='text-[10px] font-medium'>Earnings</span>
                </Link>
            </div>
        </div>
    )
}

export default AgentEarnings