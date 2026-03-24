import { Routes, Route } from 'react-router-dom'

// Pages
import Home from '../features/jobs/pages/Home.jsx'
import JobList from '../features/jobs/pages/JobList.jsx'
import JobDetail from '../features/jobs/pages/JobDetail.jsx'

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

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/jobs' element={<JobList />} />
            <Route path='/jobs/:id' element={<JobDetail />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

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
        </Routes>
    )
}

export default AppRoutes