import express from 'express';
import { getNearbyHospitals, searchHospitals } from '../controllers/home.controller.js';

const router = express.Router();

router.get('/nearby', getNearbyHospitals);
router.get('/search', searchHospitals);

export default router;



