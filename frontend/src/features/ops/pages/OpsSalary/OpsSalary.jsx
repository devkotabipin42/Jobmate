import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../../../components/Navbar.jsx'
import useOps from '../../hooks/useOps.js'

const OpsSalary = () => {
    const { loading, error, fetchTeam, fetchSalaryRecords, runSalaryCalculation, markPaid } = useOps()
    const [agents, setAgents] = useState([])
    const [records, setRecords] = useState([])
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [year, setYear] = useState(new Date().getFullYear())

    useEffect(() => { loadData() }, [year])

    const loadData = async () => {
        try {
            const [t, r] = await Promise.all([fetchTeam(), fetchSalaryRecords({ year })])
            setAgents((t || []).filter(m => m.ops_role === 'field_agent'))
            setRecords(r || [])
        } catch (err) { console.error(err) }
    }

    const handleCalculate = async (agent_id) => {
        try {
            await runSalaryCalculation({ agent_id, month, year })
            loadData()
        } catch (err) { alert(err.response?.data?.message || 'Failed') }
    }

    const handleMarkPaid = async (id) => {
        const ref = prompt('Payment reference (bank ref / eSewa ID):')
        if (!ref) return
        try {
            await markPaid(id, { payment_reference: ref })
            loadData()
        } catch (err) { alert('Failed') }
    }

    const monthName = (m) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1]

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='mb-6'>
                    <Link to='/ops' className='text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600'>← Dashboard</Link>
                    <h1 className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>Salary & Payouts</h1>
                </div>

                {error && <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300'>{error}</div>}

                <div className='bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700 mb-6'>
                    <h2 className='text-sm font-semibold text-gray-900 dark:text-white mb-3'>Calculate Salary</h2>
                    <div className='flex flex-wrap gap-3 items-end'>
                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Month</label>
                            <select value={month} onChange={e => setMonth(Number(e.target.value))} className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'>
                                {Array.from({length:12}).map((_,i) => <option key={i} value={i+1}>{monthName(i+1)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Year</label>
                            <input type='number' value={year} onChange={e => setYear(Number(e.target.value))} className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm w-24' />
                        </div>
                    </div>
                    <div className='mt-4 space-y-2'>
                        {agents.map(a => (
                            <div key={a._id} className='flex justify-between items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50'>
                                <span className='text-sm text-gray-900 dark:text-white'>{a.full_name}</span>
                                <button onClick={() => handleCalculate(a._id)} disabled={loading} className='px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50'>
                                    Calculate {monthName(month)} {year}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
                    <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
                        <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Salary Records · {year}</h2>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead className='bg-gray-50 dark:bg-gray-900/50'>
                                <tr>
                                    <th className='text-left px-4 py-3 text-xs text-gray-500 uppercase'>Agent</th>
                                    <th className='text-left px-4 py-3 text-xs text-gray-500 uppercase'>Period</th>
                                    <th className='text-right px-4 py-3 text-xs text-gray-500 uppercase'>Visits</th>
                                    <th className='text-right px-4 py-3 text-xs text-gray-500 uppercase'>Conv</th>
                                    <th className='text-right px-4 py-3 text-xs text-gray-500 uppercase'>Base</th>
                                    <th className='text-right px-4 py-3 text-xs text-gray-500 uppercase'>Incentive</th>
                                    <th className='text-right px-4 py-3 text-xs text-gray-500 uppercase'>Bonus</th>
                                    <th className='text-right px-4 py-3 text-xs text-gray-500 uppercase'>Total</th>
                                    <th className='text-center px-4 py-3 text-xs text-gray-500 uppercase'>Status</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                                {records.map(r => (
                                    <tr key={r._id} className='hover:bg-gray-50 dark:hover:bg-gray-700/30'>
                                        <td className='px-4 py-3 text-gray-900 dark:text-white'>{r.agent?.full_name}</td>
                                        <td className='px-4 py-3 text-gray-500'>{monthName(r.month)} {r.year}</td>
                                        <td className='px-4 py-3 text-right text-gray-900 dark:text-white'>{r.visits_count}</td>
                                        <td className='px-4 py-3 text-right text-gray-900 dark:text-white'>{r.conversions_count}</td>
                                        <td className='px-4 py-3 text-right text-gray-900 dark:text-white'>{r.base_amount?.toLocaleString()}</td>
                                        <td className='px-4 py-3 text-right text-gray-900 dark:text-white'>{r.visit_incentive_total?.toLocaleString()}</td>
                                        <td className='px-4 py-3 text-right text-gray-900 dark:text-white'>{r.conversion_bonus_total?.toLocaleString()}</td>
                                        <td className='px-4 py-3 text-right font-semibold text-green-600'>NPR {r.net_payable?.toLocaleString()}</td>
                                        <td className='px-4 py-3 text-center'>
                                            {r.payment_status === 'paid' ? (
                                                <span className='text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'>Paid</span>
                                            ) : (
                                                <button onClick={() => handleMarkPaid(r._id)} className='text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700'>Mark paid</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {records.length === 0 && <tr><td colSpan='9' className='px-4 py-8 text-center text-gray-500'>No records for {year}</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OpsSalary