import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StarsBackground from '../components/StarsBackground';

const Subscription = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { fetchUser } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user was redirected from canceled checkout
    if (searchParams.get('canceled') === 'true') {
      setMessage({ type: 'error', text: 'Payment was canceled. You can try again anytime.' });
      // Remove the query parameter from URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 29.99,
      duration: '1 month',
      features: ['Access to all premium content', 'HD galaxy videos', 'Rare planet images', 'Space facts library']
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: 299.99,
      duration: '1 year',
      features: ['Everything in Monthly', 'Exclusive documentaries', 'Priority support', 'Save 17%']
    },
    {
      id: 'premium',
      name: 'Premium Access',
      price: 499.99,
      duration: '1 year',
      features: ['Everything in Yearly', '4K ultra HD videos', 'Exclusive astronaut interviews', 'Early access to new content', 'VIP support']
    }
  ];

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await api.get('/subscriptions/status');
      setSubscriptionStatus(response.data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    setProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      // Create Stripe checkout session
      const response = await api.post('/subscriptions/create-checkout-session', { plan: planId });
      // Redirect to Stripe Checkout
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      setProcessing(false);
      console.error('Subscription error:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.status === 404 ? 'Route not found. Please restart the backend server.' : 'Failed to initiate checkout');
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return;

    setProcessing(true);
    try {
      await api.delete('/subscriptions');
      setMessage({ type: 'success', text: 'Subscription cancelled successfully' });
      await fetchUser();
      fetchSubscriptionStatus();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to cancel subscription' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading subscription...</p>
      </div>
    );
  }

  const isActive = subscriptionStatus?.isActive && new Date(subscriptionStatus.endDate) > new Date();

  return (
    <div className="subscription-page">
      <StarsBackground />
      <div className="container">
        <div className="section">
          <h1 className="section-title">Premium Subscription Plans</h1>
          <p style={{ textAlign: 'center', marginBottom: '50px', color: '#d0d0d0' }}>
            Unlock exclusive space content with our premium subscription
          </p>

          {message.text && (
            <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
              {message.text}
            </div>
          )}

          {isActive && (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto 50px', textAlign: 'center' }}>
              <h2 style={{ color: '#667eea', marginBottom: '15px' }}>Current Subscription</h2>
              <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                Plan: <strong>{subscriptionStatus.plan.charAt(0).toUpperCase() + subscriptionStatus.plan.slice(1)}</strong>
              </p>
              <p style={{ color: '#d0d0d0' }}>
                Active until: {new Date(subscriptionStatus.endDate).toLocaleDateString()}
              </p>
              <Link to="/premium-content" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
                Access Premium Content
              </Link>
              <button onClick={handleCancel} className="btn btn-outline" style={{ marginTop: '10px', marginLeft: '10px' }} disabled={processing}>
                Cancel Subscription
              </button>
            </div>
          )}

          <div className="grid grid-3">
            {plans.map(plan => (
              <div 
                key={plan.id} 
                className="card subscription-card"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%' 
                }}
              >
                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ marginBottom: '10px', color: '#f093fb' }}>{plan.name}</h3>
                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea' }}>
                      ${plan.price}
                    </span>
                    <span style={{ color: '#b0b0b0', marginLeft: '10px' }}>/{plan.duration}</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px', textAlign: 'left' }}>
                    {plan.features.map((feature, idx) => (
                      <li key={idx} style={{ padding: '8px 0', color: '#e0e0e0' }}>
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                {isActive && subscriptionStatus.plan === plan.id ? (
                  <button className="btn btn-primary" disabled style={{ width: '100%', marginTop: 'auto' }}>
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: 'auto' }}
                    disabled={processing || isActive}
                  >
                    {processing ? 'Processing...' : isActive ? 'Upgrade' : 'Subscribe'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;

