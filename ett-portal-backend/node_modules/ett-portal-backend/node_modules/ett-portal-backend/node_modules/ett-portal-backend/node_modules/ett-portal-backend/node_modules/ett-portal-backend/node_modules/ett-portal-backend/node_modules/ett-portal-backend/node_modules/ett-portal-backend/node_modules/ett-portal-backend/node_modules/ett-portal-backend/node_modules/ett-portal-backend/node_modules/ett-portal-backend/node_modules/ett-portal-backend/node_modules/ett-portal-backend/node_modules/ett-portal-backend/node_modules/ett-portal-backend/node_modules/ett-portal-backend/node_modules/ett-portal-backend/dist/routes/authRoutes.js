"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post('/request-code', authController_1.requestCode);
router.post('/verify-code', authController_1.verifyCode);
exports.default = router;
