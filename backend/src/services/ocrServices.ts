import stringSimilarity from "string-similarity-js";
import Tesseract from "tesseract.js";

export interface workHoursResult {
  rawText: string;
  todaysHours: string | null;
  totalSeconds: number | null;
  hours: number;
  minutes: number;
  seconds: number;
}

export async function extractTextFromImage(
  filePath: string
): Promise<workHoursResult> {
  const {
    data: { text },
  } = await Tesseract.recognize(filePath, "eng");

  const normalized = text.toLowerCase();
  const words = normalized.split(/\s+/);

  let hours = 0,
    minutes = 0,
    seconds = 0;
  let todaysHours: string | null = null;

  //fuzzy search
  const todayIndex = words.findIndex((w) => stringSimilarity(w, "today") > 0.6);

  //comon ocr mistakes to standard unit
  const unitMap: Record<string, "hours" | "minutes" | "seconds"> = {
    hours: "hours",
    hour: "hours",
    h: "hours",
    mins: "minutes",
    min: "minutes",
    minds: "minutes", // OCR mistake
    mites: "minutes", // OCR mistake
    minutes: "minutes",
    seconds: "seconds",
    sec: "seconds",
    smconds: "seconds", // OCR mistake
    s: "seconds",
  };

  // ✅ Range validator for realistic work times
  const isValidTimeValue = (
    value: number,
    unit: "hours" | "minutes" | "seconds" | null
  ) => {
    if (!unit) return false;
    if (unit === "hours") return value >= 0 && value <= 8;
    if (unit === "minutes" || unit === "seconds")
      return value >= 0 && value < 60;
    return false;
  };

  if (todayIndex !== -1) {
    const timeRegex = /\d+\s*(hours?|minutes?|seconds?)/i;
    let foundHours = false,
      foundMinutes = false,
      foundSeconds = false;

    const proximityWords = words.slice(todayIndex + 1, todayIndex + 1 + 50);
    for (const item of proximityWords) {
      const match = item.match(timeRegex);
      if (match) {
        const value = parseInt(match[1], 10);
        const rawUnit = (match[2] || "").toLocaleLowerCase();
        const unit = unitMap[rawUnit] || null;

        if (isValidTimeValue(value, unit)) {
          if (unit === "hours" && !foundHours) {
            hours = value;
            foundHours = true;
          } else if (unit === "minutes" && !foundMinutes) {
            minutes = value;
            foundMinutes = true;
          } else if (unit === "seconds" && !foundSeconds) {
            seconds = value;
            foundSeconds = true;
          } else {
            if (!foundHours) {
              hours = value;
              foundHours = true;
            } else if (!foundMinutes) {
              minutes = value;
              foundMinutes = true;
            } else if (!foundSeconds) {
              seconds = value;
              foundSeconds = true;
            }
          }
          if (foundHours && foundMinutes && foundSeconds) break;
        }
      }
    }
    if (foundHours || foundMinutes || foundSeconds) {
      todaysHours = `${hours} hours ${minutes} minutes ${seconds} seconds`;
    }
  }

  // Fallback if "today" not found
  if (!todaysHours) {
    const fallbackMatch = normalized.match(/(\d+)\s*([a-zA-Z]*)?/gi);
    if (fallbackMatch) {
      let foundHours = false,
        foundMinutes = false,
        foundSeconds = false;

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
            } else if (unit === "minutes" && !foundMinutes) {
              minutes = value;
              foundMinutes = true;
            } else if (unit === "seconds" && !foundSeconds) {
              seconds = value;
              foundSeconds = true;
            } else {
              if (!foundHours) {
                hours = value;
                foundHours = true;
              } else if (!foundMinutes) {
                minutes = value;
                foundMinutes = true;
              } else if (!foundSeconds) {
                seconds = value;
                foundSeconds = true;
              }
            }
          }

          if (foundHours && foundMinutes && foundSeconds) break;
        }
      }
      todaysHours = `${hours} hours ${minutes} minutes ${seconds} seconds`;
    }
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  return {
    rawText: text.trim(),
    todaysHours,
    hours,
    minutes,
    seconds,
    totalSeconds: totalSeconds ?? 0,
  };
}
