const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3027;

// Database and Routes
const mysql = require('./backend/models/db');
const patientRoutes = require('./backend/routes/patients');
const authRoutes = require('./backend/routes/auth');
const adminRoutes = require('./backend/routes/admin');

// Middleware
app.use(cors()); // Apply CORS globally
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'telemedicine_secret', resave: false, saveUninitialized: true }));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'frontend')));

// Mount Routes
app.use('/patient', patientRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// Default Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/patient', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'patient.html'));
});
app.get('/book', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'book.html'));
});
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'admin.html'));
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
