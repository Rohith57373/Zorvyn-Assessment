const express = require('express');
const router = express.Router();
const { 
    getSummary, 
    getCategoryBreakdown, 
    getTrends 
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Allowed: Admin, Analyst, Viewer
router.get('/summary', getSummary);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/trends', getTrends);

module.exports = router;
