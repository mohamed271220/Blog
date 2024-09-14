"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController = __importStar(require("../controllers/auth-controller"));
const auth_middleware_1 = require("../middleware/auth-middleware");
const auth_validators_1 = require("../middleware/validators/auth-validators");
const router = express_1.default.Router();
router.get("/profile", auth_middleware_1.authenticateToken, authController.getProfile);
router.post("/signup", auth_validators_1.validateSignup, authController.signup);
router.post("/login", auth_validators_1.validateLogin, authController.login);
router.get("/logout", auth_middleware_1.authenticateToken, authController.logout);
router.get("/validate-token", auth_middleware_1.authenticateToken, authController.validateSession);
router.get("/refresh-token", auth_middleware_1.authenticateToken, authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.post("/change-password", auth_middleware_1.authenticateToken, authController.changePassword);
exports.default = router;
