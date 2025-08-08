const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Tree = require('./models/Tree');

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public')); // to serve CSSnpm start
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Routes
app.get('/', async (req, res) => {
  const trees = await Tree.find();
  res.render('index', { trees });
});

app.get('/add', (req, res) => {
  res.render('add', { error: null });
});

app.post('/add', async (req, res) => {
  const { treename, description, image } = req.body;
  if (!treename || !description) {
    return res.render('add', { error: 'Tree name and description are required!' });
  }
  await Tree.create({ treename, description, image });
  res.redirect('/');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.post('/reset', async (req, res) => {
  await Tree.deleteMany();
  res.redirect('/');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
