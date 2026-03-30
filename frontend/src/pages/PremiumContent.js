import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StarsBackground from '../components/StarsBackground';
import { FiLock } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { GiBlackHoleBolas } from 'react-icons/gi';

const PremiumContent = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('videos');
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPremiumContent();
  }, []);

  const fetchPremiumContent = async () => {
    try {
      const response = await api.get('/content/premium');
      setContent(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        setError('You need an active subscription to access premium content.');
      } else {
        setError('Failed to load premium content.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading premium content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-content-page">
        <StarsBackground />
        <div className="container">
          <div className="section">
            <div className="card" style={{ maxWidth: '600px', margin: '100px auto', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px', color: '#f093fb' }}>
                <FiLock />
              </div>
              <h2 style={{ marginBottom: '20px', color: '#f093fb' }}>Premium Access Required</h2>
              <p style={{ color: '#d0d0d0', marginBottom: '30px' }}>{error}</p>
              <Link to="/subscription" className="btn btn-primary">
                Subscribe Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-content-page">
      <StarsBackground />
      <div className="container">
        <div className="section">
          <h1 className="section-title">Premium Space Content</h1>
          <p style={{ textAlign: 'center', marginBottom: '50px', color: '#d0d0d0' }}>
            Exclusive high-quality content for premium subscribers
          </p>

          {user?.subscription?.isActive && (
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto 50px', textAlign: 'center', background: 'rgba(102, 126, 234, 0.2)' }}>
              <p style={{ color: '#667eea', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <FaStar />
                Premium {user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)} Plan Active
              </p>
              <p style={{ color: '#d0d0d0', fontSize: '0.9rem', marginTop: '5px' }}>
                Valid until: {new Date(user.subscription.endDate).toLocaleDateString()}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
            {['videos', 'images', 'facts', 'documentaries'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="btn"
                style={{
                  background: activeTab === tab ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {content && (
            <>
              {activeTab === 'videos' && (
                <div className="grid grid-2">
                  {content.videos.map(video => (
                    <div key={video.id} className="card">
                      <div style={{ 
                        width: '100%', 
                        height: '0',
                        paddingBottom: '56.25%',
                        position: 'relative',
                        borderRadius: '10px',
                        marginBottom: '15px',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}>
                        {video.youtubeId ? (
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${video.youtubeId}`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              borderRadius: '10px'
                            }}
                          />
                        ) : (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem'
                          }}>
                            🎬
                          </div>
                        )}
                      </div>
                      <h3 style={{ marginBottom: '10px', color: '#667eea' }}>{video.title}</h3>
                      <p style={{ color: '#d0d0d0', fontSize: '0.9rem' }}>{video.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'images' && (
                <>
                  <div className="grid grid-3">
                    {content.images.map(image => (
                      <div key={image.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelectedImage(image)}>
                        <div style={{ 
                          width: '100%', 
                          height: '250px', 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '10px',
                          marginBottom: '15px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease'
                        }}>
                          <img 
                            src={image.url} 
                            alt={image.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 3rem;">🖼️</div>';
                            }}
                          />
                        </div>
                        <h3 style={{ marginBottom: '10px', color: '#f093fb' }}>{image.title}</h3>
                        <p style={{ color: '#d0d0d0', fontSize: '0.9rem' }}>{image.description}</p>
                      </div>
                    ))}
                  </div>

                  {selectedImage && (
                    <div 
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        zIndex: 10000,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px 20px',
                        cursor: 'pointer',
                        overflow: 'auto'
                      }}
                      onClick={() => setSelectedImage(null)}
                    >
                      <div 
                        style={{
                          maxWidth: '90%',
                          maxHeight: '90%',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedImage(null)}
                          style={{
                            position: 'fixed',
                            top: '100px',
                            right: '30px',
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            color: 'white',
                            fontSize: '2.5rem',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10002,
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                            e.target.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          ×
                        </button>
                        <img 
                          src={selectedImage.url} 
                          alt={selectedImage.title}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '70vh',
                            objectFit: 'contain',
                            borderRadius: '10px',
                            marginBottom: '30px'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '<div style="color: white; text-align: center; font-size: 1.5rem;">Image failed to load</div>';
                          }}
                        />
                        <div style={{ 
                          color: 'white', 
                          textAlign: 'center', 
                          maxWidth: '800px',
                          width: '100%'
                        }}>
                          <h2 style={{ 
                            marginBottom: '15px', 
                            color: '#f093fb',
                            fontSize: '2rem',
                            fontWeight: '700'
                          }}>
                            {selectedImage.title}
                          </h2>
                          <p style={{ 
                            color: '#d0d0d0', 
                            fontSize: '1.2rem',
                            lineHeight: '1.8'
                          }}>
                            {selectedImage.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'facts' && (
                <div className="grid grid-2">
                  {content.facts.map(fact => (
                    <div key={fact.id} className="card">
                      <div style={{ fontSize: '3rem', marginBottom: '15px', textAlign: 'center', color: '#f093fb' }}>
                        <GiBlackHoleBolas />
                      </div>
                      <h3 style={{ marginBottom: '15px', color: '#667eea', textAlign: 'center' }}>{fact.title}</h3>
                      <p style={{ color: '#d0d0d0', lineHeight: '1.8', fontSize: '1.1rem' }}>{fact.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'documentaries' && (
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                  {content.documentaries.map(doc => (
                    <div key={doc.id} className="card" style={{ marginBottom: '30px' }}>
                      <div style={{ 
                        display: 'flex',
                        gap: '30px',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{ 
                          width: '300px',
                          minWidth: '250px',
                          height: '200px', 
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          borderRadius: '10px',
                          flexShrink: 0,
                          overflow: 'hidden'
                        }}>
                          <img 
                            src={doc.thumbnail} 
                            alt={doc.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.style.display = 'flex';
                              e.target.parentElement.style.alignItems = 'center';
                              e.target.parentElement.style.justifyContent = 'center';
                              e.target.parentElement.innerHTML = '<div style="font-size: 3rem; color: white;">📹</div>';
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: '250px' }}>
                          <h3 style={{ 
                            marginBottom: '15px', 
                            color: '#f093fb',
                            fontSize: '1.8rem',
                            fontWeight: '700'
                          }}>
                            {doc.title}
                          </h3>
                          <p style={{ 
                            color: '#d0d0d0', 
                            fontSize: '1.1rem',
                            lineHeight: '1.8',
                            marginBottom: '20px'
                          }}>
                            {doc.description}
                          </p>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{
                              display: 'inline-block',
                              textDecoration: 'none'
                            }}
                          >
                            Read More
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremiumContent;

