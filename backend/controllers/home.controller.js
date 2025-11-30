import Hospital from '../models/Hospital.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getNearbyHospitals = asyncHandler(async (req, res) => {
  const { latitude, longitude, radius = 30000, type } = req.query;

  if (!latitude || !longitude) {
    throw new ApiError(400, 'خط العرض وخط الطول مطلوبان');
  }

  const query = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: parseInt(radius)
      }
    },
    isActive: true
  };

  if (type && type !== 'all') {
    query.type = type;
  }

  const hospitals = await Hospital.find(query).limit(50);

  const hospitalsWithDistance = hospitals.map(hospital => {
    const distance = calculateDistance(
      parseFloat(latitude),
      parseFloat(longitude),
      hospital.location.coordinates[1],
      hospital.location.coordinates[0]
    );
    return {
      ...hospital.toObject(),
      distance: parseFloat(distance.toFixed(2))
    };
  });

  hospitalsWithDistance.sort((a, b) => a.distance - b.distance);

  res.status(200).json(
    new ApiResponse(200, hospitalsWithDistance, 'تم جلب المراكز الطبية بنجاح')
  );
});

export const searchHospitals = asyncHandler(async (req, res) => {
  const { query, governorate, city, type } = req.query;

  const searchQuery = { isActive: true };

  if (query) {
    searchQuery.$text = { $search: query };
  }

  if (governorate) {
    searchQuery.governorate = governorate;
  }

  if (city) {
    searchQuery.city = city;
  }

  if (type && type !== 'all') {
    searchQuery.type = type;
  }

  const hospitals = await Hospital.find(searchQuery).limit(100);

  res.status(200).json(
    new ApiResponse(200, hospitals, 'تم البحث بنجاح')
  );
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}



