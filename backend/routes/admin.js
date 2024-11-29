const express = require('express');
const router = express.Router();
const cors = require('cors');

// Middleware
router.use(cors());
router.use(express.json());

// Get patients
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, { fullname: 1, email: 1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Get appointments
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error });
    }
});

// Check out an appointment
router.post('/appointments/checkout/:id', async (req, res) => {
    try {
        const appointmentId = req.params.id;
        await Appointment.findByIdAndUpdate(appointmentId, { status: 'Checked Out' });
        res.json({ message: 'Appointment marked as checked out' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating appointment', error });
    }
});

// Add doctor
router.post('/add-doctor', async (req, res) => {
    try {
        const { name, specialization } = req.body;
        const newDoctor = new Doctor({ name, specialization });
        await newDoctor.save();
        res.json({ message: 'Doctor added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding doctor', error });
    }
});

// Get doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find({}, { name: 1, specialization: 1 });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error });
    }
});

// Delete a doctor
router.delete('/doctors/:id', async (req, res) => {
    try {
        const doctorId = req.params.id;
        await Doctor.findByIdAndDelete(doctorId);
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting doctor', error });
    }
});

module.exports = router;
