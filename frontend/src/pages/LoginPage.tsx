import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';
import api from '../api/client';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      // Navigation will happen automatically via useEffect when user state updates
    } catch (err: unknown) {
      type ErrorResponse = {
        response?: {
          data?: {
            message?: string;
          };
        };
      };
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as ErrorResponse).response &&
        typeof (err as ErrorResponse).response?.data === 'object'
      ) {
        setError((err as ErrorResponse).response?.data?.message || 'Login failed');
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account</p>
          <LoginForm onLogin={handleLogin} loading={loading} error={error} />
        </div>
        <div className="test-credentials">
            <h4>Test Credentials:</h4>
            <ul>
              <li><strong>Acme Admin:</strong> admin@acme.test / password</li>
              <li><strong>Acme User:</strong> user@acme.test / password</li>
              <li><strong>Globex Admin:</strong> admin@globex.test / password</li>
              <li><strong>Globex User:</strong> user@globex.test / password</li>
            </ul>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;
