const User = require('../models/User');
// const admin = require('firebase-admin');

exports.registerToken = async (req, res) => {
  try {
    const { token, platform } = req.body;

    const updateField = platform === 'ios' ? 'apnsToken' : 'fcmToken';

    await User.findByIdAndUpdate(req.user.id, {
      [updateField]: token,
    });

    res.json({ success: true, message: '토큰이 등록되었습니다' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const { userId, title, body } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.fcmToken) {
      return res.status(404).json({ success: false, message: '사용자 또는 토큰을 찾을 수 없습니다' });
    }

    // In production, use Firebase Admin SDK
    // const message = {
    //   notification: { title, body },
    //   token: user.fcmToken,
    // };
    // await admin.messaging().send(message);

    res.json({ success: true, message: '알림이 전송되었습니다' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendToAll = async (req, res) => {
  try {
    const { title, body } = req.body;

    const users = await User.find({ fcmToken: { $exists: true, $ne: null } });

    // In production, batch send using Firebase Admin SDK
    // const tokens = users.map(user => user.fcmToken);
    // await admin.messaging().sendMulticast({
    //   notification: { title, body },
    //   tokens,
    // });

    res.json({ success: true, message: `${users.length}명에게 알림이 전송되었습니다` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
