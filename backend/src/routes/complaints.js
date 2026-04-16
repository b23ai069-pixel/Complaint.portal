const express = require('express');
const router = express.Router();

const {
  createComplaint,
  trackComplaint,
  getComplaintByEmail
} = require('../controllers/complaintsController');

const { protect } = require('../middleware/authMiddleware');

// protected
router.post('/', protect, createComplaint);

// public
router.get('/track/:trackingId', trackComplaint);
router.get('/by-email/:email', getComplaintByEmail);

module.exports = router;