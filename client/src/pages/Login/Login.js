// Login page component
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
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
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // Call login function
    const result = await login(formData.email, formData.password);
    
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
              🔐
            </div>
            <h2>Welcome Back</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
              Sign in to access your account and continue your job search
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
                placeholder="Enter your password"
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
                  Signing In...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{ 
                  color: 'var(--primary-blue)', 
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
