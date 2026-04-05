const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { tlsAllowInvalidCertificates: true });

        const email = process.argv[2];

        if (!email) {
            console.error("Usage: node makeAdmin.js <user-email>");
            process.exit(1);
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.error(`No user found for email: ${email}`);
            process.exit(1);
        }

        user.role = 'admin';
        user.isActive = true;
        await user.save();

        console.log(`Success! ${email} has been upgraded to admin privileges.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
