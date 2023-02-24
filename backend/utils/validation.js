const { validationResult } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {

        const errors = validationErrors.errors.map((error) => {
            return `${error.msg}`
        });

        const err = Error('Bad Request');
        err.errors = errors;
        err.status = 400;
        err.title = 'Bad request.';
        next(err);
    }
    next();
};

module.exports = { handleValidationErrors };
