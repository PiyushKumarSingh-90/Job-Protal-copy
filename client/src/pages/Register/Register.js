// Register page component
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'jobseeker' // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Call register function
    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );
    
    if (result.success) {
      navigate('/'); // Redirect to home on success
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="container-sm">
        <div className="form-container animate-slideUp">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div style={{ 
              fontSize: '3rem', 
              marginBottom: 'var(--space-md)',
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              👤
            </div>
            <h2>Create Your Account</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
              Join our community and start your journey to find the perfect job or hire amazing talent
            </p>
          </div>

          {/* Show error message */}
          {error && (
            <div className="alert alert-error">
              <span>❌</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name">
                <span>👤</span> Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">
                <span>📧</span> Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label htmlFor="role">
                <span>🎯</span> I am a:
              </label>
              <select
                id="role"
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="jobseeker">🔍 Job Seeker</option>
                <option value="employer">🏢 Employer</option>
              </select>
              <small style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.75rem',
                marginTop: 'var(--space-xs)',
                display: 'block'
              }}>
                {formData.role === 'jobseeker' 
                  ? '💼 Looking for job opportunities' 
                  : '🎯 Looking to hire talent'
                }
              </small>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">
                <span>🔒</span> Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password (min. 6 characters)"
                minLength="6"
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword">
                <span>🔐</span> Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                minLength="6"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 'var(--space-lg)' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner" style={{ 
                    width: '16px', 
                    height: '16px', 
                    marginRight: 'var(--space-sm)',
                    borderWidth: '2px'
                  }}></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: 'var(--primary-blue)', 
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
