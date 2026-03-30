import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import StarsBackground from '../components/StarsBackground';
import { FaHome, FaBuilding, FaCrown, FaGlobeAmericas } from 'react-icons/fa';

const LandPurchase = () => {
  const [bookings, setBookings] = useState([]);
  const [landPurchases, setLandPurchases] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState('');
  const [landType, setLandType] = useState('residential');
  const [size, setSize] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const landTypes = [
    { value: 'residential', label: 'Residential Land', price: 50000, icon: <FaHome /> },
    { value: 'commercial', label: 'Commercial Land', price: 100000, icon: <FaBuilding /> },
    { value: 'luxury', label: 'Luxury Planet Land', price: 250000, icon: <FaCrown /> }
  ];

  useEffect(() => {
    fetchBookings();
    fetchLandPurchases();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      const confirmedBookings = response.data.filter(b => b.status === 'confirmed' || b.status === 'pending');
      setBookings(confirmedBookings);
      if (confirmedBookings.length > 0) {
        setSelectedBooking(confirmedBookings[0]._id);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
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

  const handleDeleteLand = async (landId) => {
    if (!window.confirm('Are you sure you want to delete this land purchase? This will permanently remove the ownership certificate. This action cannot be undone.')) return;

    try {
      await api.delete(`/land/${landId}`);
      setSuccess('Land purchase deleted successfully');
      fetchLandPurchases();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting land purchase:', error);
      setError('Failed to delete land purchase. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getLandPrice = () => {
    const selectedType = landTypes.find(t => t.value === landType);
    return selectedType ? selectedType.price * size : 0;
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!selectedBooking) {
      setError('Please select a booking first');
      setLoading(false);
      return;
    }

    try {
      const purchaseData = {
        bookingId: selectedBooking,
        landType,
        size,
        price: getLandPrice(),
        coordinates: {
          latitude: Math.random() * 180 - 90,
          longitude: Math.random() * 360 - 180
        }
      };

      await api.post('/land', purchaseData);
      setSuccess('Land purchased successfully! Your ownership certificate is being generated.');
      fetchLandPurchases();
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to purchase land');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="land-purchase-page">
      <StarsBackground />
      <div className="container">
        <div className="section">
          <h1 className="section-title">Buy Land on Mars</h1>
          <p style={{ textAlign: 'center', marginBottom: '50px', color: '#d0d0d0' }}>
            Own a piece of the Red Planet! Purchase land and receive an official ownership certificate.
          </p>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="grid grid-2">
            <div className="card">
              <h2 style={{ marginBottom: '20px', color: '#667eea' }}>Purchase Land</h2>
              
              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px' }}>
                  <p style={{ color: '#d0d0d0', marginBottom: '20px' }}>
                    You need to have a confirmed booking to purchase land.
                  </p>
                  <button onClick={() => navigate('/booking')} className="btn btn-primary">
                    Book Your Trip First
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePurchase}>
                  <div className="form-group">
                    <label>Select Your Booking</label>
                    <select
                      value={selectedBooking}
                      onChange={(e) => setSelectedBooking(e.target.value)}
                      required
                    >
                      {bookings.map(booking => (
                        <option key={booking._id} value={booking._id}>
                          Mars Trip - {formatDate(booking.flightDate)} (${booking.totalPrice.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Land Type</label>
                    <div style={{ display: 'grid', gap: '15px', marginTop: '10px' }}>
                      {landTypes.map(type => (
                        <label
                          key={type.value}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '15px',
                            background: landType === type.value ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255,255,255,0.05)',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            border: landType === type.value ? '2px solid #667eea' : '2px solid transparent',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <input
                            type="radio"
                            name="landType"
                            value={type.value}
                            checked={landType === type.value}
                            onChange={(e) => setLandType(e.target.value)}
                            style={{ marginRight: '15px', width: '20px', height: '20px' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{type.icon}</div>
                            <strong style={{ display: 'block', marginBottom: '5px' }}>{type.label}</strong>
                            <span style={{ color: '#f093fb', fontSize: '1.1rem' }}>
                              ${type.price.toLocaleString()} per sq km
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Land Size (sq km)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>

                  <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(240, 147, 251, 0.2)', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>Price per sq km:</span>
                      <span>${landTypes.find(t => t.value === landType)?.price.toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>Size:</span>
                      <span>{size} sq km</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 'bold', paddingTop: '10px', borderTop: '2px solid rgba(255,255,255,0.2)' }}>
                      <span>Total:</span>
                      <span style={{ color: '#f093fb' }}>${getLandPrice().toLocaleString()}</span>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
                    {loading ? 'Processing...' : 'Purchase Land'}
                  </button>
                </form>
              )}
            </div>

            <div className="card">
              <h2 style={{ marginBottom: '20px', color: '#f093fb' }}>My Land Purchases</h2>
              
              {landPurchases.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#d0d0d0' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '20px', color: '#f093fb' }}>
                    <FaGlobeAmericas />
                  </div>
                  <p>You haven't purchased any land yet.</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '10px', color: '#b0b0b0' }}>
                    Purchase land to see your ownership certificates here.
                  </p>
                </div>
              ) : (
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {landPurchases.map(land => {
                    const typeInfo = landTypes.find(t => t.value === land.landType);
                    return (
                      <div key={land._id} style={{ marginBottom: '20px', padding: '20px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '10px', border: '1px solid rgba(102, 126, 234, 0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                          <div>
                            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{typeInfo?.icon}</div>
                            <h3 style={{ color: '#667eea', marginBottom: '5px' }}>{typeInfo?.label}</h3>
                            <p style={{ color: '#d0d0d0', fontSize: '0.9rem' }}>
                              {land.size} sq km • ${land.price.toLocaleString()}
                            </p>
                          </div>
                          <span style={{
                            padding: '5px 15px',
                            borderRadius: '20px',
                            background: '#66bb6a30',
                            color: '#66bb6a',
                            fontWeight: 'bold',
                            fontSize: '0.9rem'
                          }}>
                            {land.status.toUpperCase()}
                          </span>
                        </div>
                        
                        {land.ownershipCertificate && (
                          <div style={{ marginTop: '15px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <strong style={{ color: '#f093fb', display: 'block', marginBottom: '10px' }}>
                              Ownership Certificate
                            </strong>
                            <p style={{ color: '#d0d0d0', fontSize: '0.9rem', marginBottom: '5px' }}>
                              Certificate #: {land.ownershipCertificate.certificateNumber}
                            </p>
                            <p style={{ color: '#d0d0d0', fontSize: '0.9rem', marginBottom: '5px' }}>
                              Issued: {formatDate(land.ownershipCertificate.issueDate)}
                            </p>
                            <p style={{ color: '#d0d0d0', fontSize: '0.9rem' }}>
                              {land.ownershipCertificate.registrationDetails}
                            </p>
                          </div>
                        )}
                        
                        {land.coordinates && (
                          <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(240, 147, 251, 0.1)', borderRadius: '8px' }}>
                            <strong style={{ color: '#667eea', fontSize: '0.9rem' }}>Location:</strong>
                            <p style={{ color: '#d0d0d0', fontSize: '0.85rem', marginTop: '5px' }}>
                              {land.mapLocation || `Lat: ${land.coordinates.latitude}°, Long: ${land.coordinates.longitude}°`}
                            </p>
                          </div>
                        )}
                        
                        <button
                          onClick={() => handleDeleteLand(land._id)}
                          className="btn btn-outline"
                          style={{ 
                            marginTop: '15px', 
                            width: '100%',
                            background: 'rgba(239, 83, 80, 0.1)',
                            borderColor: '#ef5350',
                            color: '#ef5350'
                          }}
                        >
                          Delete Land Purchase
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandPurchase;

