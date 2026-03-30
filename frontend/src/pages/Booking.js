import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import StarsBackground from '../components/StarsBackground';

const Booking = () => {
  const [flightDate, setFlightDate] = useState('');
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const basePrice = 500000; // Base Mars trip price

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleActivityToggle = (activity) => {
    setSelectedActivities(prev => {
      const exists = prev.find(a => a._id === activity._id);
      if (exists) {
        return prev.filter(a => a._id !== activity._id);
      } else {
        return [...prev, {
          activityType: activity.type,
          booked: true,
          bookingDate: new Date(),
          price: activity.price
        }];
      }
    });
  };

  const calculateTotal = () => {
    const activitiesTotal = selectedActivities.reduce((sum, act) => sum + act.price, 0);
    return basePrice + activitiesTotal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!flightDate) {
      setError('Please select a flight date');
      setLoading(false);
      return;
    }

    try {
      const bookingData = {
        flightDate,
        additionalActivities: selectedActivities,
        totalPrice: calculateTotal()
      };

      await api.post('/bookings', bookingData);
      setSuccess('Booking created successfully!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <StarsBackground />
      <div className="container">
        <div className="section">
          <h1 className="section-title">Book Your Trip to Mars</h1>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="grid grid-2">
            <div className="card">
              <h2 style={{ marginBottom: '20px', color: '#667eea' }}>Main Ticket Includes</h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  ✅ Spaceship Journey
                </li>
                <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  ✅ Mars Landing
                </li>
                <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  ✅ Galaxy Viewing
                </li>
                <li style={{ padding: '10px 0' }}>
                  ✅ Basic Guided Tour
                </li>
              </ul>
              <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(102, 126, 234, 0.2)', borderRadius: '10px' }}>
                <strong style={{ fontSize: '1.2rem' }}>Base Price: ${basePrice.toLocaleString()}</strong>
              </div>
            </div>

            <div className="card">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Select Flight Date</label>
                  <input
                    type="date"
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div style={{ marginTop: '30px' }}>
                  <h3 style={{ marginBottom: '20px', color: '#f093fb' }}>Additional Activities</h3>
                  {activities.length === 0 ? (
                    <p>Loading activities...</p>
                  ) : (
                    activities
                      .filter(activity => activity.type !== 'land-purchase')
                      .map(activity => (
                      <div key={activity._id} style={{ marginBottom: '15px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={selectedActivities.some(a => a.activityType === activity.type)}
                            onChange={() => handleActivityToggle(activity)}
                            style={{ marginRight: '10px', width: '20px', height: '20px' }}
                          />
                          <div style={{ flex: 1 }}>
                            <strong>{activity.name}</strong>
                            <p style={{ margin: '5px 0', color: '#d0d0d0', fontSize: '0.9rem' }}>{activity.description}</p>
                            <span style={{ color: '#667eea', fontWeight: 'bold' }}>${activity.price.toLocaleString()}</span>
                          </div>
                        </label>
                      </div>
                    ))
                  )}

                  {activities.find(activity => activity.type === 'land-purchase') && (
                    <div style={{ marginTop: '20px', padding: '20px', borderRadius: '12px', background: 'rgba(240, 147, 251, 0.15)', border: '1px solid rgba(240, 147, 251, 0.4)' }}>
                      <h4 style={{ marginBottom: '10px', color: '#f093fb' }}>Want to own land on Mars?</h4>
                      <p style={{ color: '#d0d0d0', marginBottom: '15px' }}>
                        Land purchases are managed in a dedicated flow after you confirm your trip. Click below to choose your land type,
                        generate ownership certificates, and see exact coordinates.
                      </p>
                      <Link to="/land-purchase" className="btn btn-secondary" style={{ width: '100%' }}>
                        Go to Land Purchase Experience
                      </Link>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(240, 147, 251, 0.2)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Base Ticket:</span>
                    <span>${basePrice.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Activities:</span>
                    <span>${selectedActivities.reduce((sum, a) => sum + a.price, 0).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold', paddingTop: '10px', borderTop: '2px solid rgba(255,255,255,0.2)' }}>
                    <span>Total:</span>
                    <span style={{ color: '#f093fb' }}>${calculateTotal().toLocaleString()}</span>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

