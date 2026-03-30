import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StarsBackground from '../components/StarsBackground';

const SubscriptionSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchUser } = useContext(AuthContext);

  useEffect(() => {
    const activateSubscription = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        const plan = searchParams.get('plan');

        if (!sessionId || !plan) {
          setError('Invalid payment session. Please contact support.');
          setLoading(false);
          return;
        }

        // Activate subscription on backend
        await api.post('/subscriptions/success', {
          session_id: sessionId,
          plan: plan
        });

        // Refresh user data to get updated subscription status
        await fetchUser();

        // Redirect to subscription page after 2 seconds
        setTimeout(() => {
          navigate('/subscription', { replace: true });
        }, 2000);
      } catch (err) {
        console.error('Subscription activation error:', err);
        setError(err.response?.data?.message || 'Failed to activate subscription. Please contact support.');
        setLoading(false);
      }
    };

    activateSubscription();
  }, [searchParams, navigate, fetchUser]);

  if (error) {
    return (
      <div className="subscription-page">
        <StarsBackground />
        <div className="container">
          <div className="section" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <h1 className="section-title" style={{ color: '#ff6b6b' }}>Payment Error</h1>
            <div className="card" style={{ marginTop: '30px' }}>
              <p style={{ fontSize: '1.1rem', color: '#e0e0e0', marginBottom: '30px' }}>{error}</p>
              <button onClick={() => navigate('/subscription')} className="btn btn-primary">
                Back to Subscription
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-page">
      <StarsBackground />
      <div className="container">
        <div className="section" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h1 className="section-title" style={{ color: '#51cf66' }}>Payment Successful! 🎉</h1>
          <div className="card" style={{ marginTop: '30px' }}>
            <div className="loading" style={{ marginBottom: '20px' }}>
              <div className="spinner"></div>
            </div>
            <p style={{ fontSize: '1.1rem', color: '#e0e0e0' }}>
              Your subscription is being activated...
            </p>
            <p style={{ color: '#b0b0b0', marginTop: '10px', fontSize: '0.9rem' }}>
              Redirecting you to your subscription page...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;

