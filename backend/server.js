const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ FIXED PATHS (your routes are inside src)
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/complaints', require('./src/routes/complaints'));

// DB CONNECTION
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});