import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StarsBackground from '../components/StarsBackground';
import {
  FaRocket,
  FaUserAstronaut,
  FaCameraRetro,
  FaGift,
  FaRegStar
} from 'react-icons/fa';
import {
  GiMarsCuriosity,
  GiMarsPathfinder,
  GiGalaxy,
  GiWalk
} from 'react-icons/gi';
import { MdOutlineLandscape } from 'react-icons/md';
import { RiMoonClearLine } from 'react-icons/ri';
import { TbNotebook } from 'react-icons/tb';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home">
      <StarsBackground />
      <div className="hero">
        <h1>Beyond Earth</h1>
        <p>Your Journey to the Stars Begins Here</p>
        <p className="hero-subtitle">Book your trip to Mars and explore the universe</p>
        
        {user ? (
          <div className="hero-buttons">
            <Link to="/booking" className="btn btn-primary">Book Your Trip to Mars</Link>
            <Link to="/dashboard" className="btn btn-outline">View Dashboard</Link>
          </div>
        ) : (
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Start Your Journey</Link>
            <Link to="/login" className="btn btn-outline">Login</Link>
          </div>
        )}
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="section-title">What's Included in Your Mars Trip</h2>
          <div className="grid grid-2">
            {[
              {
                icon: <FaRocket />,
                title: 'Spaceship Journey',
                description: 'Travel to Mars in our state-of-the-art spaceship with comfortable accommodations'
              },
              {
                icon: <GiMarsPathfinder />,
                title: 'Mars Landing',
                description: 'Experience the thrill of landing on the Red Planet'
              },
              {
                icon: <GiGalaxy />,
                title: 'Galaxy Viewing',
                description: 'Witness breathtaking views of galaxies and space during your journey'
              },
              {
                icon: <FaUserAstronaut />,
                title: 'Guided Tour',
                description: 'Explore Mars surface with our expert guides'
              }
            ].map((feature, idx) => (
              <div key={feature.title} className="feature-card card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
            </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section section-alt">
        <div className="container">
          <h2 className="section-title">Additional Activities</h2>
          <div className="grid grid-3" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {[
              {
                icon: <GiWalk />,
                title: 'Mars Walking Tours',
                description: 'Explore different zones of Mars on foot'
              },
              {
                icon: <GiMarsCuriosity />,
                title: 'Mars Rover Ride',
                description: 'Drive the official Mars Rover across the planet'
              },
              {
                icon: <FaCameraRetro />,
                title: 'Space Photography',
                description: 'Capture stunning photos of galaxies and space'
              },
              {
                icon: <FaGift />,
                title: 'Mars Souvenirs',
                description: 'Collect authentic Mars souvenirs delivered to Earth'
              },
              {
                icon: <MdOutlineLandscape />,
                title: 'Buy Land on Mars',
                description: 'Purchase and own land on the Red Planet'
              },
              {
                icon: <RiMoonClearLine />,
                title: 'Moon Walking',
                description: 'Experience simulated moon walking tours'
              }
            ].map(activity => (
              <div key={activity.title} className="activity-preview card">
                <div className="activity-icon">{activity.icon}</div>
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
            </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '30px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
            <Link to="/activities" className="btn btn-secondary" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
              View All Activities
            </Link>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Premium Subscription</h2>
          <div className="premium-section card" style={{ margin: '0 auto' }}>
            <h3>Unlock Exclusive Space Content</h3>
            <p>Subscribe to access high-quality galaxy videos, rare planet images, advanced space facts, and special documentaries</p>
            <div className="premium-features grid grid-2">
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaRegStar /> Premium Features:
                </h4>
                <ul>
                  <li>High-quality galaxy videos</li>
                  <li>Rare planet images</li>
                  <li>Advanced space facts</li>
                  <li>Special space documentaries</li>
                </ul>
              </div>
              <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TbNotebook /> Subscription Plans:
                </h4>
                <ul>
                  <li>Monthly Plan</li>
                  <li>Yearly Plan</li>
                  <li>Premium Access</li>
                </ul>
              </div>
            </div>
            {user ? (
              <Link to="/subscription" className="btn btn-primary">Subscribe Now</Link>
            ) : (
              <Link to="/register" className="btn btn-primary">Sign Up to Subscribe</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

