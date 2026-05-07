import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import useOps from '../../hooks/useOps.js'

const AgentDataForm = () => {
    const { taskId } = useParams()
    const navigate = useNavigate()
    const { loading, submitFieldVisit, fetchMyTasks } = useOps()

    const [task, setTask] = useState(null)
    const [step, setStep] = useState(1)
    const [checkinData, setCheckinData] = useState(null)

    const [form, setForm] = useState({
        business_name: '',
        business_type: 'kirana',
        owner_name: '',
        owner_phone: '',
        whatsapp: '',
        staff_count: '',
        years_in_business: '',
        looking_to_hire: 'maybe',
        positions: '',
        budget_min: '',
        budget_max: '',
        timeline: '',
        reaction: 'interested',
        next_action: 'call_later',
        objections: '',
        agent_notes: ''
    })

    const [followUpForm, setFollowUpForm] = useState({
        result: 'contacted',
        note: '',
        next_follow_up_at: ''
    })

    useEffect(() => {
        loadTask()

        const saved = localStorage.getItem(`checkin_${taskId}`)
        if (saved) {
            const parsed = JSON.parse(saved)
            setCheckinData(parsed)
            if (parsed.task) setTask(parsed.task)
        }

        const draft = localStorage.getItem(`draft_${taskId}`)
        if (draft) setForm(JSON.parse(draft))

        const followUpDraft = localStorage.getItem(`followup_draft_${taskId}`)
        if (followUpDraft) setFollowUpForm(JSON.parse(followUpDraft))
    }, [taskId])

    const loadTask = async () => {
        try {
            const tasks = await fetchMyTasks()
            const t = (tasks || []).find(x => x._id === taskId)
            if (t) setTask(t)
        } catch (err) {
            console.error(err)
        }
    }

    const isFollowUpTask = task?.task_type === 'follow_up'

    const update = (key, value) => {
        const newForm = { ...form, [key]: value }
        setForm(newForm)
        localStorage.setItem(`draft_${taskId}`, JSON.stringify(newForm))
    }

    const updateFollowUp = (key, value) => {
        const newForm = { ...followUpForm, [key]: value }
        setFollowUpForm(newForm)
        localStorage.setItem(`followup_draft_${taskId}`, JSON.stringify(newForm))
    }

    const getCheckInPayload = () => {
        if (!checkinData?.location) return {}

        return {
            timestamp: checkinData.checkin_time,
            location: {
                type: 'Point',
                coordinates: [checkinData.location.lng, checkinData.location.lat]
            },
            gps_accuracy: checkinData.location.accuracy
        }
    }

    const handleFollowUpSubmit = async () => {
        const submissionId = `${taskId}_${Date.now()}`

        const noteLines = [
            `Follow-up result: ${followUpForm.result}`,
            followUpForm.note ? `Note: ${followUpForm.note}` : '',
            followUpForm.next_follow_up_at ? `Next follow-up: ${followUpForm.next_follow_up_at}` : ''
        ].filter(Boolean)

        const payload = {
            task_id: taskId,
            client_submission_id: submissionId,
            check_in: getCheckInPayload(),
            check_out: { timestamp: new Date().toISOString() },
            business_info: {
                name: task?.target_business?.name || 'Follow-up',
                type: 'service',
                owner_name: task?.target_business?.owner_name || '',
                owner_phone: task?.target_business?.owner_phone || '',
                whatsapp: task?.target_business?.owner_phone || '',
                address: task?.target_business?.address || '',
                staff_count: 0,
                years_in_business: 0
            },
            hiring_needs: {
                looking_to_hire: 'maybe',
                positions: task?.target_business?.name || '',
                budget_min: 0,
                budget_max: 0,
                timeline: followUpForm.next_follow_up_at || ''
            },
            pitch_outcome: {
                reaction: followUpForm.result === 'not_interested' ? 'not_interested' : 'interested',
                next_action: followUpForm.result === 'follow_up_again' ? 'call_later' : 'brochure',
                objections: followUpForm.result,
                agent_notes: noteLines.join('\n')
            }
        }

        try {
            await submitFieldVisit(payload)
            localStorage.removeItem(`checkin_${taskId}`)
            localStorage.removeItem(`followup_draft_${taskId}`)
            navigate('/agent')
        } catch (err) {
            alert('Submission failed. Data saved locally — please retry when online.')
        }
    }

    const handleSubmit = async () => {
        const submissionId = `${taskId}_${Date.now()}`

        const payload = {
            task_id: taskId,
            client_submission_id: submissionId,
            check_in: getCheckInPayload(),
            check_out: { timestamp: new Date().toISOString() },
            business_info: {
                name: form.business_name,
                type: form.business_type,
                owner_name: form.owner_name,
                owner_phone: form.owner_phone,
                whatsapp: form.whatsapp,
                staff_count: Number(form.staff_count) || 0,
                years_in_business: Number(form.years_in_business) || 0
            },
            hiring_needs: {
                looking_to_hire: form.looking_to_hire,
                positions: form.positions,
                budget_min: Number(form.budget_min) || 0,
                budget_max: Number(form.budget_max) || 0,
                timeline: form.timeline
            },
            pitch_outcome: {
                reaction: form.reaction,
                next_action: form.next_action,
                objections: form.objections,
                agent_notes: form.agent_notes
            }
        }

        try {
            await submitFieldVisit(payload)
            localStorage.removeItem(`checkin_${taskId}`)
            localStorage.removeItem(`draft_${taskId}`)
            navigate('/agent')
        } catch (err) {
            alert('Submission failed. Data saved locally — please retry when online.')
        }
    }

    const inputClass = 'w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm'

    if (!task) {
        return (
            <div className='min-h-screen flex items-center justify-center text-gray-500'>
                Loading...
            </div>
        )
    }

    if (isFollowUpTask) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 pb-20'>
                <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10'>
                    <Link to='/agent' className='text-2xl text-gray-600 dark:text-gray-300'>
                        ←
                    </Link>
                    <div>
                        <p className='text-xs text-gray-500'>Follow-up Result</p>
                        <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                            {task.target_business?.name || 'Follow-up task'}
                        </p>
                    </div>
                </div>

                <div className='p-4 space-y-4'>
                    <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>Target</p>
                        <p className='font-semibold text-gray-900 dark:text-white'>
                            {task.target_business?.name || '-'}
                        </p>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                            {task.target_business?.address || '-'}
                        </p>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                            {task.target_business?.owner_name || '-'} · {task.target_business?.owner_phone || '-'}
                        </p>
                    </div>

                    {task.notes_for_agent && (
                        <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3'>
                            <p className='text-xs text-blue-700 dark:text-blue-300 font-semibold mb-1'>
                                Notes from supervisor:
                            </p>
                            <pre className='whitespace-pre-wrap text-sm text-blue-900 dark:text-blue-200'>
                                {task.notes_for_agent}
                            </pre>
                        </div>
                    )}

                    <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-4'>
                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>
                                Follow-up Result *
                            </label>
                            <select
                                value={followUpForm.result}
                                onChange={e => updateFollowUp('result', e.target.value)}
                                className={inputClass}
                            >
                                <option value='contacted'>Contacted</option>
                                <option value='no_answer'>No answer</option>
                                <option value='wrong_number'>Wrong number</option>
                                <option value='interview_confirmed'>Interview confirmed</option>
                                <option value='joined_confirmed'>Joined confirmed</option>
                                <option value='employer_will_review'>Employer will review</option>
                                <option value='not_interested'>Not interested</option>
                                <option value='follow_up_again'>Need follow-up again</option>
                            </select>
                        </div>

                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>
                                Follow-up Note *
                            </label>
                            <textarea
                                rows='5'
                                value={followUpForm.note}
                                onChange={e => updateFollowUp('note', e.target.value)}
                                placeholder='Write what happened. Example: Candidate confirmed interview tomorrow at 11 AM.'
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>
                                Next Follow-up Date optional
                            </label>
                            <input
                                type='datetime-local'
                                value={followUpForm.next_follow_up_at}
                                onChange={e => updateFollowUp('next_follow_up_at', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>

                <div className='fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3'>
                    <button
                        onClick={handleFollowUpSubmit}
                        disabled={loading || !followUpForm.note.trim()}
                        className='w-full py-3 bg-green-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50'
                    >
                        {loading ? 'Submitting...' : 'Submit Follow-up'}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 pb-20'>
            <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10'>
                <Link to='/agent' className='text-2xl text-gray-600 dark:text-gray-300'>
                    ←
                </Link>

                <div className='flex-1'>
                    <p className='text-xs text-gray-500'>Step {step} of 3</p>
                    <div className='h-1 bg-gray-200 dark:bg-gray-700 rounded mt-1 overflow-hidden'>
                        <div className='h-full bg-blue-600 transition-all' style={{ width: `${(step / 3) * 100}%` }} />
                    </div>
                </div>
            </div>

            <div className='p-4 space-y-3'>
                {step === 1 && (
                    <>
                        <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>Business Information</h2>

                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Business Name *</label>
                            <input value={form.business_name} onChange={e => update('business_name', e.target.value)} className={inputClass} />
                        </div>

                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Business Type</label>
                            <div className='grid grid-cols-2 gap-2'>
                                {[
                                    ['kirana', 'Grocery'],
                                    ['restaurant', 'Restaurant'],
                                    ['hotel', 'Hotel'],
                                    ['service', 'Service'],
                                    ['retail', 'Retail'],
                                    ['other', 'Other']
                                ].map(([value, label]) => (
                                    <button
                                        key={value}
                                        type='button'
                                        onClick={() => update('business_type', value)}
                                        className={`py-2.5 rounded-lg text-xs ${form.business_type === value ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Owner Name *</label>
                            <input value={form.owner_name} onChange={e => update('owner_name', e.target.value)} className={inputClass} />
                        </div>

                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Phone / WhatsApp *</label>
                            <input value={form.owner_phone} onChange={e => update('owner_phone', e.target.value)} placeholder='98XXXXXXXX' className={inputClass} />
                        </div>

                        <div className='grid grid-cols-2 gap-2'>
                            <div>
                                <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Staff count</label>
                                <input type='number' value={form.staff_count} onChange={e => update('staff_count', e.target.value)} className={inputClass} />
                            </div>

                            <div>
                                <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Years in business</label>
                                <input type='number' value={form.years_in_business} onChange={e => update('years_in_business', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>Hiring Needs</h2>

                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Looking to hire?</label>
                            <div className='grid grid-cols-2 gap-2'>
                                {[
                                    ['urgent', 'Urgently'],
                                    ['soon', 'Within months'],
                                    ['maybe', 'Possibly'],
                                    ['no', 'Not now']
                                ].map(([value, label]) => (
                                    <button
                                        key={value}
                                        type='button'
                                        onClick={() => update('looking_to_hire', value)}
                                        className={`py-2.5 rounded-lg text-xs ${form.looking_to_hire === value ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Positions needed</label>
                            <input value={form.positions} onChange={e => update('positions', e.target.value)} placeholder='e.g., 2 helpers, 1 cook' className={inputClass} />
                        </div>

                        <div className='grid grid-cols-2 gap-2'>
                            <div>
                                <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Budget min NPR</label>
                                <input type='number' value={form.budget_min} onChange={e => update('budget_min', e.target.value)} className={inputClass} />
                            </div>

                            <div>
                                <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Budget max NPR</label>
                                <input type='number' value={form.budget_max} onChange={e => update('budget_max', e.target.value)} className={inputClass} />
                            </div>
                        </div>

                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Timeline</label>
                            <input value={form.timeline} onChange={e => update('timeline', e.target.value)} placeholder='e.g., Within 2 weeks' className={inputClass} />
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>Pitch Outcome</h2>

                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Owner reaction</label>
                            <div className='grid grid-cols-2 gap-2'>
                                {[
                                    ['very_interested', 'Very interested'],
                                    ['interested', 'Interested'],
                                    ['neutral', 'Neutral'],
                                    ['not_interested', 'Not interested']
                                ].map(([value, label]) => (
                                    <button
                                        key={value}
                                        type='button'
                                        onClick={() => update('reaction', value)}
                                        className={`py-2.5 rounded-lg text-xs ${form.reaction === value ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Next Action</label>
                            <select value={form.next_action} onChange={e => update('next_action', e.target.value)} className={inputClass}>
                                <option value='signup_now'>Sign up now</option>
                                <option value='demo_scheduled'>Demo scheduled</option>
                                <option value='call_later'>Call back later</option>
                                <option value='brochure'>Send brochure</option>
                                <option value='dead'>Not interested</option>
                            </select>
                        </div>

                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Objections if any</label>
                            <input value={form.objections} onChange={e => update('objections', e.target.value)} className={inputClass} />
                        </div>

                        <div>
                            <label className='block text-xs text-gray-600 dark:text-gray-400 mb-1'>Notes</label>
                            <textarea rows='4' value={form.agent_notes} onChange={e => update('agent_notes', e.target.value)} className={inputClass} />
                        </div>
                    </>
                )}
            </div>

            <div className='fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3 flex gap-2'>
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className='flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300'
                    >
                        Back
                    </button>
                )}

                {step < 3 && (
                    <button
                        onClick={() => setStep(step + 1)}
                        className='flex-[2] py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold'
                    >
                        Next
                    </button>
                )}

                {step === 3 && (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className='flex-[2] py-3 bg-green-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50'
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                )}
            </div>
        </div>
    )
}

export default AgentDataForm