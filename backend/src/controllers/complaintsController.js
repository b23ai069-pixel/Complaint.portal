const Complaint = require('../models/Complaint');
const User = require('../models/User');

// CREATE
exports.createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    const trackingId =
      "CP-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    const complaint = new Complaint({
      title,
      description,
      user: req.user._id,   // ✅ IMPORTANT
      trackingId
    });

    await complaint.save();

    res.json({
      success: true,
      complaint
    });

  } catch (err) {
    res.status(500).json({ message: "Error creating complaint" });
  }
};


// TRACK (FIXED)
exports.trackComplaint = async (req, res) => {
  try {
    const { trackingId } = req.params;

    const complaint = await Complaint.findOne({
      trackingId: {
        $regex: new RegExp("^" + trackingId + "$", "i")
      }
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ complaint });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getComplaintByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    const complaints = await Complaint.find({ user: user._id });
    
    if (!complaints || complaints.length === 0) {
      return res.status(404).json({ message: "No complaints found for this email" });
    }

    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getComplaintByTrackingId = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      trackingId: req.params.trackingId
    });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    // ✅ IMPORTANT: return as array
    res.json({
      complaints: [complaint]
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};