// JobHunt Landing Page - Modern Professional Design
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const { isAuthenticated, hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured jobs when component mounts
  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  // Function to fetch latest jobs for featured section
  const fetchFeaturedJobs = async () => {
    try {
      const response = await axios.get('/api/jobs');
      // Get the latest 3 jobs sorted by creation date
      const sortedJobs = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setFeaturedJobs(sortedJobs);
    } catch (error) {
      console.error('Fetch featured jobs error:', error);
      // If API fails, show empty array
      setFeaturedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/jobs?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format salary function
  const formatSalary = (salary) => {
    if (typeof salary === 'number') {
      return `$${salary.toLocaleString()}`;
    }
    return salary || 'Salary not specified';
  };

  return (
    <div className="jobhunt-landing">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          {/* Badge */}
          <div className="hero-badge">
            <span className="badge-text">No. 1 Job Hunt Website</span>
          </div>

          {/* Main Heading */}
          <h1 className="hero-title">
            Search, Apply & <br />
            Get Your <span className="dream-jobs-text">Dream Jobs</span>
          </h1>

          {/* Subtext */}
          <p className="hero-description">
            Discover thousands of job opportunities from top companies worldwide. 
            Your perfect career match is just a search away.
          </p>

          {/* Search Bar */}
          <div className="hero-search-container">
            <form onSubmit={handleSearch} className="hero-search-form">
              <div className="search-input-wrapper">
                <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search for jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button type="submit" className="search-button">
                Search Jobs
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="latest-jobs-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest Job Opportunities</h2>
            <p className="section-subtitle">
              Discover the most recent opportunities from leading companies
            </p>
          </div>

          <div className="home-jobs-grid">
            {loading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading latest opportunities...</p>
              </div>
            ) : featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <div key={job._id} className="job-card">
                  <div className="job-card-header">
                    <div className="company-logo">
                      {job.company?.charAt(0) || 'J'}
                    </div>
                    <div className="job-meta">
                      <h3 className="job-title">{job.title}</h3>
                      <div className="company-info">
                        <span className="company-name">{job.company}</span>
                        <span className="job-location">📍 {job.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="job-details">
                    <div className="job-tags">
                      {job.type && <span className="job-type">{job.type}</span>}
                      <span className="job-salary">{formatSalary(job.salary)}</span>
                    </div>
                    <div className="job-posted">{formatDate(job.createdAt)}</div>
                  </div>
                  
                  <div className="job-actions">
                    <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-jobs-message">
                <p>No job openings available at the moment. Check back soon!</p>
              </div>
            )}
          </div>

          <div className="view-all-jobs">
            <Link to="/jobs" className="btn btn-dark btn-lg">
              View All Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
