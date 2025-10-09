"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeRequest = sanitizeRequest;
exports.validateRequest = validateRequest;
const express_validator_1 = require("express-validator");
function sanitizeRequest(req, res, next) {
    try {
        if (req.body && typeof req.body === "object") {
        }
        Object.keys(req.body).forEach((key) => {
            if (typeof req.body[key] === "string") {
                req.body[key] = req.body[key].trim().toLowerCase();
            }
        });
        if (req.query && typeof req.query === "object") {
            Object.keys(req.query).forEach((key) => {
                if (typeof req.query[key] === "string") {
                    req.query[key] = req.query[key].trim().toLowerCase();
                }
            });
        }
        next();
    }
    catch (error) {
        console.error("Sanitize error:", error);
        res.status(400).json({
            error: "invalid request format",
        });
    }
}
function validateRequest(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array(),
        });
    }
    next();
}
//# sourceMappingURL=validateRequest.js.map