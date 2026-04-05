const Record = require('../models/Record');

// @desc    Create a new record
// @route   POST /api/records
// @access  Private (Admin)
const createRecord = async (req, res, next) => {
    try {
        const { amount, type, category, date, notes } = req.body;
        const record = await Record.create({
            user: req.user.id,
            amount,
            type,
            category,
            date,
            notes
        });
        res.status(201).json(record);
    } catch (error) {
        next(error);
    }
};

// @desc    Get configured records (Pagination, Filters, Search)
// @route   GET /api/records
// @access  Private (Analyst, Admin)
const getRecords = async (req, res, next) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            type, 
            category, 
            startDate, 
            endDate,
            search 
        } = req.query;

        const query = { isDeleted: false }; // Ensure we do not fetch soft-deleted fields

        // Filters setup
        if (type) query.type = type;
        if (category) query.category = category;
        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (startDate) {
            query.date = { $gte: new Date(startDate) };
        } else if (endDate) {
            query.date = { $lte: new Date(endDate) };
        }

        // Search logic using $regex for notes or category
        if (search) {
            query.$or = [
                { category: { $regex: search, $options: 'i' } },
                { notes: { $regex: search, $options: 'i' } }
            ];
        }

        const options = {
            skip: (parseInt(page) - 1) * parseInt(limit),
            limit: parseInt(limit),
            sort: { date: -1 } // newest first
        };

        const totalRecords = await Record.countDocuments(query);
        const records = await Record.find(query, null, options).populate('user', 'name email');

        res.json({
            data: records,
            meta: {
                total: totalRecords,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(totalRecords / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a record
// @route   PUT /api/records/:id
// @access  Private (Admin)
const updateRecord = async (req, res, next) => {
    try {
        const record = await Record.findById(req.params.id);

        if (!record || record.isDeleted) {
            return res.status(404).json({ message: 'Record not found' });
        }

        const updatedRecord = await Record.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );

        res.json(updatedRecord);
    } catch (error) {
        next(error);
    }
};

// @desc    Soft Delete a record
// @route   DELETE /api/records/:id
// @access  Private (Admin)
const deleteRecord = async (req, res, next) => {
    try {
        const record = await Record.findById(req.params.id);

        if (!record || record.isDeleted) {
            return res.status(404).json({ message: 'Record not found' });
        }

        record.isDeleted = true;
        await record.save();

        res.json({ message: 'Record successfully deleted (soft)' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord
};
