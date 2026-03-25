import { Routes, Route } from 'react-router-dom'

// Pages
import Home from '../features/jobs/pages/Home.jsx'
import JobList from '../features/jobs/pages/JobList.jsx'
import JobDetail from '../features/jobs/pages/JobDetail.jsx'
import CompanyProfile from '../features/jobs/pages/CompanyProfile.jsx'
import About from '../features/jobs/pages/About.jsx'
import Contact from '../features/jobs/pages/Contact.jsx'
import Privacy from '../features/jobs/pages/Privacy.jsx'
import Terms from '../features/jobs/pages/Terms.jsx'
// Auth
import Login from '../features/auth/pages/Login.jsx'
import Register from '../features/auth/pages/Register.jsx'

// Employer
import EmployerDashboard from '../features/employer/pages/EmployerDashboard.jsx'
import PostJob from '../features/employer/pages/PostJob.jsx'
import ManageJobs from '../features/employer/pages/ManageJobs.jsx'

// Job Seeker
import Profile from '../features/jobseeker/pages/Profile.jsx'
import MyApplications from '../features/jobseeker/pages/MyApplications.jsx'
import SavedJobs from '../features/jobseeker/pages/SavedJobs.jsx'

// Protected Route
import Protected from '../components/Protected.jsx'
import Companies from '../features/jobs/pages/Companies.jsx'
import CareerTips from '../features/jobs/pages/CareerTips.jsx'
//Admin
import AdminPanel from '../features/jobs/pages/AdminPanel.jsx'

// mistralai
import ResumeScorer from '../features/jobseeker/pages/ResumeScorer.jsx'
const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/jobs' element={<JobList />} />
            <Route path='/jobs/:id' element={<JobDetail />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/companies' element={<Companies />} />
            <Route path='/career-tips' element={<CareerTips />} />
            <Route path='/company/:id' element={<CompanyProfile />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/privacy' element={<Privacy />} />
            <Route path='/terms' element={<Terms />} />
            <Route path='/resume-scorer' element={
                    <Protected role='jobseeker'>
                     <ResumeScorer />
                    </Protected>
                    } />
            {/* Job Seeker Routes — Protected */}
            <Route path='/profile' element={
                <Protected role='jobseeker'>
                    <Profile />
                </Protected>
            } />
            <Route path='/my-applications' element={
                <Protected role='jobseeker'>
                    <MyApplications />
                </Protected>
            } />
            <Route path='/saved-jobs' element={
                <Protected role='jobseeker'>
                    <SavedJobs />
                </Protected>
            } />

            {/* Employer Routes — Protected */}
            <Route path='/employer/dashboard' element={
                <Protected role='employer'>
                    <EmployerDashboard />
                </Protected>
            } />
            <Route path='/employer/post-job' element={
                <Protected role='employer'>
                    <PostJob />
                </Protected>
            } />
            <Route path='/employer/manage-jobs' element={
                <Protected role='employer'>
                    <ManageJobs />
                </Protected>
            } />
            <Route path='/admin' element={
    <Protected role='admin'>
        <AdminPanel />
    </Protected>
} />
        </Routes>
    )
}

export default AppRoutes