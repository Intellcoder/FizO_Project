"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imagekit_1 = __importDefault(require("imagekit"));
const imagekit = new imagekit_1.default({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_jEy83ckli3iaxhZ2v3C9wKSH9ys=",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY ||
        "private_TvXumW89vEENTpca6UXfiesNp14=",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT ||
        "https://ik.imagekit.io/kit1692fz/",
});
exports.default = imagekit;
//# sourceMappingURL=imageKit.js.map