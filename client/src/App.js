// Main App component with routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Jobs from './pages/Jobs/Jobs';
import JobDetails from './pages/JobDetails/JobDetails';
import PostJob from './pages/PostJob/PostJob';
import MyJobs from './pages/MyJobs/MyJobs';
import MyApplications from './pages/MyApplications/MyApplications';
import Applications from './pages/Applications/Applications';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <div className="App">
                    <Header />
                    <main style={{ minHeight: 'calc(100vh - 160px)' }}>
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/jobs" element={<Jobs />} />
                            <Route path="/jobs/:id" element={<JobDetails />} />

                            {/* Protected routes for job seekers */}
                            <Route
                                path="/my-applications"
                                element={
                                    <ProtectedRoute role="jobseeker">
                                        <MyApplications />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Protected routes for employers */}
                            <Route
                                path="/post-job"
                                element={
                                    <ProtectedRoute role="employer">
                                        <PostJob />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/my-jobs"
                                element={
                                    <ProtectedRoute role="employer">
                                        <MyJobs />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/applications/:jobId"
                                element={
                                    <ProtectedRoute role="employer">
                                        <Applications />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
