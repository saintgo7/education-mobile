const express = require('express');
const notificationsController = require('../controllers/notificationsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register-token', protect, notificationsController.registerToken);
router.post('/send', protect, notificationsController.sendNotification);
router.post('/send-to-all', protect, notificationsController.sendToAll);

module.exports = router;
