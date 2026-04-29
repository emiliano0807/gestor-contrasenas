const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// NGINX enruta /api1/register -> /register
router.post('/register', authController.register);

// NGINX enruta /api1/login -> /login
router.post('/login', authController.login);

router.post('/login/2fa', authController.verify2FALogin);

// NGINX enruta /api1/verify -> /verify
router.post('/verify', authController.verify);

router.post('/2fa/generate', authController.generate2FA);

router.post('/2fa/verify', authController.verifyAndEnable2FA);

router.post('/2fa/disable', authController.disable2FA);

module.exports = router;