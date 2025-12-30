const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: String,
      default: 'user', // user | admin
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'inactive'],
    },
    // 👇 Timestamp Requirement poori karne ke liye
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Ye apne aap 'createdAt' aur 'updatedAt' bana dega
  }
);

// --- PASSWORD HASHING MIDDLEWARE ---
// Ye code sirf tab chalega jab password change hoga.
// Agar hum 'lastLogin' update karenge, to ye skip ho jayega (Important Fix)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password match karne ka helper function
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;