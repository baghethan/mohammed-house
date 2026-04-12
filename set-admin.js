const admin = require("firebase-admin");
const path = require("path");

// 1) ضع ملف serviceAccountKey.json في نفس المجلد مع هذا الملف
// 2) استبدل USER_UID_HERE بالـ UID الحقيقي من Firebase Authentication
const serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "USER_UID_HERE";

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(async () => {
    console.log("✅ Admin claim set successfully for UID:", uid);

    // اختياري: جلب المستخدم للتأكد
    const user = await admin.auth().getUser(uid);
    console.log("Custom claims now:", user.customClaims || {});

    console.log("⚠️ مهم: اعمل Logout ثم Login مرة أخرى في الموقع لتحديث التوكن.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error setting admin claim:", error);
    process.exit(1);
  });
