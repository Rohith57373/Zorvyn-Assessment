const Record = require('../models/Record');

// @desc    Get dashboard summary (Totals & Net Balance)
// @route   GET /api/dashboard/summary
// @access  Private (All Roles)
const getSummary = async (req, res, next) => {
    try {
        const records = await Record.aggregate([
            { $match: { isDeleted: false } },
            { 
                $group: { 
                    _id: "$type", 
                    totalAmount: { $sum: "$amount" } 
                } 
            }
        ]);

        let totalIncome = 0;
        let totalExpenses = 0;

        records.forEach(item => {
            if (item._id === 'income') totalIncome = item.totalAmount;
            if (item._id === 'expense') totalExpenses = item.totalAmount;
        });

        res.json({
            totalIncome,
            totalExpenses,
            netBalance: totalIncome - totalExpenses
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get category-wise breakdown
// @route   GET /api/dashboard/category-breakdown
// @access  Private (All Roles)
const getCategoryBreakdown = async (req, res, next) => {
    try {
        const breakdown = await Record.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: { type: "$type", category: "$category" },
                    totalAmount: { $sum: "$amount" }
                }
            },
            {
                $group: {
                    _id: "$_id.type",
                    categories: {
                        $push: {
                            category: "$_id.category",
                            total: "$totalAmount"
                        }
                    }
                }
            }
        ]);

        res.json(breakdown);
    } catch (error) {
        next(error);
    }
};

// @desc    Get recent trends (by month)
// @route   GET /api/dashboard/trends
// @access  Private (All Roles)
const getTrends = async (req, res, next) => {
    try {
        const trends = await Record.aggregate([
            { $match: { isDeleted: false } },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        type: "$type"
                    },
                    totalAmount: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        res.json(trends);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSummary,
    getCategoryBreakdown,
    getTrends
};
