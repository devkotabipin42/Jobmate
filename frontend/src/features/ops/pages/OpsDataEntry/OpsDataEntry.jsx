import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Navbar from '../../../../components/Navbar.jsx'
import useOps from '../../hooks/useOps.js'

// Fix Leaflet default marker icons (Vite/Webpack issue)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

const FLAG_LABELS = {
    gps_mismatch: 'GPS mismatch',
    duplicate: 'Duplicate entry',
    phone_invalid: 'Invalid phone format',
    photo_unclear: 'Unclear photo',
    duration_too_short: 'Visit too brief',
    duration_too_long: 'Excessive duration'
}

const REACTION_LABELS = {
    very_interested: 'Very interested',
    interested: 'Interested',
    neutral: 'Neutral',
    not_interested: 'Not interested'
}

const NEXT_ACTION_LABELS = {
    signup_now: 'Sign up now',
    demo_scheduled: 'Demo scheduled',
    call_later: 'Call back later',
    brochure: 'Send brochure',
    dead: 'Dead lead'
}

const HIRING_LABELS = {
    urgent: 'Urgently',
    soon: 'Within months',
    maybe: 'Possibly',
    no: 'Not now'
}

const OpsDataEntry = () => {
    const { loading, error, fetchPendingReviews, reviewVisitSubmission } = useOps()
    const [visits, setVisits] = useState([])
    const [selected, setSelected] = useState(null)
    const [notes, setNotes] = useState('')
    const [filterFlag, setFilterFlag] = useState('all')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => { loadVisits() }, [])

    const loadVisits = async () => {
        try {
            const data = await fetchPendingReviews()
            setVisits(data || [])
        } catch (err) {
            console.error('Failed to load visits:', err)
        }
    }

    const handleReview = async (action) => {
        if (!selected) return
        if (action === 'reject' && !notes.trim()) {
            if (!window.confirm('Reject without notes? Agent will not know what to fix.')) return
        }

        setSubmitting(true)
        try {
            await reviewVisitSubmission(selected._id, { action, review_notes: notes.trim() })
            setSelected(null)
            setNotes('')
            await loadVisits()
        } catch (err) {
            console.error('Review failed:', err)
        } finally {
            setSubmitting(false)
        }
    }

    const filteredVisits = useMemo(() => {
        if (filterFlag === 'all') return visits
        if (filterFlag === 'flagged') return visits.filter(v => v.quality_flags?.length > 0)
        if (filterFlag === 'clean') return visits.filter(v => !v.quality_flags?.length)
        return visits
    }, [visits, filterFlag])

    const getCheckInCoords = (visit) => {
        const coords = visit?.check_in?.location?.coordinates
        if (!coords || coords.length !== 2) return null
        if (coords[0] === 0 && coords[1] === 0) return null
        return { lat: coords[1], lng: coords[0] }
    }

    const getTargetCoords = (visit) => {
        const coords = visit?.task?.target_business?.location?.coordinates
        if (!coords || coords.length !== 2) return null
        if (coords[0] === 0 && coords[1] === 0) return null
        return { lat: coords[1], lng: coords[0] }
    }

    const formatDuration = (minutes) => {
        if (!minutes) return '—'
        if (minutes < 60) return `${minutes} min`
        const h = Math.floor(minutes / 60)
        const m = minutes % 60
        return `${h}h ${m}m`
    }

    const getStatsCounts = () => ({
        total: visits.length,
        flagged: visits.filter(v => v.quality_flags?.length > 0).length,
        clean: visits.filter(v => !v.quality_flags?.length).length
    })

    const counts = getStatsCounts()

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>

                {/* Header */}
                <div className='mb-6 flex flex-wrap justify-between items-end gap-4'>
                    <div>
                        <Link to='/ops' className='text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition'>
                            ← Dashboard
                        </Link>
                        <h1 className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>Review Queue</h1>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            {counts.total} pending · {counts.flagged} flagged · {counts.clean} clean
                        </p>
                    </div>

                    <div className='flex gap-2'>
                        {[
                            { key: 'all', label: `All (${counts.total})` },
                            { key: 'flagged', label: `Flagged (${counts.flagged})` },
                            { key: 'clean', label: `Clean (${counts.clean})` }
                        ].map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilterFlag(f.key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                                    filterFlag === f.key
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className='mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300'>
                        {error}
                    </div>
                )}

                <div className='grid grid-cols-1 lg:grid-cols-5 gap-4'>

                    {/* LEFT — Visits list (2/5) */}
                    <div className='lg:col-span-2 space-y-3 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-2'>
                        {filteredVisits.length === 0 && !loading && (
                            <div className='bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700'>
                                <p className='text-gray-500 dark:text-gray-400 font-medium'>
                                    {visits.length === 0 ? 'No pending reviews' : 'No matches for this filter'}
                                </p>
                                <p className='text-xs text-gray-400 mt-1'>
                                    {visits.length === 0 ? 'All field submissions are processed' : 'Try a different filter'}
                                </p>
                            </div>
                        )}

                        {loading && filteredVisits.length === 0 && (
                            <div className='bg-white dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700'>
                                <div className='animate-pulse space-y-2'>
                                    <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto'></div>
                                    <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto'></div>
                                </div>
                            </div>
                        )}

                        <AnimatePresence>
                            {filteredVisits.map(v => {
                                const isSelected = selected?._id === v._id
                                const flagCount = v.quality_flags?.length || 0

                                return (
                                    <motion.button
                                        key={v._id}
                                        layout
                                        onClick={() => { setSelected(v); setNotes(v.review_notes || '') }}
                                        whileHover={{ scale: 1.005 }}
                                        whileTap={{ scale: 0.995 }}
                                        className={`w-full text-left bg-white dark:bg-gray-800 rounded-lg p-4 border transition ${
                                            isSelected
                                                ? 'border-blue-500 ring-2 ring-blue-500/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                    >
                                        <div className='flex justify-between items-start mb-2 gap-2'>
                                            <h3 className='font-semibold text-gray-900 dark:text-white truncate'>
                                                {v.business_info?.name || v.task?.target_business?.name || 'Unknown business'}
                                            </h3>
                                            {v.review_status === 'needs_verification' && (
                                                <span className='text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 flex-shrink-0 font-medium uppercase'>
                                                    Verify
                                                </span>
                                            )}
                                        </div>

                                        <div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2'>
                                            <span>{v.agent?.full_name || 'Unknown agent'}</span>
                                            <span>·</span>
                                            <span>{new Date(v.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                                        </div>

                                        {flagCount > 0 && (
                                            <div className='flex flex-wrap gap-1'>
                                                {v.quality_flags.slice(0, 3).map((f, i) => (
                                                    <span key={i} className='text-[10px] px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'>
                                                        {FLAG_LABELS[f] || f}
                                                    </span>
                                                ))}
                                                {flagCount > 3 && (
                                                    <span className='text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'>
                                                        +{flagCount - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </motion.button>
                                )
                            })}
                        </AnimatePresence>
                    </div>

                    {/* RIGHT — Detail panel (3/5) */}
                    <div className='lg:col-span-3'>
                        {!selected ? (
                            <div className='bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700 h-full flex flex-col items-center justify-center'>
                                <p className='text-gray-500 dark:text-gray-400 font-medium'>Select a submission</p>
                                <p className='text-xs text-gray-400 mt-1'>Choose from the list to review details</p>
                            </div>
                        ) : (
                            <motion.div
                                key={selected._id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto'
                            >
                                {/* Header */}
                                <div className='px-5 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10'>
                                    <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
                                        {selected.business_info?.name || 'Untitled'}
                                    </h2>
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                                        Submitted by {selected.agent?.full_name} · {new Date(selected.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                <div className='p-5 space-y-5'>

                                    {/* Quality Issues Banner */}
                                    {selected.quality_flags?.length > 0 && (
                                        <div className='p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg'>
                                            <p className='text-xs font-semibold text-amber-800 dark:text-amber-300 mb-2 uppercase tracking-wide'>
                                                Quality Issues Detected
                                            </p>
                                            <ul className='text-sm text-amber-700 dark:text-amber-300 space-y-1'>
                                                {selected.quality_flags.map((f, i) => (
                                                    <li key={i} className='flex items-start gap-2'>
                                                        <span className='text-amber-500'>•</span>
                                                        <span>{FLAG_LABELS[f] || f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* MAP — Location Verification */}
                                    {(() => {
                                        const checkInCoords = getCheckInCoords(selected)
                                        const targetCoords = getTargetCoords(selected)

                                        if (!checkInCoords) return null

                                        const center = checkInCoords
                                        const distance = selected.check_in?.distance_from_target || 0

                                        return (
                                            <div>
                                                <div className='flex justify-between items-center mb-2'>
                                                    <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide'>
                                                        Location Verification
                                                    </h3>
                                                    
                                                    <a    href={`https://www.google.com/maps?q=${checkInCoords.lat},${checkInCoords.lng}`}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        className='text-xs text-blue-600 dark:text-blue-400 hover:underline'
                                                    >
                                                        Open in Google Maps ↗
                                                    </a>
                                                </div>
                                                <div className='h-56 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700'>
                                                    <MapContainer
                                                        center={[center.lat, center.lng]}
                                                        zoom={16}
                                                        style={{ height: '100%', width: '100%' }}
                                                        scrollWheelZoom={false}
                                                    >
                                                        <TileLayer
                                                            attribution='&copy; OpenStreetMap contributors'
                                                            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                                                        />
                                                        <Marker position={[checkInCoords.lat, checkInCoords.lng]}>
                                                            <Popup>
                                                                <strong>Agent check-in</strong><br />
                                                                {selected.agent?.full_name}<br />
                                                                {new Date(selected.check_in?.timestamp).toLocaleString()}
                                                            </Popup>
                                                        </Marker>
                                                        {targetCoords && (
                                                            <CircleMarker
                                                                center={[targetCoords.lat, targetCoords.lng]}
                                                                radius={8}
                                                                pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.5 }}
                                                            >
                                                                <Popup>
                                                                    <strong>Target location</strong><br />
                                                                    {selected.task?.target_business?.name}
                                                                </Popup>
                                                            </CircleMarker>
                                                        )}
                                                    </MapContainer>
                                                </div>
                                                <div className='grid grid-cols-3 gap-2 mt-2 text-xs'>
                                                    <div className='bg-gray-50 dark:bg-gray-900/50 rounded p-2'>
                                                        <p className='text-gray-500 dark:text-gray-400'>Distance</p>
                                                        <p className={`font-semibold ${distance > 100 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                                            {distance}m
                                                        </p>
                                                    </div>
                                                    <div className='bg-gray-50 dark:bg-gray-900/50 rounded p-2'>
                                                        <p className='text-gray-500 dark:text-gray-400'>GPS Accuracy</p>
                                                        <p className='font-semibold text-gray-900 dark:text-white'>
                                                            {Math.round(selected.check_in?.gps_accuracy || 0)}m
                                                        </p>
                                                    </div>
                                                    <div className='bg-gray-50 dark:bg-gray-900/50 rounded p-2'>
                                                        <p className='text-gray-500 dark:text-gray-400'>Duration</p>
                                                        <p className='font-semibold text-gray-900 dark:text-white'>
                                                            {formatDuration(selected.duration_minutes)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className='text-[10px] text-gray-400 mt-1 font-mono'>
                                                    {checkInCoords.lat.toFixed(6)}, {checkInCoords.lng.toFixed(6)}
                                                </p>
                                            </div>
                                        )
                                    })()}

                                    {/* Business Info */}
                                    <div>
                                        <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2'>
                                            Business Information
                                        </h3>
                                        <div className='bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 space-y-1.5 text-sm'>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500 dark:text-gray-400'>Owner</span>
                                                <span className='text-gray-900 dark:text-white font-medium'>{selected.business_info?.owner_name || '—'}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500 dark:text-gray-400'>Phone</span>
                                                <span className='text-gray-900 dark:text-white font-medium font-mono'>{selected.business_info?.owner_phone || '—'}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500 dark:text-gray-400'>WhatsApp</span>
                                                <span className='text-gray-900 dark:text-white font-medium font-mono'>{selected.business_info?.whatsapp || '—'}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500 dark:text-gray-400'>Type</span>
                                                <span className='text-gray-900 dark:text-white font-medium capitalize'>{selected.business_info?.type || '—'}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500 dark:text-gray-400'>Staff count</span>
                                                <span className='text-gray-900 dark:text-white font-medium'>{selected.business_info?.staff_count ?? '—'}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='text-gray-500 dark:text-gray-400'>Years in business</span>
                                                <span className='text-gray-900 dark:text-white font-medium'>{selected.business_info?.years_in_business ?? '—'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hiring Needs */}
                                    {selected.hiring_needs && (
                                        <div>
                                            <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2'>
                                                Hiring Needs
                                            </h3>
                                            <div className='bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 space-y-1.5 text-sm'>
                                                <div className='flex justify-between'>
                                                    <span className='text-gray-500 dark:text-gray-400'>Looking to hire</span>
                                                    <span className='text-gray-900 dark:text-white font-medium'>
                                                        {HIRING_LABELS[selected.hiring_needs.looking_to_hire] || '—'}
                                                    </span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-gray-500 dark:text-gray-400'>Positions</span>
                                                    <span className='text-gray-900 dark:text-white font-medium'>{selected.hiring_needs.positions || '—'}</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-gray-500 dark:text-gray-400'>Budget range</span>
                                                    <span className='text-gray-900 dark:text-white font-medium'>
                                                        {selected.hiring_needs.budget_min || selected.hiring_needs.budget_max
                                                            ? `NPR ${selected.hiring_needs.budget_min?.toLocaleString() || 0} - ${selected.hiring_needs.budget_max?.toLocaleString() || 0}`
                                                            : '—'}
                                                    </span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-gray-500 dark:text-gray-400'>Timeline</span>
                                                    <span className='text-gray-900 dark:text-white font-medium'>{selected.hiring_needs.timeline || '—'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Pitch Outcome */}
                                    {selected.pitch_outcome && (
                                        <div>
                                            <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2'>
                                                Pitch Outcome
                                            </h3>
                                            <div className='bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 space-y-1.5 text-sm'>
                                                <div className='flex justify-between'>
                                                    <span className='text-gray-500 dark:text-gray-400'>Reaction</span>
                                                    <span className='text-gray-900 dark:text-white font-medium'>
                                                        {REACTION_LABELS[selected.pitch_outcome.reaction] || '—'}
                                                    </span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-gray-500 dark:text-gray-400'>Next action</span>
                                                    <span className='text-gray-900 dark:text-white font-medium'>
                                                        {NEXT_ACTION_LABELS[selected.pitch_outcome.next_action] || '—'}
                                                    </span>
                                                </div>
                                                {selected.pitch_outcome.objections && (
                                                    <div className='pt-1.5 border-t border-gray-200 dark:border-gray-700'>
                                                        <p className='text-gray-500 dark:text-gray-400 mb-1'>Objections</p>
                                                        <p className='text-gray-900 dark:text-white'>{selected.pitch_outcome.objections}</p>
                                                    </div>
                                                )}
                                                {selected.pitch_outcome.agent_notes && (
                                                    <div className='pt-1.5 border-t border-gray-200 dark:border-gray-700'>
                                                        <p className='text-gray-500 dark:text-gray-400 mb-1'>Agent notes</p>
                                                        <p className='text-gray-900 dark:text-white whitespace-pre-wrap'>{selected.pitch_outcome.agent_notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Photos */}
                                    {(selected.proofs?.shop_photo_url || selected.proofs?.owner_selfie_url || selected.proofs?.visiting_card_url) && (
                                        <div>
                                            <h3 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2'>
                                                Visit Proofs
                                            </h3>
                                            <div className='grid grid-cols-3 gap-2'>
                                                {selected.proofs?.shop_photo_url && (
                                                    <a href={selected.proofs.shop_photo_url} target='_blank' rel='noopener noreferrer'>
                                                        <img src={selected.proofs.shop_photo_url} alt='Shop' className='w-full h-24 object-cover rounded border border-gray-200 dark:border-gray-700' />
                                                        <p className='text-[10px] text-gray-500 mt-1 text-center'>Shop</p>
                                                    </a>
                                                )}
                                                {selected.proofs?.owner_selfie_url && (
                                                    <a href={selected.proofs.owner_selfie_url} target='_blank' rel='noopener noreferrer'>
                                                        <img src={selected.proofs.owner_selfie_url} alt='Selfie' className='w-full h-24 object-cover rounded border border-gray-200 dark:border-gray-700' />
                                                        <p className='text-[10px] text-gray-500 mt-1 text-center'>Selfie</p>
                                                    </a>
                                                )}
                                                {selected.proofs?.visiting_card_url && (
                                                    <a href={selected.proofs.visiting_card_url} target='_blank' rel='noopener noreferrer'>
                                                        <img src={selected.proofs.visiting_card_url} alt='Card' className='w-full h-24 object-cover rounded border border-gray-200 dark:border-gray-700' />
                                                        <p className='text-[10px] text-gray-500 mt-1 text-center'>Card</p>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Review Notes Input */}
                                    <div>
                                        <label className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block'>
                                            Review Notes {selected.quality_flags?.length > 0 && <span className='text-red-500 normal-case font-normal'>(recommended for rejection)</span>}
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                            rows='3'
                                            placeholder='Add notes for the agent — what was wrong, what to fix, etc.'
                                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className='flex gap-2 pt-2 sticky bottom-0 bg-white dark:bg-gray-800 -mx-5 -mb-5 px-5 py-4 border-t border-gray-200 dark:border-gray-700'>
                                        <button
                                            onClick={() => handleReview('reject')}
                                            disabled={submitting}
                                            className='flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50'
                                        >
                                            {submitting ? '...' : 'Reject'}
                                        </button>
                                        <button
                                            onClick={() => handleReview('approve')}
                                            disabled={submitting}
                                            className='flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50'
                                        >
                                            {submitting ? '...' : 'Approve & Save to CRM'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OpsDataEntry