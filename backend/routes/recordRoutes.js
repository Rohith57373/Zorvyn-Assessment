const express = require('express');
const router = express.Router();
const { 
    createRecord, 
    getRecords, 
    updateRecord, 
    deleteRecord 
} = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { recordValidator } = require('../utils/validators');

// Protect all routes
router.use(protect);

// Allowed: Admin + Analyst
router.get('/', authorize('admin', 'analyst'), getRecords);

// Allowed: Admin only
router.post('/', authorize('admin'), recordValidator, createRecord);
router.put('/:id', authorize('admin'), recordValidator, updateRecord);
router.delete('/:id', authorize('admin'), deleteRecord);

module.exports = router;
