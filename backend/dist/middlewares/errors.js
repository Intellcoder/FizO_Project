"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customError = void 0;
exports.default = ErrorHandler;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
const customError = (message, statusCode) => {
    return new CustomError(message, statusCode);
};
exports.customError = customError;
function ErrorHandler(err, req, res, next) {
    if (err instanceof CustomError) {
        return res
            .status(err.statusCode)
            .json({ success: false, message: err.message });
    }
}
//# sourceMappingURL=errors.js.map