const { check, validationResult } = require('express-validator');

exports.recordValidator = [
    check('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .custom((value) => value > 0)
        .withMessage('Amount must be structurally valid (> 0)'),
    check('type')
        .isIn(['income', 'expense'])
        .withMessage('Type must be either income or expense'),
    check('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),
    check('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid ISO8601 string'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
