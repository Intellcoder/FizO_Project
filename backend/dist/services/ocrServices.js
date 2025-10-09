"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractTextFromImage = extractTextFromImage;
const string_similarity_js_1 = __importDefault(require("string-similarity-js"));
const tesseract_js_1 = __importDefault(require("tesseract.js"));
async function extractTextFromImage(filePath) {
    const { data: { text }, } = await tesseract_js_1.default.recognize(filePath, "eng");
    const normalized = text.toLowerCase();
    const words = normalized.split(/\s+/);
    let hours = 0, minutes = 0, seconds = 0;
    let todaysHours = null;
    const todayIndex = words.findIndex((w) => (0, string_similarity_js_1.default)(w, "today") > 0.6);
    const unitMap = {
        hours: "hours",
        hour: "hours",
        h: "hours",
        mins: "minutes",
        min: "minutes",
        minds: "minutes",
        mites: "minutes",
        minutes: "minutes",
        seconds: "seconds",
        sec: "seconds",
        smconds: "seconds",
        s: "seconds",
    };
    const isValidTimeValue = (value, unit) => {
        if (!unit)
            return false;
        if (unit === "hours")
            return value >= 0 && value <= 12;
        if (unit === "minutes" || unit === "seconds")
            return value >= 0 && value < 60;
        return false;
    };
    if (todayIndex !== -1) {
        const timeRegex = /(\d+)\s*(hours?|minutes?|seconds?)/i;
        let foundHours = false, foundMinutes = false, foundSeconds = false;
        const proximityWords = words.slice(todayIndex + 1, todayIndex + 1 + 50);
        for (const item of proximityWords) {
            const match = item.match(timeRegex);
            if (match) {
                const value = parseInt(match[1], 10);
                const rawUnit = (match[2] || "").toLowerCase();
                const unit = unitMap[rawUnit] || null;
                if (isValidTimeValue(value, unit)) {
                    if (unit === "hours" && !foundHours) {
                        hours = value;
                        foundHours = true;
                    }
                    else if (unit === "minutes" && !foundMinutes) {
                        minutes = value;
                        foundMinutes = true;
                    }
                    else if (unit === "seconds" && !foundSeconds) {
                        seconds = value;
                        foundSeconds = true;
                    }
                }
                if (foundHours && foundMinutes && foundSeconds)
                    break;
            }
        }
        if (foundHours || foundMinutes || foundSeconds) {
            todaysHours = `${hours} hours ${minutes} minutes ${seconds} seconds`;
        }
    }
    if (!todaysHours) {
        const fallbackMatch = normalized.match(/(\d+)\s*([a-zA-Z]*)?/gi);
        if (fallbackMatch) {
            let foundHours = false, foundMinutes = false, foundSeconds = false;
            for (const item of fallbackMatch) {
                const match = item.match(/(\d+)\s*([a-zA-Z]*)?/i);
                if (match) {
                    const value = parseInt(match[1], 10);
                    const rawUnit = (match[2] || "").toLowerCase();
                    const unit = unitMap[rawUnit] || null;
                    if (isValidTimeValue(value, unit)) {
                        if (unit === "hours" && !foundHours) {
                            hours = value;
                            foundHours = true;
                        }
                        else if (unit === "minutes" && !foundMinutes) {
                            minutes = value;
                            foundMinutes = true;
                        }
                        else if (unit === "seconds" && !foundSeconds) {
                            seconds = value;
                            foundSeconds = true;
                        }
                    }
                    if (foundHours && foundMinutes && foundSeconds)
                        break;
                }
            }
            todaysHours = `${hours} hours ${minutes} minutes ${seconds} seconds`;
        }
    }
    const firstTaskMatch = text.match(/(\d+)\s*tasks?/i);
    const todayTasks = firstTaskMatch ? parseInt(firstTaskMatch[1], 10) : null;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const task = Number(todayTasks);
    return {
        rawText: text.trim(),
        todaysHours,
        hours,
        minutes,
        seconds,
        totalSeconds: totalSeconds !== null && totalSeconds !== void 0 ? totalSeconds : 0,
        todayTasks,
    };
}
//# sourceMappingURL=ocrServices.js.map