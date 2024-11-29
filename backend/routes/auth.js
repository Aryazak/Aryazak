const express = require('express');
const db = require('../models/db');
const router = express.Router();
const config = require('./config');
const cors = require('cors');
router.use(cors());


// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check if the user is admin
    if (email === config.admin.email && password === config.admin.password) {
        // Admin Login
        req.session.user = { role: 'admin', name: config.admin.name }; // Set admin session
        return res.redirect('/admin.html'); 
    }

    // Check other roles using the database
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal server error');
        }

        if (results.length > 0) {
            // Set session based on role and redirect
            req.session.user = results[0];
            res.redirect(results[0].role === 'admin' ? '/admin' : '/patient');
        } else {
            // Invalid credentials
            res.status(401).send('Invalid credentials');
        }
    });
});

// Register
router.post('/register', (req, res) => {
    const { name, email, password, role } = req.body;
    db.query('INSERT INTO users (Fullname, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, role], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});
router.post('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Could not log out.');
            }
            res.redirect('/'); 
        });
    } else {res.redirect('/');}
});
router.get('/welcome', (req, res) => {
    if (req.session && req.session.user) {
        const userEmail = req.session.user.email; 

        // Fetch user's name from the database
        db.query('SELECT Fullname FROM users WHERE email = ?', [userEmail], (err, results) => {
            if (err) {
                return res.status(500).send('Error fetching user data');
            }

            if (results.length > 0) {
                const patientName = results[0].Fullname;
                res.json({ patientName }); 
            } else {
                res.status(404).send('User not found');
            }
        });
    } else {
        res.status(401).send('Please log in first');
    }
});



module.exports = router;
