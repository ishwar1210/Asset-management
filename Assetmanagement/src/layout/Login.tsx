

import { useState } from 'react';
import logoImg from '../assets/JMN_New_Logo-removebg.png';
import backgroundImg from '../assets/imgi_170_61cf05798c313369690d6ae9_Asset-Management-System.jpg';
import { loginUser } from '../api/endpoint';
import './Login.css';
type LoginProps = {
  onLogin?: () => void;
}

function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser(username, password);
      console.log('Login response:', response);
      
      // Check if login was actually successful
      if (response.responseMessage && response.responseMessage.toLowerCase().includes('invalid')) {
        setError(response.responseMessage);
        setLoading(false);
        return;
      }
      
      if (response.responseMessage === "Enter valid username and password.") {
        setError(response.responseMessage);
        setLoading(false);
        return;
      }
      
      // Check for success indicators
      if (!response.token && !response.data && response.responseMessage) {
        setError(response.responseMessage);
        setLoading(false);
        return;
      }
      
      // Store token if returned from API
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      // Store user data if available
      if (response.data) {
        localStorage.setItem('userData', JSON.stringify(response.data));
      }
      
      // Only proceed with login if successful
      if (onLogin) onLogin();
      
    } catch (err: any) {
      console.error('Login failed:', err);
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data.message || err.response.data.responseMessage || 'Invalid username or password');
      } else if (err.request) {
        // Network error
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="login-container" style={{ backgroundImage: `url(${backgroundImg})` }}>
      {/* Blur overlay */}
      <div className="login-blur-overlay" />

      {/* Login Card */}
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo-container">
          <img 
            src={logoImg} 
            alt="Asset Management Logo" 
            className="login-logo"
          />
          <h2 className="login-title">Login</h2>
        </div>
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee',
              color: '#c33',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div className="login-form-group">
            <label className="login-label">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={loading}
              className="login-input"
            />
          </div>

          <div className="login-form-group">
            <label className="login-label">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              className="login-input"
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
            style={{
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;