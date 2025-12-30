const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// --- Helper Function: Generate JWT Token ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// --- 1. Register User (Signup) ---
// Route: POST /api/users/register
const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 2. Login User ---
// Route: POST /api/users/login
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
  
  // 👇 YE 2 LINES ADD KARO (Last Login Time Update)
  user.lastLogin = Date.now();
  await user.save(); 
  // ------------------------------------------------

  res.json({
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status, // Status bhi bhej dete hain
    token: generateToken(user._id),
  });
} else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    // --- DEBUG LOGGING ADDED ---
    console.error("LOGIN ERROR:", error); // Ye error terminal me print karega
    res.status(500).json({ message: error.message });
  }
};

// --- 3. Get User Profile (Protected) ---
// Route: GET /api/users/profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// --- 4. Update User Profile (Protected) ---
// Route: PUT /api/users/profile
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Agar user ne naya password bheja hai, to hi update karo
    if (req.body.password) {
      // Salt aur Hash Model handle karega agar hum seedha save karenge,
      // lekin hum manually bhi kar sakte hain safe side ke liye agar middleware issue kare:
      // Note: User Model ka 'pre-save' middleware password hash kar lega.
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// --- 5. Get All Users (Admin Only) ---
// Route: GET /api/users
const getUsers = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const count = await User.countDocuments({});
  const users = await User.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ users, page, pages: Math.ceil(count / pageSize) });
};

// --- 6. Delete User (Admin Only) ---
// Route: DELETE /api/users/:id
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// --- 7. Update User Status/Role (Admin Only) ---
// Route: PUT /api/users/:id
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.status = req.body.status || user.status;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
  
module.exports = {
  registerUser,
  loginUser,
  getMe,
  getAllUsers,
  deleteUser,
  updateUser,        // Ye Admin wala update hai
  updateUserProfile, // <--- YE NAYA WALA ADD KARO (User khud ke liye)
};