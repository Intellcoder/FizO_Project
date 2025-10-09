"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
async function cropBlackRegion(inputPath, outputPath, targetWidth = 1920) {
    const resizedBuffer = await (0, sharp_1.default)(inputPath)
        .resize({ width: targetWidth })
        .toBuffer();
    const info = await (0, sharp_1.default)(resizedBuffer).metadata();
    if (!info.width || !info.height)
        throw new Error("Image info not available");
    const boxWidthPercent = 0.38;
    const boxHeightPercent = 0.55;
    const left = Math.floor(info.width * (1 - boxWidthPercent));
    const top = Math.floor(info.height * 0.02);
    const width = Math.floor(info.width * boxWidthPercent);
    const height = Math.floor(info.height * boxHeightPercent);
    const topRightBuffer = await (0, sharp_1.default)(resizedBuffer)
        .extract({ left, top, width, height })
        .toBuffer();
    const { data, info: croppedInfo } = await (0, sharp_1.default)(topRightBuffer)
        .grayscale()
        .raw()
        .toBuffer({ resolveWithObject: true });
    let minX = croppedInfo.width, minY = croppedInfo.height, maxX = 0, maxY = 0;
    const threshold = 50;
    for (let y = 0; y < croppedInfo.height; y++) {
        for (let x = 0; x < croppedInfo.width; x++) {
            const pixelValue = data[y * croppedInfo.width + x];
            if (pixelValue < threshold) {
                if (x < minX)
                    minX = x;
                if (y < minY)
                    minX = y;
                if (x > maxX)
                    maxX = x;
                if (x > maxY)
                    maxY = y;
            }
        }
    }
    const cropWidth = maxX - minX;
    const cropHeight = maxY - minY;
    if (cropWidth < 5 || cropHeight) {
        await (0, sharp_1.default)(topRightBuffer).toFile(outputPath);
        return outputPath;
    }
    await (0, sharp_1.default)(topRightBuffer)
        .extract({
        left: minX,
        top: minY,
        width: cropWidth,
        height: cropHeight,
    })
        .toFile(outputPath);
    return outputPath;
}
exports.default = cropBlackRegion;
//# sourceMappingURL=imageResizeService.js.map