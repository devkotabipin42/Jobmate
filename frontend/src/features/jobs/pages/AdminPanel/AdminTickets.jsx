import { motion } from 'framer-motion'

const AdminTickets = ({ tickets, selectedTicket, setSelectedTicket, replyText, setReplyText, replyTicket, updateTicketStatus, setTickets }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className='flex items-center justify-between mb-6'>
            <div>
                <h2 className='text-xl font-bold text-gray-800 dark:text-white'>Support Tickets</h2>
                <p className='text-sm text-gray-500 dark:text-white/40 mt-1'>{tickets.length} total tickets</p>
            </div>
            <div className='flex gap-2'>
                <span className='text-xs bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1.5 rounded-full font-medium'>
                    {tickets.filter(t => t.status === 'open').length} Open
                </span>
                <span className='text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-full font-medium'>
                    {tickets.filter(t => t.status === 'in_progress').length} In Progress
                </span>
            </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Ticket List */}
            <div className='space-y-2'>
                {tickets.length === 0 ? (
                    <div className='text-center py-16 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                        <p className='text-gray-800 dark:text-white font-semibold'>No tickets yet</p>
                        <p className='text-sm text-gray-400 dark:text-white/30 mt-1'>All clear!</p>
                    </div>
                ) : tickets.map((ticket, i) => (
                    <div key={ticket._id} onClick={() => setSelectedTicket(ticket)}
                        className={`bg-white dark:bg-white/3 border rounded-2xl p-4 cursor-pointer transition-all ${
                            selectedTicket?._id === ticket._id
                                ? 'border-purple-500 dark:border-purple-500/50 ring-1 ring-purple-500/10'
                                : 'border-gray-200 dark:border-white/7 hover:border-purple-300 dark:hover:border-purple-500/30'
                        }`}>
                        <div className='flex items-start justify-between gap-2 mb-2'>
                            <p className='text-sm font-medium text-gray-800 dark:text-white truncate'>{ticket.subject}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                                ticket.status === 'open' ? 'bg-blue-500/10 text-blue-500' :
                                ticket.status === 'in_progress' ? 'bg-amber-500/10 text-amber-500' :
                                ticket.status === 'resolved' ? 'bg-green-500/10 text-green-500' :
                                'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/35'
                            }`}>
                                {ticket.status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className='text-xs text-gray-500 dark:text-white/35'>{ticket.name} · {ticket.email}</p>
                        <div className='flex items-center gap-2 mt-1.5'>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                ticket.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                                ticket.priority === 'medium' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/35'
                            }`}>
                                {ticket.priority}
                            </span>
                            <span className='text-xs text-gray-400 dark:text-white/25'>
                                {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ticket Detail */}
            {selectedTicket ? (
                <div className='bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl p-5 h-fit'>
                    <div className='flex items-start justify-between mb-4'>
                        <div>
                            <h3 className='text-sm font-semibold text-gray-800 dark:text-white mb-0.5'>{selectedTicket.subject}</h3>
                            <p className='text-xs text-gray-500 dark:text-white/35'>{selectedTicket.name} · {selectedTicket.email}</p>
                        </div>
                        <select value={selectedTicket.status}
                            onChange={async (e) => {
                                await updateTicketStatus(selectedTicket._id, e.target.value)
                                setTickets(prev => prev.map(t => t._id === selectedTicket._id ? { ...t, status: e.target.value } : t))
                                setSelectedTicket(prev => ({ ...prev, status: e.target.value }))
                            }}
                            className='text-xs border border-gray-200 dark:border-white/8 rounded-lg px-2 py-1.5 bg-white dark:bg-white/5 dark:text-white outline-none cursor-pointer'>
                            <option value='open'>Open</option>
                            <option value='in_progress'>In Progress</option>
                            <option value='resolved'>Resolved</option>
                            <option value='closed'>Closed</option>
                        </select>
                    </div>

                    <div className='bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 rounded-xl p-3 mb-4'>
                        <p className='text-xs text-gray-600 dark:text-white/50'>{selectedTicket.message}</p>
                    </div>

                    {selectedTicket.replies?.length > 0 && (
                        <div className='space-y-2 mb-4'>
                            {selectedTicket.replies.map((reply, i) => (
                                <div key={i} className={`rounded-xl p-3 ${
                                    reply.isAdmin
                                        ? 'bg-purple-500/10 border border-purple-500/20'
                                        : 'bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5'
                                }`}>
                                    <p className={`text-xs font-medium mb-1 ${reply.isAdmin ? 'text-purple-500' : 'text-gray-700 dark:text-white/60'}`}>
                                        {reply.isAdmin ? 'Support Team' : selectedTicket.name}
                                    </p>
                                    <p className='text-xs text-gray-600 dark:text-white/45'>{reply.message}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className='space-y-2'>
                        <textarea placeholder='Type your reply...' value={replyText} onChange={e => setReplyText(e.target.value)} rows={3}
                            className='w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl px-3 py-2 text-xs outline-none focus:border-purple-500 dark:text-white placeholder-gray-400 dark:placeholder-white/20 resize-none' />
                        <button onClick={async () => {
                            if (!replyText.trim()) return
                            const updated = await replyTicket(selectedTicket._id, replyText)
                            if (updated) {
                                setSelectedTicket(updated)
                                setTickets(prev => prev.map(t => t._id === updated._id ? updated : t))
                                setReplyText('')
                            }
                        }} className='w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl text-xs font-semibold transition-colors'>
                            Send Reply
                        </button>
                    </div>
                </div>
            ) : (
                <div className='text-center py-16 bg-white dark:bg-white/3 border border-gray-200 dark:border-white/7 rounded-2xl'>
                    <p className='text-sm text-gray-500 dark:text-white/35'>Select a ticket to reply</p>
                </div>
            )}
        </div>
    </motion.div>
)

export default AdminTickets