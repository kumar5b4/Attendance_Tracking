const nodemailer = require('nodemailer');
const crypto = require('crypto');
const ResetCode = require('../Models/ResetCode');


function generatePasscode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Ensures a 6-digit string
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'praveen.codefacts@gmail.com', // Replace with your email
        pass: 'B@nk1234' // Replace with your password or app-specific password
    }
});

// Function to send the passcode via email
async function sendPasscode(email, passcode) {
    const mailOptions = {
        from: 'praveen.codefacts@gmail.com',
        to: email,
        subject: 'Your Password Reset Code',
        text: `Your 6-digit password reset code is: ${passcode}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Passcode sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

// Controller function for handling reset requests
const sendResetCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Generate a passcode
    const passcode = generatePasscode();

    try {
        // Send the passcode via email
        await sendPasscode(email, passcode);

        // Save the passcode and email in the database
        await ResetCode.create({ email, passcode, expiresAt: Date.now() + 10 * 60 * 1000 });

        res.status(200).json({ message: 'Passcode sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send passcode' });
    }
};

// Middleware for verifying the passcode
const verifyPasscode = async (req, res) => {
    const { email, passcode } = req.body;

    if (!email || !passcode) {
        return res.status(400).json({ error: 'Email and passcode are required' });
    }

    try {
        // Check if the passcode exists and is valid
        const resetCode = await ResetCode.findOne({ email, passcode });

        if (!resetCode) {
            return res.status(400).json({ error: 'Invalid or expired passcode' });
        }

        // Optionally, delete the passcode after use
        await ResetCode.deleteOne({ _id: resetCode._id });

        res.status(200).json({ message: 'Passcode verified successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to verify passcode' });
    }
};



module.exports = { verifyPasscode , sendResetCode }