require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors()); // enable CORS for all routes (can be adjusted later)

// Create a new item
const connectDB = require('./utils/db');
connectDB();

const Contact = require('./models/contact');
const Subscriber = require('./models/subscriber');
const authenticate = require('./middleware/auth');

// Apply authentication middleware to all routes below
app.use(authenticate);

// Get all contacts from MongoDB
app.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get unread contacts from MongoDB
app.get('/contacts/unread', async (req, res) => {
  try {
    const contacts = await Contact.find({ isRead: false });
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get read contacts from MongoDB
app.get('/contacts/read', async (req, res) => {
  try {
    const contacts = await Contact.find({ isRead: true });
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// Get all subscribers from MongoDB
app.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.status(200).json(subscribers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Make contact read
app.patch('/contacts/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    // Directly set isRead to true without requiring a request body
    const updated = await Contact.findByIdAndUpdate(id, { isRead: true }, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ message: 'Contact not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Make contact replied
app.patch('/contacts/:id/replyed', async (req, res) => {
  try {
    const { id } = req.params;
    // Directly set isReplyed to true without requiring a request body
    const updated = await Contact.findByIdAndUpdate(id, { isReplyed: true }, { returnDocument: 'after' });
    if (!updated) return res.status(404).json({ message: 'Contact not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact
app.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Contact not found' });
    res.status(200).json({ message: 'Contact deleted successfully', contact: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete subscriber
app.delete('/subscribers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Subscriber.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await Subscriber.findOneAndDelete({ email: id.toLowerCase().trim() });
    }
    if (!deleted) return res.status(404).json({ message: 'Subscriber not found' });
    res.status(200).json({ message: 'Subscriber deleted successfully', subscriber: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
