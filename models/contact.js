const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  plan: { type: String },
  projectType: { type: String },
  message: { type: String },
  isRead: { type: Boolean, default: false },
  isReplyed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);
