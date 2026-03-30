import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StarsBackground from '../components/StarsBackground';
import { FaRocket, FaUserAstronaut, FaGem, FaStar, FaGlobeAmericas } from 'react-icons/fa';
import { MdOutlineLandscape } from 'react-icons/md';
import { GiTargetPoster } from 'react-icons/gi';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [landPurchases, setLandPurchases] = useState([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextFlightDate, setNextFlightDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect admins to admin dashboard immediately
  useEffect(() => {
    if (!userLoading && user && user.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, userLoading, navigate]);

  // Define calculateCountdown first using useCallback
  const calculateCountdown = useCallback((targetDate) => {
    if (!targetDate) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    
    const now = new Date();
    const timeLeft = targetDate - now;

    if (timeLeft <= 0) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    setCountdown({ days, hours, minutes, seconds });
  }, []);

  // Define fetchCountdown after calculateCountdown
  const fetchCountdown = useCallback(async () => {
    try {
      const response = await api.get('/bookings/next-flight/countdown');
      const { nextFlightDate: apiDate } = response.data;

      if (!apiDate) {
        setNextFlightDate(null);
        calculateCountdown(null);
        return;
      }

      const flightDate = new Date(apiDate);
      setNextFlightDate(flightDate);
      calculateCountdown(flightDate);
    } catch (error) {
      console.error('Error fetching countdown:', error);
      setNextFlightDate(null);
      calculateCountdown(null);
    }
  }, [calculateCountdown]);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLandPurchases = async () => {
    try {
      const response = await api.get('/land/my-land');
      setLandPurchases(response.data);
    } catch (error) {
      console.error('Error fetching land purchases:', error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchBookings();
    fetchLandPurchases();
    fetchCountdown();
  }, [fetchCountdown]);

  // Update countdown every second
  useEffect(() => {
    // Always show a timer, even if it's zeroed out
    calculateCountdown(nextFlightDate);
    
    const interval = setInterval(() => {
      calculateCountdown(nextFlightDate);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [nextFlightDate, calculateCountdown]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffa726',
      confirmed: '#66bb6a',
      completed: '#42a5f5',
      cancelled: '#ef5350'
    };
    return colors[status] || '#b0b0b0';
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel and delete this booking? This action cannot be undone.')) return;

    try {
      await api.delete(`/bookings/${bookingId}`);
      await fetchBookings();
      await fetchCountdown();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  // Don't render if user is admin (redirect will happen)
  if (user && user.role === 'admin') {
    return null;
  }

  if (loading || userLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <StarsBackground />
      <div className="container">
        <div className="section">
          <h1 className="section-title">Astronaut Dashboard</h1>
          <p style={{ textAlign: 'center', marginBottom: '50px', color: '#d0d0d0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <FaUserAstronaut /> Welcome back, {user?.name}!
          </p>

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto 50px', textAlign: 'center' }}>
              <h2 style={{ marginBottom: '20px', color: '#667eea' }}>Next Mars Flight</h2>
              <div className="countdown-grid">
                <div className="countdown-item">
                <div className="countdown-number">{countdown.days}</div>
                  <div className="countdown-label">Days</div>
                </div>
                <div className="countdown-item">
                <div className="countdown-number">{countdown.hours}</div>
                  <div className="countdown-label">Hours</div>
                </div>
                <div className="countdown-item">
                <div className="countdown-number">{countdown.minutes}</div>
                  <div className="countdown-label">Minutes</div>
                </div>
                <div className="countdown-item">
                <div className="countdown-number">{countdown.seconds}</div>
                  <div className="countdown-label">Seconds</div>
                </div>
              </div>
              <p style={{ marginTop: '20px', color: '#d0d0d0' }}>
              {nextFlightDate ? (
                <>Flight Date: {formatDate(nextFlightDate)}</>
              ) : (
                <>No upcoming flights booked yet.</>
              )}
              </p>
            </div>

          <div className="dashboard-actions grid grid-2" style={{ marginBottom: '50px' }}>
            <Link to="/booking" className="card dashboard-action-card" style={{ textDecoration: 'none', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px', color: '#f093fb' }}>
                <FaRocket />
              </div>
              <h3 style={{ color: '#f093fb', marginBottom: '10px', fontWeight: '700', fontSize: '1.3rem' }}>Book New Trip</h3>
              <p style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '500' }}>Plan your next adventure to Mars</p>
            </Link>
            <Link to="/land-purchase" className="card dashboard-action-card" style={{ textDecoration: 'none', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px', color: '#f093fb' }}>
                <MdOutlineLandscape />
              </div>
              <h3 style={{ color: '#f093fb', marginBottom: '10px', fontWeight: '700', fontSize: '1.3rem' }}>Buy Land on Mars</h3>
              <p style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '500' }}>Own a piece of the Red Planet</p>
            </Link>
            {user?.subscription?.isActive ? (
              <Link to="/premium-content" className="card dashboard-action-card" style={{ textDecoration: 'none', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px', color: '#f093fb' }}>
                  <FaStar />
                </div>
                <h3 style={{ color: '#f093fb', marginBottom: '10px', fontWeight: '700', fontSize: '1.3rem' }}>Premium Content</h3>
                <p style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '500' }}>Access exclusive space content</p>
              </Link>
            ) : (
              <Link to="/subscription" className="card dashboard-action-card" style={{ textDecoration: 'none', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '15px', color: '#f093fb' }}>
                  <FaGem />
                </div>
                <h3 style={{ color: '#f093fb', marginBottom: '10px', fontWeight: '700', fontSize: '1.3rem' }}>Subscribe</h3>
                <p style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '500' }}>Unlock premium features</p>
              </Link>
            )}
            <Link to="/activities" className="card dashboard-action-card" style={{ textDecoration: 'none', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px', color: '#f093fb' }}>
                <GiTargetPoster />
              </div>
              <h3 style={{ color: '#f093fb', marginBottom: '10px', fontWeight: '700', fontSize: '1.3rem' }}>Activities</h3>
              <p style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '500' }}>Explore additional activities</p>
            </Link>
          </div>

          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '30px' }}>My Bookings</h2>
          
          {bookings.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
              <p style={{ fontSize: '1.2rem', color: '#d0d0d0', marginBottom: '20px' }}>
                You don't have any bookings yet.
              </p>
              <Link to="/booking" className="btn btn-primary">Book Your First Trip</Link>
            </div>
          ) : (
            <div className="grid grid-2">
              {bookings.map(booking => (
                <div key={booking._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ color: '#667eea', marginBottom: '10px' }}>Mars Trip</h3>
                      <p style={{ color: '#d0d0d0' }}>Flight Date: {formatDate(booking.flightDate)}</p>
                    </div>
                    <span
                      style={{
                        padding: '5px 15px',
                        borderRadius: '20px',
                        background: getStatusColor(booking.status) + '30',
                        color: getStatusColor(booking.status),
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#f093fb', fontSize: '1.3rem' }}>
                      ${booking.totalPrice.toLocaleString()}
                    </strong>
                    <span style={{ color: '#b0b0b0', marginLeft: '10px' }}>
                      Payment: {booking.paymentStatus}
                    </span>
                  </div>

                  {booking.additionalActivities && booking.additionalActivities.length > 0 && (
                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <strong style={{ color: '#e0e0e0' }}>Additional Activities:</strong>
                      <ul style={{ marginTop: '10px', paddingLeft: '20px', color: '#d0d0d0' }}>
                        {booking.additionalActivities
                          .filter(act => act.booked)
                          .map((act, idx) => (
                            <li key={idx}>{act.activityType.replace(/-/g, ' ')}</li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {booking.spaceshipLocation && (
                    <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px' }}>
                      <strong style={{ color: '#667eea' }}>Spaceship Location:</strong>
                      <p style={{ color: '#d0d0d0', fontSize: '0.9rem', marginTop: '5px' }}>
                        Lat: {booking.spaceshipLocation.latitude?.toFixed(4) || '0.0000'}°,
                        Long: {booking.spaceshipLocation.longitude?.toFixed(4) || '0.0000'}°
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="btn btn-outline"
                    style={{ marginTop: '15px' }}
                  >
                    Cancel Booking
                  </button>
                </div>
              ))}
            </div>
          )}

          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '30px', marginTop: '60px' }}>
            <MdOutlineLandscape style={{ marginRight: '10px', verticalAlign: 'middle' }} />
            My Land Certificates
          </h2>
          
          {landPurchases.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
              <p style={{ fontSize: '1.2rem', color: '#d0d0d0', marginBottom: '20px' }}>
                You don't own any land on Mars yet.
              </p>
              <Link to="/land-purchase" className="btn btn-primary">Buy Your First Plot</Link>
            </div>
          ) : (
            <div className="grid grid-2">
              {landPurchases.map(land => (
                <div key={land._id} className="card" style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <div>
                      <h3 style={{ color: '#667eea', marginBottom: '10px', textTransform: 'capitalize' }}>
                        {land.landType} Land
                      </h3>
                      <p style={{ color: '#d0d0d0' }}>
                        Size: {land.size} sq km
                      </p>
                      <p style={{ color: '#f093fb', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '10px' }}>
                        ${land.price.toLocaleString()}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '5px 15px',
                        borderRadius: '20px',
                        background: '#66bb6a30',
                        color: '#66bb6a',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}
                    >
                      {land.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {land.ownershipCertificate && (
                    <div style={{ 
                      marginTop: '20px', 
                      padding: '20px', 
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(240, 147, 251, 0.15) 100%)',
                      borderRadius: '12px',
                      border: '1px solid rgba(240, 147, 251, 0.3)',
                      position: 'relative'
                    }}>
                      <div style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        fontSize: '2rem', 
                        opacity: 0.2,
                        color: '#f093fb'
                      }}>
                        <MdOutlineLandscape />
                      </div>
                      <strong style={{ color: '#f093fb', display: 'block', marginBottom: '15px', fontSize: '1.1rem' }}>
                        🏆 Ownership Certificate
                      </strong>
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>Certificate #:</span>
                        <p style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '600', marginTop: '3px' }}>
                          {land.ownershipCertificate.certificateNumber}
                        </p>
                      </div>
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>Issued:</span>
                        <p style={{ color: '#d0d0d0', fontSize: '0.95rem', marginTop: '3px' }}>
                          {formatDate(land.ownershipCertificate.issueDate)}
                        </p>
                      </div>
                      <div style={{ marginBottom: '5px' }}>
                        <span style={{ color: '#b0b0b0', fontSize: '0.85rem' }}>Registration:</span>
                        <p style={{ color: '#e0e0e0', fontSize: '0.9rem', marginTop: '3px', lineHeight: '1.5' }}>
                          {land.ownershipCertificate.registrationDetails}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {land.coordinates && (
                    <div style={{ 
                      marginTop: '15px', 
                      padding: '12px', 
                      background: 'rgba(102, 126, 234, 0.1)', 
                      borderRadius: '8px' 
                    }}>
                      <strong style={{ color: '#667eea', fontSize: '0.9rem', display: 'block', marginBottom: '5px' }}>
                        <FaGlobeAmericas style={{ marginRight: '5px' }} />
                        Location:
                      </strong>
                      <p style={{ color: '#d0d0d0', fontSize: '0.85rem', marginTop: '5px' }}>
                        {land.mapLocation || `Lat: ${land.coordinates.latitude?.toFixed(4)}°, Long: ${land.coordinates.longitude?.toFixed(4)}°`}
                      </p>
                    </div>
                  )}
                  
                  <Link 
                    to="/land-purchase" 
                    className="btn btn-outline"
                    style={{ marginTop: '15px', width: '100%', textAlign: 'center', display: 'block' }}
                  >
                    View All Land Purchases
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

