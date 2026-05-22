// Jobs listing page component
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch jobs when component mounts
  useEffect(() => {
    fetchJobs();
  }, []);

  // Check for search parameter in URL when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, []);

  // Function to fetch all jobs
  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs');
      setJobs(response.data);
      setFilteredJobs(response.data); // Initialize filtered jobs
    } catch (error) {
      console.error('Fetch jobs error:', error);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
    } else {
      const searchTermLower = searchTerm.toLowerCase().trim();
      const filtered = jobs.filter(job => {
        // Primary focus on job role/title
        const title = job.title?.toLowerCase() || '';
        
        // Also search in company and location as secondary matches
        const company = job.company?.toLowerCase() || '';
        const location = job.location?.toLowerCase() || '';
        
        // Search in requirements if available
        const requirementsMatch = job.requirements?.some(req => 
          req.toLowerCase().includes(searchTermLower)
        ) || false;
        
        return title.includes(searchTermLower) || 
               company.includes(searchTermLower) || 
               location.includes(searchTermLower) ||
               requirementsMatch;
      });
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Filter is already handled by useEffect, but this prevents page refresh
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading amazing job opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fadeIn">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">
            <span>🔍</span> Available Jobs
          </h1>
          <p className="page-description">
            Discover your next career opportunity from our curated list of job openings
          </p>
        </div>

        {/* Show error message */}
        {error && (
          <div className="alert alert-error">
            <span>❌</span>
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="search-section">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-container">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search for job roles (e.g., Frontend Developer, Designer, Data Analyst)"
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
                aria-label="Search jobs"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="clear-search-btn"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>
          
          {searchTerm && (
            <div className="search-results-info">
              <span>
                {filteredJobs.length > 0 
                  ? `Found ${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} matching "${searchTerm}"`
                  : `No jobs found matching "${searchTerm}" - try a different job role`
                }
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 'var(--space-2xl)' }}>
          <div className="stat-card">
            <div className="stat-number">{filteredJobs.length}</div>
            <div className="stat-label">
              {searchTerm ? 'Matching Jobs' : 'Available Jobs'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{new Set(filteredJobs.map(job => job.company)).size}</div>
            <div className="stat-label">Companies Hiring</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{new Set(filteredJobs.map(job => job.location)).size}</div>
            <div className="stat-label">Locations</div>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 && searchTerm ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No result found</h3>
            <p className="empty-state-description">
              We couldn't find any jobs matching "{searchTerm}". Try adjusting your search terms (e.g., "Developer" instead of "Software Developer") or{' '}
              <button 
                onClick={clearSearch}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'var(--primary-purple)', 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  font: 'inherit'
                }}
              >
                view all jobs
              </button>.
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3 className="empty-state-title">No Jobs Available</h3>
            <p className="empty-state-description">
              There are no job postings available at the moment. Check back later for new opportunities!
            </p>
          </div>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <div key={job._id} className="card job-card">
                {/* Job Header */}
                <div className="card-header">
                  <h3 className="card-title">
                    <Link 
                      to={`/jobs/${job._id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {job.title}
                    </Link>
                  </h3>
                  <div className="job-company">
                    <span>🏢</span> {job.company}
                  </div>
                </div>

                {/* Job Details */}
                <div className="card-body">
                  <div className="job-location">
                    <span>📍</span> {job.location}
                  </div>
                  
                  {job.type && (
                    <div style={{ marginBottom: 'var(--space-md)' }}>
                      <span className={`job-type ${job.type.toLowerCase().replace(' ', '-')}`}>
                        {job.type}
                      </span>
                    </div>
                  )}

                  <p className="card-text">
                    {job.description.length > 120 
                      ? `${job.description.substring(0, 120)}...` 
                      : job.description
                    }
                  </p>

                  {job.requirements && job.requirements.length > 0 && (
                    <div style={{ marginTop: 'var(--space-md)' }}>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        color: 'var(--text-muted)', 
                        marginBottom: 'var(--space-xs)' 
                      }}>
                        Key Requirements:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }}>
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span 
                            key={index}
                            style={{
                              background: 'var(--gray-100)',
                              color: 'var(--text-secondary)',
                              padding: 'var(--space-xs) var(--space-sm)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem',
                              fontWeight: 500
                            }}
                          >
                            {req}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span style={{ 
                            fontSize: '0.75rem', 
                            color: 'var(--text-muted)' 
                          }}>
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Job Footer */}
                <div className="card-footer">
                  <div>
                    {job.salary && (
                      <div className="job-salary">
                        💰 ${job.salary.toLocaleString()}
                      </div>
                    )}
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: 'var(--text-muted)' 
                    }}>
                      Posted {formatDate(job.createdAt)}
                    </div>
                  </div>
                  
                  <Link 
                    to={`/jobs/${job._id}`} 
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
