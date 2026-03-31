import CRM from '../models/CRM.model.js'

export const getCandidates = async (req, res) => {
    try {
        const candidates = await CRM.find({ employer: req.user._id })
            .populate('job', 'title')
            .sort({ createdAt: -1 })
        res.status(200).json({ candidates })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const addCandidate = async (req, res) => {
    try {
        const candidate = await CRM.create({
            ...req.body,
            employer: req.user._id
        })
        res.status(201).json({ message: 'Candidate added', candidate })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateCandidateStatus = async (req, res) => {
    try {
        const candidate = await CRM.findOneAndUpdate(
            { _id: req.params.id, employer: req.user._id },
            { status: req.body.status },
            { new: true }
        )
        res.status(200).json({ message: 'Status updated', candidate })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const addNote = async (req, res) => {
    try {
        const candidate = await CRM.findOneAndUpdate(
            { _id: req.params.id, employer: req.user._id },
            { $push: { notes: { text: req.body.text } } },
            { new: true }
        )
        res.status(200).json({ message: 'Note added', candidate })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const setFollowUp = async (req, res) => {
    try {
        const candidate = await CRM.findOneAndUpdate(
            { _id: req.params.id, employer: req.user._id },
            { follow_up_date: req.body.follow_up_date },
            { new: true }
        )
        res.status(200).json({ message: 'Follow up set', candidate })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteCandidate = async (req, res) => {
    try {
        await CRM.findOneAndDelete({ _id: req.params.id, employer: req.user._id })
        res.status(200).json({ message: 'Candidate deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}