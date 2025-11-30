const express = require('express');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

router.post('/search', async (req, res) => {
  try {
    const { latitude, longitude, radius, type } = req.body;

    if (!latitude || !longitude || !radius) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const radiusInMeters = radius * 1000;
    const location = `${latitude},${longitude}`;

    let placeTypes = [];
    switch (type) {
      case 'pharmacies':
        placeTypes = ['pharmacy'];
        break;
      case 'hospitals':
        placeTypes = ['hospital'];
        break;
      case 'clinics':
        placeTypes = ['doctor', 'health'];
        break;
      case 'medical_centers':
        placeTypes = ['hospital', 'health'];
        break;
      default:
        placeTypes = ['pharmacy', 'hospital', 'doctor', 'health'];
    }

    const results = [];

    for (const placeType of placeTypes) {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            location,
            radius: radiusInMeters,
            type: placeType,
            key: config.GOOGLE_MAPS_API_KEY
          }
        }
      );

      if (response.data.results) {
        results.push(...response.data.results);
      }
    }

    const processedResults = results.map(place => ({
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating || 0,
      types: place.types,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      category: getCategory(place.types)
    }));

    res.json({
      success: true,
      results: processedResults,
      count: processedResults.length
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function getCategory(types) {
  if (types.includes('pharmacy')) return 'pharmacies';
  if (types.includes('hospital')) return 'hospitals';
  if (types.includes('doctor') || types.includes('health')) return 'clinics';
  return 'medical_centers';
}

module.exports = router;
