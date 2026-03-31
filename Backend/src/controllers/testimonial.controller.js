import Testimonial from '../models/Testimonial.model.js'

// User — submit testimonial
export const submitTestimonial = async (req, res) => {
    try {
        const { name, role, company, text, rating } = req.body

        const testimonial = await Testimonial.create({
            name,
            role,
            company,
            text,
            rating: rating || 5,
            user: req.user._id
        })

        res.status(201).json({
            message: 'Testimonial submitted — pending review',
            testimonial
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Public — get approved testimonials
export const getApprovedTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ status: 'approved' })
            .sort({ is_featured: -1, createdAt: -1 })
            .limit(6)

        res.status(200).json({ testimonials })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin — get all testimonials
export const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find()
            .sort({ createdAt: -1 })

        res.status(200).json({ testimonials })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin — approve testimonial
export const approveTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        )
        res.status(200).json({ message: 'Testimonial approved', testimonial })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin — reject testimonial
export const rejectTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        )
        res.status(200).json({ message: 'Testimonial rejected', testimonial })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin — toggle featured
export const toggleFeatured = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id)
        testimonial.is_featured = !testimonial.is_featured
        await testimonial.save()
        res.status(200).json({ message: 'Updated', testimonial })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Admin — delete testimonial
export const deleteTestimonial = async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Testimonial deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}