const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { generateOTP, sendOTP } = require('../utils/OTP');

// Signup function
const signup = async (req, res, next) => {
    try {
        const { username, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 400;
            throw error;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({ username, email, phone, password: hashedPassword });
        await user.save();

        // Generate and save OTP
        const otp = generateOTP();
        const otpRecord = new OTP({ email, otp });
        await otpRecord.save();
        await sendOTP(email, otp);

        res.status(201).json({ message: 'User created. OTP sent to email.', otp });
    } catch (error) {
        next(error);
    }
};

// Login function 
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        // Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};

// Verify OTP function
const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        // Find OTP record
        const otpRecord = await OTP.findOne({ email, otp });
        if (!otpRecord) {
            const error = new Error('Invalid OTP');
            error.statusCode = 400;
            throw error;
        }

        // Delete OTP record after verification
        await OTP.deleteOne({ email, otp });

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        next(error);
    }
};

// Export functions
module.exports = { signup, login, verifyOTP };