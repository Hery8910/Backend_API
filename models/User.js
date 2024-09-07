const { Schema, model } = require('mongoose');
const { compare, genSalt, hash } = require('bcryptjs');

const userSchema = Schema({
  name: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { type: String, default: 'client' }, 
  isVerified: { type: Boolean, default: false }, 
  address: { type: String, default: "" }, 
  phone: { type: String, default: "" } 
}, {
  timestamps: true
});

// Instance method to compare entered password with the hashed password stored in the database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await compare(enteredPassword, this.password); // Compare entered password with hashed password
};

// Pre-save middleware to hash the password before saving the user document to the database
userSchema.pre('save', async function(next) {
  // If the password field has not been modified, skip the hashing
  if (!this.isModified('password')) {
    next(); // Move to the next middleware or save operation
  }
  // Generate a salt for hashing the password
  const salt = await genSalt(10);
  // Hash the password using bcrypt and save the hashed password to the user object
  this.password = hash(this.password, salt);
});

// Create the User model from the schema
const User = model('User', userSchema);

module.exports = User; // Export the User model
