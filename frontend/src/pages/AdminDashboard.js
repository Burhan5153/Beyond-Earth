import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StarsBackground from '../components/StarsBackground';
import { FaUsers, FaRocket, FaEdit, FaTrash, FaCheck, FaTimes, FaUserShield } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'bookings'
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'user' });
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchUsers();
    fetchBookings();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get('/admin/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit._id);
    setEditForm({
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role || 'user'
    });
  };

  const handleSaveUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}`, editForm);
      await fetchUsers();
      setEditingUser(null);
      alert('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ name: '', email: '', role: 'user' });
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This will also delete all their bookings. This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      await fetchUsers();
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/admin/bookings/${bookingId}/status`, { status: newStatus });
      await fetchBookings();
      alert('Booking status updated successfully!');
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert(error.response?.data?.message || 'Failed to update booking status');
    }
  };

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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <StarsBackground />
      <div className="container">
        <div className="section">
          <h1 className="section-title">
            <FaUserShield style={{ marginRight: '10px', verticalAlign: 'middle' }} />
            Admin Dashboard
          </h1>
          <p style={{ textAlign: 'center', marginBottom: '30px', color: '#d0d0d0' }}>
            Welcome, {user?.name}! Manage users and bookings from here.
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', justifyContent: 'center' }}>
            <button
              onClick={() => setActiveTab('users')}
              className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FaUsers /> Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-outline'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FaRocket /> Bookings ({bookings.length})
            </button>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '20px' }}>
                User Management
              </h2>
              {users.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
                  <p style={{ fontSize: '1.2rem', color: '#d0d0d0' }}>No users found.</p>
                </div>
              ) : (
                <div className="grid grid-2">
                  {users.map((userItem) => (
                    <div key={userItem._id} className="card">
                      {editingUser === userItem._id ? (
                        <div>
                          <h3 style={{ color: '#667eea', marginBottom: '15px' }}>Edit User</h3>
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#d0d0d0' }}>Name</label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(0,0,0,0.3)',
                                color: '#fff'
                              }}
                            />
                          </div>
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#d0d0d0' }}>Email</label>
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(0,0,0,0.3)',
                                color: '#fff'
                              }}
                            />
                          </div>
                          <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#d0d0d0' }}>Role</label>
                            <select
                              value={editForm.role}
                              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(0,0,0,0.3)',
                                color: '#fff'
                              }}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => handleSaveUser(userItem._id)}
                              className="btn btn-primary"
                              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                            >
                              <FaCheck /> Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="btn btn-outline"
                              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                            >
                              <FaTimes /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                            <div>
                              <h3 style={{ color: '#667eea', marginBottom: '5px' }}>{userItem.name}</h3>
                              <p style={{ color: '#d0d0d0', fontSize: '0.9rem' }}>{userItem.email}</p>
                            </div>
                            <span
                              style={{
                                padding: '5px 15px',
                                borderRadius: '20px',
                                background: userItem.role === 'admin' ? '#f093fb30' : '#667eea30',
                                color: userItem.role === 'admin' ? '#f093fb' : '#667eea',
                                fontWeight: 'bold',
                                fontSize: '0.85rem'
                              }}
                            >
                              {userItem.role?.toUpperCase() || 'USER'}
                            </span>
                          </div>

                          {userItem.subscription && (
                            <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px' }}>
                              <p style={{ color: '#d0d0d0', fontSize: '0.9rem', marginBottom: '5px' }}>
                                <strong>Subscription:</strong> {userItem.subscription.plan || 'none'}
                              </p>
                              {userItem.subscription.isActive && (
                                <p style={{ color: '#66bb6a', fontSize: '0.85rem' }}>✓ Active</p>
                              )}
                            </div>
                          )}

                          <p style={{ color: '#b0b0b0', fontSize: '0.85rem', marginBottom: '15px' }}>
                            Joined: {formatDate(userItem.createdAt)}
                          </p>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => handleEditUser(userItem)}
                              className="btn btn-outline"
                              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                            >
                              <FaEdit /> Edit
                            </button>
                            {userItem._id !== user?._id && (
                              <button
                                onClick={() => handleDeleteUser(userItem._id, userItem.name)}
                                className="btn btn-outline"
                                style={{ 
                                  flex: 1, 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center', 
                                  gap: '5px',
                                  background: 'rgba(239, 83, 80, 0.2)',
                                  borderColor: '#ef5350',
                                  color: '#ef5350'
                                }}
                              >
                                <FaTrash /> Delete
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '20px' }}>
                Booking Management
              </h2>
              {bookings.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
                  <p style={{ fontSize: '1.2rem', color: '#d0d0d0' }}>No bookings found.</p>
                </div>
              ) : (
                <div className="grid grid-2">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                        <div>
                          <h3 style={{ color: '#667eea', marginBottom: '5px' }}>
                            {booking.user?.name || 'Unknown User'}
                          </h3>
                          <p style={{ color: '#d0d0d0', fontSize: '0.9rem' }}>
                            {booking.user?.email || 'No email'}
                          </p>
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
                        <p style={{ color: '#d0d0d0', fontSize: '0.9rem', marginBottom: '5px' }}>
                          <strong>Flight Date:</strong> {formatDate(booking.flightDate)}
                        </p>
                        <p style={{ color: '#f093fb', fontSize: '1.2rem', fontWeight: 'bold' }}>
                          ${booking.totalPrice?.toLocaleString() || '0'}
                        </p>
                        <p style={{ color: '#b0b0b0', fontSize: '0.85rem', marginTop: '5px' }}>
                          Payment: {booking.paymentStatus || 'pending'}
                        </p>
                      </div>

                      {booking.additionalActivities && booking.additionalActivities.length > 0 && (
                        <div style={{ marginBottom: '15px', padding: '10px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px' }}>
                          <strong style={{ color: '#e0e0e0', fontSize: '0.9rem' }}>Activities:</strong>
                          <ul style={{ marginTop: '5px', paddingLeft: '20px', color: '#d0d0d0', fontSize: '0.85rem' }}>
                            {booking.additionalActivities
                              .filter(act => act.booked)
                              .map((act, idx) => (
                                <li key={idx}>{act.activityType.replace(/-/g, ' ')}</li>
                              ))}
                          </ul>
                        </div>
                      )}

                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                          className="btn btn-primary"
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                        >
                          <FaCheck /> Mark as Confirmed
                        </button>
                      )}

                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateBookingStatus(booking._id, 'completed')}
                          className="btn btn-primary"
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                        >
                          <FaCheck /> Mark as Completed
                        </button>
                      )}

                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <button
                          onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}
                          className="btn btn-outline"
                          style={{ 
                            width: '100%', 
                            marginTop: '10px',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '5px',
                            background: 'rgba(239, 83, 80, 0.2)',
                            borderColor: '#ef5350',
                            color: '#ef5350'
                          }}
                        >
                          <FaTimes /> Cancel Booking
                        </button>
                      )}

                      <p style={{ color: '#b0b0b0', fontSize: '0.8rem', marginTop: '15px', textAlign: 'center' }}>
                        Created: {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

