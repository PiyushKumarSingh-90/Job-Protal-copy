// Applications page for employers to view job applications
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Applications.css';

const Applications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Fetch applications when component mounts
  useEffect(() => {
    fetchApplications();
    fetchJobDetails();
  }, [jobId]);

  // Function to fetch applications for the job
  const fetchApplications = async () => {
    try {
      const response = await axios.get(`/api/applications/job/${jobId}`);
      setApplications(response.data);
    } catch (error) {
      console.error('Fetch applications error:', error);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch job details
  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`/api/jobs/${jobId}`);
      setJob(response.data);
    } catch (error) {
      console.error('Fetch job details error:', error);
    }
  };

  // Function to update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId);
    
    try {
      const response = await axios.put(`/api/applications/${applicationId}/status`, {
        status: newStatus
      });

      // Update the application in the list
      setApplications(applications.map(app => 
        app._id === applicationId 
          ? { ...app, status: newStatus }
          : app
      ));

    } catch (error) {
      console.error('Update status error:', error);
      setError('Failed to update application status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status style class
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'reviewed':
        return 'status-reviewed';
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  // Get status display text
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '⏳ Pending';
      case 'reviewed':
        return '👀 Reviewed';
      case 'accepted':
        return '✅ Accepted';
      case 'rejected':
        return '❌ Rejected';
      default:
        return status;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ padding: '2rem 0' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/my-jobs" className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
            ← Back to My Jobs
          </Link>
          
          {job && (
            <div>
              <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
                Applications for: {job.title}
              </h1>
              <p style={{ color: '#666' }}>
                {job.company} • {job.location}
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Applications count */}
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Received {applications.length} application{applications.length !== 1 ? 's' : ''}
        </p>

        {/* Applications list */}
        {applications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No Applications Yet</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              No one has applied for this job yet. Be patient, great candidates will come!
            </p>
            <Link to={`/jobs/${jobId}`} className="btn btn-primary">
              View Job Posting
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {applications.map((application) => (
              <div key={application._id} className="card">
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '1fr 300px',
                  gap: '2rem',
                  alignItems: 'start'
                }}>
                  {/* Application Details */}
                  <div>
                    {/* Applicant Info */}
                    <div style={{ marginBottom: '1rem' }}>
                      <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
                        {application.name}
                      </h3>
                      
                      <div style={{ 
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ color: '#666' }}>
                          📧 {application.email}
                        </span>
                        <span style={{ color: '#666' }}>
                          📱 {application.phone}
                        </span>
                      </div>
                      
                      <p style={{ fontSize: '0.9rem', color: '#999' }}>
                        Applied on {formatDate(application.appliedAt)}
                      </p>
                    </div>

                    {/* Cover Letter */}
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
                        Cover Letter:
                      </h4>
                      <div style={{ 
                        backgroundColor: '#f8f9fa',
                        padding: '1rem',
                        borderRadius: '4px',
                        lineHeight: '1.6',
                        color: '#444'
                      }}>
                        {application.coverLetter}
                      </div>
                    </div>

                    {/* Resume Section */}
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
                        Resume:
                      </h4>
                      {application.resume ? (
                        <div style={{ 
                          backgroundColor: '#f8f9fa',
                          padding: '1rem',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{ color: '#666', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            📄 Resume uploaded
                          </span>
                          <a 
                            href={`http://localhost:5001/${application.resume}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ 
                              fontSize: '0.9rem', 
                              padding: '0.5rem 1rem',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            🔗 View Resume
                          </a>
                          <a 
                            href={`http://localhost:5001/${application.resume}`} 
                            download
                            className="btn btn-secondary"
                            style={{ 
                              fontSize: '0.9rem', 
                              padding: '0.5rem 1rem',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            💾 Download
                          </a>
                        </div>
                      ) : (
                        <div style={{ 
                          backgroundColor: '#f8f9fa',
                          padding: '1rem',
                          borderRadius: '4px',
                          color: '#999',
                          fontStyle: 'italic'
                        }}>
                          ❌ No resume uploaded
                        </div>
                      )}
                    </div>

                    {/* Current Status */}
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Current Status: </strong>
                      <span className={getStatusClass(application.status)}>
                        {getStatusText(application.status)}
                      </span>
                    </div>
                  </div>

                  {/* Status Update Panel */}
                  <div style={{ 
                    width: '100%',
                    height: 'fit-content',
                    padding: '1.5rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                  }}>
                    <h4 style={{ 
                      color: '#2c3e50', 
                      marginTop: 0,
                      marginBottom: '1.5rem',
                      fontSize: '1.1rem',
                      textAlign: 'center'
                    }}>
                      Update Status
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {/* Status buttons */}
                      {['pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateApplicationStatus(application._id, status)}
                          disabled={
                            application.status === status || 
                            updatingStatus === application._id
                          }
                          className={`btn ${
                            application.status === status ? 'btn-secondary' : 'btn-primary'
                          }`}
                          style={{ 
                            fontSize: '1rem',
                            padding: '0.8rem 1rem',
                            opacity: application.status === status ? 0.6 : 1,
                            width: '100%',
                            fontWeight: '500',
                            borderRadius: '6px'
                          }}
                        >
                          {updatingStatus === application._id 
                            ? 'Updating...' 
                            : getStatusText(status)
                          }
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Statistics */}
        {applications.length > 0 && (
          <div style={{ 
            marginTop: '3rem',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <h4 style={{ color: '#2c3e50', marginTop: 0, marginBottom: '1rem' }}>
              📊 Application Statistics
            </h4>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              textAlign: 'center'
            }}>
              {['pending', 'reviewed', 'accepted', 'rejected'].map(status => {
                const count = applications.filter(app => app.status === status).length;
                return (
                  <div key={status}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50' }}>
                      {count}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                      {getStatusText(status)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
