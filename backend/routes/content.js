const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// Get premium content (requires active subscription)
router.get('/premium', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if subscription is active
    if (!user.subscription.isActive || new Date() > user.subscription.endDate) {
      return res.status(403).json({ 
        message: 'Active subscription required to access premium content' 
      });
    }

    // Premium content
    const premiumContent = {
      videos: [
        {
          id: 1,
          title: 'Mars Surface Exploration',
          description: 'Exclusive footage from Mars rovers and landers',
          thumbnail: 'https://img.youtube.com/vi/7zpojhD4hpI/maxresdefault.jpg',
          youtubeId: '7zpojhD4hpI'
        },
        {
          id: 2,
          title: 'Black Holes Explained',
          description: 'Understanding the mysteries of black holes',
          thumbnail: 'https://img.youtube.com/vi/QqsLTNkzvaY/maxresdefault.jpg',
          youtubeId: 'QqsLTNkzvaY'
        },
        {
          id: 3,
          title: 'International Space Station Tour',
          description: 'A complete tour of the ISS with astronauts',
          thumbnail: 'https://img.youtube.com/vi/SGP6Y0Pnhe4/maxresdefault.jpg',
          youtubeId: 'SGP6Y0Pnhe4'
        },
        {
          id: 4,
          title: 'Jupiter\'s Great Red Spot',
          description: 'Close-up views of Jupiter\'s massive storm',
          thumbnail: 'https://img.youtube.com/vi/PtkqwslbLY8/maxresdefault.jpg',
          youtubeId: 'PtkqwslbLY8'
        },
        {
          id: 5,
          title: 'The Moon Landing: Apollo 11',
          description: 'Historic footage of the first moon landing',
          thumbnail: 'https://img.youtube.com/vi/S9HdPi9Ikhk/maxresdefault.jpg',
          youtubeId: 'S9HdPi9Ikhk'
        },
        {
          id: 6,
          title: 'Solar Flares and Space Weather',
          description: 'The Sun\'s powerful eruptions and their effects',
          thumbnail: 'https://img.youtube.com/vi/oOXVZo7KikE/maxresdefault.jpg',
          youtubeId: 'oOXVZo7KikE'
        }
      ],
      images: [
        {
          id: 1,
          title: 'Pillars of Creation',
          description: 'Iconic Hubble Space Telescope image of star-forming region in the Eagle Nebula',
          url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200&h=800&fit=crop'
        },
        {
          id: 2,
          title: 'Jupiter\'s Great Red Spot',
          description: 'Detailed view of Jupiter\'s massive storm captured by Juno spacecraft',
          url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1200&h=800&fit=crop'
        },
        {
          id: 3,
          title: 'Andromeda Galaxy',
          description: 'Our nearest galactic neighbor captured by Hubble Space Telescope',
          url: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1200&h=800&fit=crop'
        },
        {
          id: 4,
          title: 'Saturn\'s Rings',
          description: 'Stunning view of Saturn\'s rings from Cassini spacecraft',
          url: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=1200&h=800&fit=crop'
        },
        {
          id: 5,
          title: 'Mars Surface',
          description: 'High-resolution image of Mars surface from Perseverance rover',
          url: 'https://mars.nasa.gov/layout/mars2020/images/PIA23764-RoverNamePlateonMars-web.jpg'
        },
        {
          id: 6,
          title: 'Earthrise',
          description: 'Iconic view of Earth rising over the Moon from Apollo 8',
          url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&h=800&fit=crop'
        },
        {
          id: 7,
          title: 'Carina Nebula',
          description: 'James Webb Space Telescope image of the Carina Nebula',
          url: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=1200&h=800&fit=crop'
        },
        {
          id: 8,
          title: 'International Space Station',
          description: 'The ISS orbiting Earth, captured from a spacecraft',
          url: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1200&h=800&fit=crop'
        },
        {
          id: 9,
          title: 'Solar Corona',
          description: 'The Sun\'s corona during a total solar eclipse',
          url: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c50?w=1200&h=800&fit=crop'
        },
        {
          id: 10,
          title: 'Helix Nebula',
          description: 'The Eye of God - a planetary nebula 700 light-years away',
          url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop'
        },
        {
          id: 11,
          title: 'Mars Perseverance Landing',
          description: 'First image from Perseverance rover on Mars surface',
          url: 'https://mars.nasa.gov/layout/mars2020/images/PIA24431-Perseverance-First-Image.jpg'
        },
        {
          id: 12,
          title: 'Black Hole Shadow',
          description: 'First image of a black hole\'s event horizon from Event Horizon Telescope',
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop'
        }
      ],
      facts: [
        {
          id: 1,
          title: 'Black Holes',
          content: 'A black hole is a region of spacetime where gravity is so strong that nothing, not even light, can escape once it crosses the event horizon. The first image of a black hole was captured in 2019.'
        },
        {
          id: 2,
          title: 'Mars Distance',
          content: 'Mars is approximately 225 million kilometers away from Earth at its closest approach, which occurs every 26 months. A one-way trip to Mars takes about 9 months with current technology.'
        },
        {
          id: 3,
          title: 'The Speed of Light',
          content: 'Light travels at 299,792,458 meters per second in a vacuum. It takes about 8 minutes and 20 seconds for light from the Sun to reach Earth, meaning we see the Sun as it was 8 minutes ago.'
        },
        {
          id: 4,
          title: 'The Milky Way Galaxy',
          content: 'Our galaxy contains an estimated 100-400 billion stars and is about 100,000 light-years in diameter. The Sun is located about 27,000 light-years from the galactic center.'
        },
        {
          id: 5,
          title: 'Jupiter\'s Great Red Spot',
          content: 'Jupiter\'s Great Red Spot is a massive storm that has been raging for at least 400 years. It\'s so large that Earth could fit inside it, and winds can reach speeds of up to 430 km/h.'
        },
        {
          id: 6,
          title: 'International Space Station',
          content: 'The ISS orbits Earth at an average altitude of 408 kilometers and travels at approximately 28,000 km/h, completing one orbit every 90 minutes. It\'s the largest human-made object in space.'
        },
        {
          id: 7,
          title: 'Saturn\'s Rings',
          content: 'Saturn\'s rings are made primarily of ice particles and rocky debris, ranging from tiny grains to house-sized chunks. The rings extend up to 282,000 kilometers from the planet.'
        },
        {
          id: 8,
          title: 'The Moon\'s Formation',
          content: 'Scientists believe the Moon formed about 4.5 billion years ago when a Mars-sized object collided with early Earth, ejecting material that eventually coalesced into our Moon.'
        },
        {
          id: 9,
          title: 'Neutron Stars',
          content: 'Neutron stars are the densest objects in the universe (excluding black holes). A teaspoon of neutron star material would weigh about 6 billion tons on Earth.'
        },
        {
          id: 10,
          title: 'The James Webb Space Telescope',
          content: 'Launched in 2021, the JWST can see back in time to just 200 million years after the Big Bang. It operates at the L2 Lagrange point, 1.5 million kilometers from Earth.'
        },
        {
          id: 11,
          title: 'Venus: The Hottest Planet',
          content: 'Despite being farther from the Sun than Mercury, Venus is the hottest planet in our solar system with surface temperatures reaching 462°C due to its thick, toxic atmosphere.'
        },
        {
          id: 12,
          title: 'Exoplanets',
          content: 'As of 2024, over 5,000 exoplanets have been confirmed. The closest potentially habitable exoplanet, Proxima Centauri b, is just 4.24 light-years away.'
        },
        {
          id: 13,
          title: 'Solar Flares',
          content: 'Solar flares are massive explosions on the Sun that release energy equivalent to millions of 100-megaton hydrogen bombs. They can disrupt communications and power grids on Earth.'
        },
        {
          id: 14,
          title: 'The Oort Cloud',
          content: 'The Oort Cloud is a theoretical spherical shell of icy objects surrounding our solar system, extending up to 100,000 astronomical units from the Sun. It\'s the source of long-period comets.'
        },
        {
          id: 15,
          title: 'Time Dilation',
          content: 'According to Einstein\'s theory of relativity, time moves slower in stronger gravitational fields. Astronauts on the ISS age slightly slower than people on Earth due to time dilation.'
        },
        {
          id: 16,
          title: 'The Goldilocks Zone',
          content: 'The habitable zone, or "Goldilocks zone," is the region around a star where conditions might be right for liquid water to exist on a planet\'s surface, making life possible.'
        },
        {
          id: 17,
          title: 'Dark Matter and Dark Energy',
          content: 'Dark matter makes up about 27% of the universe, and dark energy about 68%. Together, they account for 95% of the universe\'s total mass-energy, yet we can\'t directly observe them.'
        },
        {
          id: 18,
          title: 'The Voyager Probes',
          content: 'Voyager 1 and 2, launched in 1977, are the farthest human-made objects from Earth. Voyager 1 entered interstellar space in 2012 and is now over 24 billion kilometers away.'
        },
        {
          id: 19,
          title: 'Asteroid Belt',
          content: 'The asteroid belt between Mars and Jupiter contains millions of asteroids, but they\'re spread so far apart that a spacecraft can pass through without hitting anything.'
        },
        {
          id: 20,
          title: 'The Big Bang',
          content: 'The universe began approximately 13.8 billion years ago in an event called the Big Bang. All matter, energy, space, and time originated from an infinitely dense point.'
        },
        {
          id: 21,
          title: 'Pulsars',
          content: 'Pulsars are rapidly rotating neutron stars that emit beams of radiation. They can rotate hundreds of times per second and are used as cosmic lighthouses for navigation.'
        },
        {
          id: 22,
          title: 'The Kuiper Belt',
          content: 'Beyond Neptune lies the Kuiper Belt, a region containing thousands of icy objects including Pluto. It extends from about 30 to 55 astronomical units from the Sun.'
        }
      ],
      documentaries: [
        {
          id: 1,
          title: 'Cosmos: A Spacetime Odyssey - National Geographic',
          description: 'Neil deGrasse Tyson hosts this epic journey through space and time, exploring the universe from the Big Bang to the search for life on other planets. A visually stunning exploration of our cosmic origins.',
          url: 'https://www.youtube.com/results?search_query=Cosmos+A+Spacetime+Odyssey+Neil+deGrasse+Tyson',
          thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop'
        },
        {
          id: 2,
          title: 'The Planets - BBC Documentary',
          description: 'A BBC documentary series exploring the planets of our solar system. From the scorching surface of Venus to the icy moons of Jupiter, discover the incredible worlds that orbit our Sun.',
          url: 'https://www.youtube.com/results?search_query=The+Planets+BBC+Documentary',
          thumbnail: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=600&fit=crop'
        },
        {
          id: 3,
          title: 'Apollo 11: First Steps Edition - NASA',
          description: 'Experience the historic Apollo 11 mission that first landed humans on the Moon. This documentary uses restored archival footage to tell the complete story of humanity\'s greatest adventure.',
          url: 'https://www.youtube.com/results?search_query=Apollo+11+Documentary+NASA',
          thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=600&fit=crop'
        },
        {
          id: 4,
          title: 'The Universe - History Channel',
          description: 'A comprehensive History Channel series exploring the mysteries of the cosmos. From black holes to the search for alien life, journey through the vastness of space and time.',
          url: 'https://www.youtube.com/results?search_query=The+Universe+History+Channel+Documentary',
          thumbnail: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop'
        },
        {
          id: 5,
          title: 'Mars Exploration - NASA Documentary',
          description: 'Follow NASA\'s journey to Mars through the eyes of the Perseverance rover and other missions. Discover the challenges and discoveries of exploring the Red Planet.',
          url: 'https://www.youtube.com/results?search_query=Mars+Exploration+NASA+Documentary',
          thumbnail: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=600&fit=crop'
        },
        {
          id: 6,
          title: 'Wonders of the Solar System - BBC',
          description: 'Professor Brian Cox takes viewers on a journey through our solar system, exploring the beauty and science of planets, moons, and asteroids. Discover the forces that shaped our cosmic neighborhood.',
          url: 'https://www.youtube.com/results?search_query=Wonders+of+the+Solar+System+Brian+Cox',
          thumbnail: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800&h=600&fit=crop'
        },
        {
          id: 7,
          title: 'James Webb Space Telescope - NASA',
          description: 'Explore the James Webb Space Telescope and its groundbreaking discoveries. Learn about the most powerful space telescope ever built and its mission to see the first galaxies.',
          url: 'https://www.nasa.gov/mission_pages/webb/main/index.html',
          thumbnail: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=600&fit=crop'
        },
        {
          id: 8,
          title: 'Black Holes: The Edge of All We Know - PBS',
          description: 'Follow scientists as they attempt to photograph a black hole for the first time. This documentary explores the Event Horizon Telescope project and the mysteries of black holes.',
          url: 'https://www.youtube.com/results?search_query=Black+Holes+The+Edge+of+All+We+Know+PBS',
          thumbnail: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c50?w=800&h=600&fit=crop'
        }
      ]
    };

    res.json(premiumContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public content (no subscription required)
router.get('/public', async (req, res) => {
  try {
    const publicContent = {
      images: [
        {
          id: 1,
          title: 'Earth from Space',
          url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800'
        },
        {
          id: 2,
          title: 'The Moon',
          url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800'
        }
      ],
      facts: [
        {
          id: 1,
          title: 'Our Solar System',
          content: 'The solar system consists of the Sun and eight planets, along with numerous moons, asteroids, and comets.'
        }
      ]
    };

    res.json(publicContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

