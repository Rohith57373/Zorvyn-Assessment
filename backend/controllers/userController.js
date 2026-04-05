const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!['viewer', 'analyst', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role assignment.' });
        }
        
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found.' });

        user.role = role;
        await user.save();
        
        res.json({ message: 'User role updated successfully.', user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user status (active/inactive)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res, next) => {
    try {
        const { isActive } = req.body;
        
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found.' });

        user.isActive = Boolean(isActive);
        await user.save();
        
        res.json({ message: 'User status updated successfully.', user });
    } catch (error) {
        next(error);
    }
};

// @desc    Create user natively as Admin
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res, next) => {
    try {
        const bcrypt = require('bcryptjs');
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const safeRole = role && ['viewer', 'analyst', 'admin'].includes(role) ? role : 'viewer';

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: safeRole,
            isActive: true
        });
        
        user.password = undefined; // prevent leak
        res.status(201).json({ message: 'User provisioned successfully', user });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, updateUserRole, updateUserStatus, createUser };
