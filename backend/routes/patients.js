const express = require('express');
const db = require('../models/db'); // Assuming db is set up correctly
const router = express.Router();
const cors = require('cors');

// Apply CORS middleware to this router
router.use(cors());

// Book appointment
router.post('/book', (req, res) => {
    const { email, doctorId, appointmentdate } = req.body;

    // Fetch doctorName from the database based on the selected doctorId
    const queryDoctorName = 'SELECT name FROM doctors WHERE id = ?';

    db.query(queryDoctorName, [doctorId], (err, doctorResults) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching doctor name', error: err });
        }

        if (doctorResults.length > 0) {
            const doctorName = doctorResults[0].name;

            // Now insert the appointment with doctorName
            const insertQuery = 'INSERT INTO appointment (email, doctorName, appointmentdate) VALUES (?, ?, ?)';
            db.query(insertQuery, [email, doctorName, appointmentdate], (err, insertResults) => {
                if (err) {
                    return res.status(500).json({ message: 'Error booking appointment', error: err });
                }

                res.status(200).json({ message: 'Appointment booked successfully' });
            });
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    });
});

// Get doctors
router.get('/doctors', (req, res) => {
    db.query('SELECT * FROM doctors', (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching doctors', error: err });
        }
        res.json(results);
    });
});

module.exports = router;
