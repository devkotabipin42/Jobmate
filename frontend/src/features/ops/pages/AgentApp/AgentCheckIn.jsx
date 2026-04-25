import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import useOps from '../../hooks/useOps.js'

const AgentCheckIn = () => {
    const { taskId } = useParams()
    const navigate = useNavigate()
    const { fetchMyTasks } = useOps()
    const [task, setTask] = useState(null)
    const [location, setLocation] = useState(null)
    const [gpsError, setGpsError] = useState('')
    const [gettingGps, setGettingGps] = useState(false)

    useEffect(() => { load() }, [])

    const load = async () => {
        try {
            const tasks = await fetchMyTasks()
            const t = (tasks || []).find(x => x._id === taskId)
            setTask(t)
        } catch (err) { console.error(err) }
    }

    const getLocation = () => {
        setGettingGps(true)
        setGpsError('')
        if (!navigator.geolocation) {
            setGpsError('GPS not supported on this device')
            setGettingGps(false)
            return
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    accuracy: pos.coords.accuracy,
                    timestamp: new Date().toISOString()
                })
                setGettingGps(false)
            },
            (err) => {
                setGpsError(err.message || 'Could not get location')
                setGettingGps(false)
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }

    const proceed = () => {
        localStorage.setItem(`checkin_${taskId}`, JSON.stringify({ location, checkin_time: new Date().toISOString() }))
        navigate(`/agent/form/${taskId}`)
    }

    // EARLY RETURN — wait for task to load
    if (!task) {
        return <div className='min-h-screen flex items-center justify-center text-gray-500'>Loading...</div>
    }

    // Now task is guaranteed to exist
    const hasTargetLocation = () => {
        const coords = task.target_business?.location?.coordinates
        return coords && coords.length === 2 && (coords[0] !== 0 || coords[1] !== 0)
    }

    const distance = () => {
        if (!location || !hasTargetLocation()) return null
        const [tLng, tLat] = task.target_business.location.coordinates
        const R = 6371000
        const toRad = d => d * Math.PI / 180
        const dLat = toRad(tLat - location.lat)
        const dLng = toRad(tLng - location.lng)
        const a = Math.sin(dLat/2)**2 + Math.cos(toRad(location.lat)) * Math.cos(toRad(tLat)) * Math.sin(dLng/2)**2
        return Math.round(R * 2 * Math.asin(Math.sqrt(a)))
    }

    const dist = distance()
    const noTargetGps = !hasTargetLocation()
    const gpsOk = noTargetGps ? !!location : (dist !== null && dist <= 150)

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3'>
                <Link to='/agent' className='text-2xl text-gray-600 dark:text-gray-300'>←</Link>
                <div>
                    <p className='text-xs text-gray-500'>Check-in</p>
                    <p className='text-sm font-semibold text-gray-900 dark:text-white'>{task.target_business?.name}</p>
                </div>
            </div>

            <div className='p-4 space-y-4'>
                <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>Address</p>
                    <p className='text-sm text-gray-900 dark:text-white mt-1'>{task.target_business?.address}</p>
                </div>

                <div className='bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
                    <p className='text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-2'>Step 1 — Verify Location</p>

                    {!location && (
                        <button onClick={getLocation} disabled={gettingGps} className='w-full py-3 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50'>
                            {gettingGps ? 'Fetching location...' : 'Get current location'}
                        </button>
                    )}

                    {gpsError && <p className='text-xs text-red-600 mt-2'>{gpsError}</p>}

                    {location && (
                        <div className={`p-3 rounded-lg ${gpsOk ? 'bg-green-50 dark:bg-green-900/20 border border-green-300' : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-300'}`}>
                            <p className={`text-sm font-semibold ${gpsOk ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>
                                {noTargetGps ? 'Location captured — first visit' : (gpsOk ? 'Location verified' : 'Location does not match')}
                            </p>
                            {noTargetGps ? (
                                <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>This GPS will be saved as the business location. GPS accuracy: {Math.round(location.accuracy)}m</p>
                            ) : (
                                <p className='text-xs text-gray-600 dark:text-gray-400 mt-1'>Distance from target: {dist}m · GPS accuracy: {Math.round(location.accuracy)}m</p>
                            )}
                            {!gpsOk && !noTargetGps && <p className='text-xs text-amber-700 dark:text-amber-300 mt-2'>Please move closer to the target location.</p>}
                            <button onClick={getLocation} className='text-xs text-blue-600 mt-2'>Retry</button>
                        </div>
                    )}
                </div>

                {task.notes_for_agent && (
                    <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3'>
                        <p className='text-xs text-blue-700 dark:text-blue-300 font-semibold mb-1'>Notes from supervisor:</p>
                        <p className='text-sm text-blue-900 dark:text-blue-200'>{task.notes_for_agent}</p>
                    </div>
                )}

                <button onClick={proceed} disabled={!location} className='w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-40'>
                    {gpsOk ? 'Continue to details' : location ? 'Continue anyway' : 'Location required'}
                </button>
                <p className='text-center text-xs text-gray-500'>Data will save offline and sync when online</p>
            </div>
        </div>
    )
}

export default AgentCheckIn