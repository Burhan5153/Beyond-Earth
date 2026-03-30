import React, { useState } from 'react';
import { FaEnvelope, FaUser, FaPaperPlane } from 'react-icons/fa';
import api from '../services/api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/contact', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">
            Have questions or feedback? We'd love to hear from you. Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info-section">
            <div className="contact-info-card">
              <h2>Get in Touch</h2>
              <div className="contact-details">
                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <FaUser />
                  </div>
                  <div className="contact-detail-content">
                    <h3>Name</h3>
                    <p>Muhammad Asad Ali</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <div className="contact-detail-content">
                    <h3>Email</h3>
                    <p>bsse2380198@szabist.pk</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <FaUser />
                  </div>
                  <div className="contact-detail-content">
                    <h3>Registration ID</h3>
                    <p>2380198</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-info-card" style={{ marginTop: '30px' }}>
              <h2>Get in Touch</h2>
              <div className="contact-details">
                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <FaUser />
                  </div>
                  <div className="contact-detail-content">
                    <h3>Name</h3>
                    <p>Burhanuddin Moiz Kanch</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <div className="contact-detail-content">
                    <h3>Email</h3>
                    <p>bscs2380187@szabist.pk</p>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon">
                    <FaUser />
                  </div>
                  <div className="contact-detail-content">
                    <h3>Registration ID</h3>
                    <p>2380187</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <div className="contact-form-card">
              <h2>Send us a Message</h2>
              
              {success && (
                <div className="alert alert-success">
                  <FaPaperPlane style={{ marginRight: '8px' }} />
                  Your message has been submitted successfully! We'll get back to you soon.
                </div>
              )}

              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">
                    <FaUser style={{ marginRight: '8px' }} />
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <FaEnvelope style={{ marginRight: '8px' }} />
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">
                    <FaPaperPlane style={{ marginRight: '8px' }} />
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    <FaPaperPlane style={{ marginRight: '8px' }} />
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <FaPaperPlane style={{ marginRight: '8px' }} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

