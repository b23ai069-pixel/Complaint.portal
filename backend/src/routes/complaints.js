const express = require('express');
const router = express.Router();

const {
  createComplaint,
  trackComplaint,
  getComplaintByEmail,
  getUserComplaints,
  getAllComplaints,
  updateComplaintStatus
} = require('../controllers/complaintsController');

const { protect } = require('../middleware/authMiddleware');

// protected
router.post('/', protect, createComplaint);
router.get('/', protect, getUserComplaints);
router.get('/all', protect, getAllComplaints);
router.patch('/:id/status', protect, updateComplaintStatus);

// public
router.get('/track/:trackingId', trackComplaint);
router.get('/by-email/:email', getComplaintByEmail);

module.exports = router;