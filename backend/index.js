const express = require('express');
const App = express();
App.use(express.json());

const mongoose = require('mongoose');

try {
  mongoose.connect("mongodb://localhost:27017/Learning");
  console.log("MongoDB connected");
} catch (error) {
  console.log("Error connecting to MongoDB:", error);
}

// User Schema and Model
const dataSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Password: String,
});

const User = mongoose.model('Data', dataSchema);

// Entry Schema and Model
const entrySchema = new mongoose.Schema({
  Email: String,          // associate with user email
  description: String,
  amount: Number,
  type: {                 // debit or credit
    type: String,
    enum: ['debit', 'credit'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Entry = mongoose.model('Entry', entrySchema);

const port = 3001;

// Register new user
App.post('/', (req, res) => {
  let data = req.body;

  const NewData = new User({
    Name: data.Name,
    Email: data.Email,
    Password: data.Password,
  });

  NewData.save()
    .then(() => res.send("Data received and user registered"))
    .catch(err => {
      console.error("Error saving user:", err);
      res.status(500).send("Error registering user");
    });
});

// Login user
App.post('/login', async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const existingUser = await User.findOne({ Email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existingUser.Password !== Password) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    return res.status(200).json({ message: "Login successful", userr: existingUser });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: "Network error" });
  }
});

// Add new entry for a user
App.post('/mainn', async (req, res) => {
  const { Email, description, amount, type } = req.body;

  if (!Email || !description || !amount || !type) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const newEntry = new Entry({
      Email,
      description,
      amount,
      type,
    });

    await newEntry.save();

    res.status(200).json({ message: "Entry submitted", entry: newEntry });
  } catch (error) {
    console.error("Error saving entry:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all entries for a user by email
App.get('/mainn/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const entries = await Entry.find({ Email: email }).sort({ createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching entries:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update entry by ID
App.put('/mainn/:id', async (req, res) => {
  const id = req.params.id;
  const { description, amount, type } = req.body;

  try {
    const updated = await Entry.findByIdAndUpdate(id, { description, amount, type }, { new: true });
    if (!updated) return res.status(404).json({ message: "Entry not found" });
    res.status(200).json({ message: "Entry updated", entry: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete entry by ID
App.delete('/mainn/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deleted = await Entry.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Entry not found" });
    res.status(200).json({ message: "Entry deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

App.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
