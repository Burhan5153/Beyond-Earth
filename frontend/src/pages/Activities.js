import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StarsBackground from '../components/StarsBackground';
import {
  FaCameraRetro,
  FaGift
} from 'react-icons/fa';
import {
  GiWalk,
  GiMarsCuriosity,
  GiMarsPathfinder
} from 'react-icons/gi';
import { MdOutlineLandscape } from 'react-icons/md';
import { RiMoonClearLine } from 'react-icons/ri';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get('/activities');
      if (Array.isArray(response.data) && response.data.length > 0) {
      setActivities(response.data);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const activityIcons = {
    'mars-walking': <GiWalk />,
    'rover-ride': <GiMarsCuriosity />,
    'photography': <FaCameraRetro />,
    'souvenirs': <FaGift />,
    'land-purchase': <MdOutlineLandscape />,
    'moon-walking': <RiMoonClearLine />
  };

  // Rich, user-friendly descriptions for each activity type
  const activityMeta = {
    'mars-walking': {
      title: 'Mars Walking Tours',
      longDescription:
        'Guided small–group walks across multiple Mars zones, designed to balance safety with true explorer-level immersion.',
      highlights: [
        'Professional guides trained in low‑gravity trekking',
        'Visit crater rims, frozen dunes, and canyon overlooks',
        'Custom space suits with built‑in HUD and comms'
      ]
    },
    'rover-ride': {
      title: 'Mars Rover Ride',
      longDescription:
        'Take the wheel of a real exploration rover and drive across the Martian surface on pre‑mapped off‑road routes.',
      highlights: [
        'Hands‑on instruction from mission engineers',
        'On‑board 4K cameras so you can replay your drive',
        'Option to add a night‑drive under the Milky Way'
      ]
    },
    photography: {
      title: 'Galaxy Space Photography Session',
      longDescription:
        'A dedicated astrophotography session using observatory‑grade lenses to capture galaxies, nebulae, and the Mars skyline.',
      highlights: [
        'Learn framing and exposure from a space photographer',
        'Shoot both deep‑space objects and Mars panoramas',
        'Leave with a curated digital portfolio of your best shots'
      ]
    },
    souvenirs: {
      title: 'Mars Souvenir Collection',
      longDescription:
        'Curated souvenirs from your mission, from flight patches to certified Mars dust vials, beautifully packaged for return to Earth.',
      highlights: [
        'Personalized “Beyond Earth” mission bundle',
        'Optional certificate of authenticity for collector items',
        'Secure shipping back to your home planet'
      ]
    },
    'land-purchase': {
      title: 'Buy Land on Mars',
      longDescription:
        'Choose and reserve your own plot on the Red Planet, complete with coordinates, land type, and ownership certificate.',
      highlights: [
        'Residential, commercial, and luxury zones available',
        'Digital ownership certificate and registration details',
        'Interactive map to visualize your exact plot location'
      ]
    },
    'moon-walking': {
      title: 'Moon Walking Experience',
      longDescription:
        'Train for low‑gravity exploration with a highly realistic Moon‑walk simulation that prepares you for future lunar missions.',
      highlights: [
        'Full‑body harness system to mimic 1/6th gravity',
        'VR‑enhanced Moon surface and Apollo‑style routes',
        'Perfect warm‑up for upcoming real Moon excursions'
      ]
    }
  };

  // Fallback content if backend returns no activities
  const fallbackActivities = [
    {
      _id: 'fallback-mars-walking',
      type: 'mars-walking',
      name: 'Mars Walking Tours',
      description: 'Guided exploration of multiple Mars surface zones.',
      price: 25000,
      duration: '2–4 hours'
    },
    {
      _id: 'fallback-rover-ride',
      type: 'rover-ride',
      name: 'Mars Rover Ride',
      description: 'Drive an official exploration rover across the Red Planet.',
      price: 50000,
      duration: '1–2 hours'
    },
    {
      _id: 'fallback-photography',
      type: 'photography',
      name: 'Galaxy Space Photography Session',
      description: 'Capture galaxies, nebulae, and Mars landscapes in 4K.',
      price: 15000,
      duration: '1 hour'
    },
    {
      _id: 'fallback-souvenirs',
      type: 'souvenirs',
      name: 'Mars Souvenir Collection',
      description: 'Curated mission souvenirs shipped safely back to Earth.',
      price: 10000,
      duration: 'Flexible'
    },
    {
      _id: 'fallback-land',
      type: 'land-purchase',
      name: 'Buy Land on Mars',
      description: 'Reserve your own plot on the Red Planet.',
      price: 50000,
      duration: 'Lifetime ownership'
    },
    {
      _id: 'fallback-moon',
      type: 'moon-walking',
      name: 'Moon Walking Experience',
      description: 'Train for low‑gravity walking in a realistic simulation.',
      price: 30000,
      duration: '2–3 hours'
    }
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading activities...</p>
      </div>
    );
  }

  const displayActivities = activities.length ? activities : fallbackActivities;

  return (
    <div className="activities-page">
      <StarsBackground />
      <div className="container">
        <div className="section">
          <article style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h1 className="section-title" style={{ marginBottom: '20px' }}>Explore Our Activities</h1>
              <p style={{ color: '#d0d0d0', fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto' }}>
                Enhance your Mars journey with these carefully curated experiences. Each activity is designed to deepen your connection with space exploration and create lasting memories of your time beyond Earth.
          </p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
              {displayActivities.map((activity, index) => {
                const meta = activityMeta[activity.type] || {};
                const highlights = meta.highlights || [];
                const Icon = activityIcons[activity.type] || <GiMarsPathfinder />;

                return (
                  <section
                    key={activity._id || activity.type}
                    style={{
                      padding: '40px 0',
                      borderBottom: index < displayActivities.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                      <div style={{ 
                        fontSize: '4rem', 
                        color: '#667eea',
                        flexShrink: 0,
                        marginTop: '10px'
                      }}>
                        {Icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h2 style={{ 
                          fontSize: '2rem', 
                          color: '#f093fb', 
                          marginBottom: '15px',
                          fontWeight: '700'
                        }}>
                          {meta.title || activity.name}
                        </h2>
                        
                        <p style={{ 
                          color: '#e0e0e0', 
                          fontSize: '1.1rem',
                          lineHeight: '1.8', 
                          marginBottom: '25px'
                        }}>
                          {meta.longDescription || activity.description}
                        </p>

                        {highlights.length > 0 && (
                          <div style={{ 
                            marginBottom: '25px',
                            padding: '20px',
                            background: 'rgba(102, 126, 234, 0.1)',
                            borderRadius: '10px',
                            borderLeft: '4px solid #667eea'
                          }}>
                            <h3 style={{ 
                              color: '#667eea', 
                              fontSize: '1rem',
                              marginBottom: '15px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '1px'
                            }}>
                              What's Included
                            </h3>
                            <ul style={{ 
                              listStyle: 'none', 
                              padding: 0,
                              margin: 0
                            }}>
                              {highlights.map((item, idx) => (
                                <li key={idx} style={{ 
                                  color: '#d0d0d0', 
                                  marginBottom: '10px',
                                  paddingLeft: '25px',
                                  position: 'relative',
                                  fontSize: '1rem',
                                  lineHeight: '1.6'
                                }}>
                                  <span style={{
                                    position: 'absolute',
                                    left: 0,
                                    color: '#667eea',
                                    fontWeight: 'bold'
                                  }}>✓</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '20px',
                          background: 'rgba(240, 147, 251, 0.1)',
                          borderRadius: '10px',
                          marginTop: '25px'
                        }}>
                          <div>
                            <div style={{ 
                              color: '#f093fb', 
                              fontSize: '1.5rem',
                              fontWeight: '700',
                              marginBottom: '5px'
                            }}>
                    ${activity.price.toLocaleString()}
                            </div>
                            <div style={{ 
                              color: '#b0b0b0', 
                              fontSize: '0.95rem'
                            }}>
                              Duration: {activity.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
                </div>

            <footer style={{ 
              textAlign: 'center', 
              marginTop: '80px',
              padding: '40px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '15px',
              border: '2px solid rgba(102, 126, 234, 0.3)'
            }}>
              <h3 style={{ 
                color: '#667eea', 
                fontSize: '1.5rem',
                marginBottom: '20px'
              }}>
                Ready to Add These Experiences to Your Journey?
              </h3>
              <p style={{ 
                color: '#d0d0d0', 
                marginBottom: '30px',
                fontSize: '1.1rem',
                lineHeight: '1.6'
              }}>
                {user 
                  ? 'Log in to your account to add these activities to your Mars trip booking.'
                  : 'Create an account or log in to customize your Mars adventure with these exciting activities.'}
              </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {user ? (
                  <Link to="/booking" className="btn btn-primary">
                    Go to Booking
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary">
                      Create Account
                    </Link>
                    <Link to="/login" className="btn btn-outline">
                      Log In
                  </Link>
                  </>
                )}
              </div>
            </footer>
          </article>
        </div>
      </div>
    </div>
  );
};

export default Activities;

