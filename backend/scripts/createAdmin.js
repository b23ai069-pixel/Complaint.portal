const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// ✅ FORCE LOAD .env from root
dotenv.config({ path: './.env' });

console.log("MONGO_URI:", process.env.MONGODB_URI); // debug

const User = require('../src/models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

const createAdmin = async () => {
  try {
    const hashed = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashed,
      role: "admin"
    });

    console.log("✅ Admin created successfully");
    process.exit();

  } catch (err) {
    console.log(err);
    process.exit();
  }
};

createAdmin();