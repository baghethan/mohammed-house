<?php
// فحص بسيط للحفظ على الاستضافة: لا يغيّر ملفات الموقع ولا يعرض كلمات مرور.
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
$writable = is_writable(__DIR__);
$json = function_exists('json_encode') && function_exists('json_decode');
$lock = function_exists('flock');
$ready = $writable && $json && $lock;
?>
<!doctype html>
<html lang="ar" dir="rtl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>فحص حفظ رحلة القاهرة</title>
<style>body{margin:0;background:#f1f6f5;color:#173c43;font:18px/1.9 Tahoma,Arial,sans-serif;padding:35px 16px}.card{background:white;max-width:620px;margin:40px auto;padding:30px;border:1px solid #d8e5e2;border-radius:18px}h1{font-size:27px;line-height:1.5}.status{background:#eaf6ed;border-radius:12px;padding:14px;color:#23653e}.row{display:flex;justify-content:space-between;gap:20px;padding:14px 0;border-bottom:1px solid #e5edeb}.hint{background:#fff5df;border-radius:12px;padding:15px;font-size:16px;margin-top:22px}small{font-size:15px;color:#648080}strong{white-space:nowrap}</style></head>
<body><main class="card"><h1>فحص حفظ رحلة القاهرة</h1>
<p class="status">الاستضافة تشغّل PHP بنجاح ✓</p>
<div class="row"><span>تشغيل PHP</span><strong>يعمل ✓</strong></div>
<div class="row"><span>حفظ الملفات في هذا المجلد</span><strong><?php echo $writable ? 'متاح ✓' : 'يحتاج ضبط صلاحية'; ?></strong></div>
<div class="row"><span>قراءة وكتابة بيانات JSON</span><strong><?php echo $json ? 'متاح ✓' : 'غير متاح'; ?></strong></div>
<div class="row"><span>حماية الكتابة المتزامنة</span><strong><?php echo $lock ? 'متاح ✓' : 'غير متاح'; ?></strong></div>
<p class="hint"><?php echo $ready ? 'النتيجة: متطلبات الحفظ الأساسية متاحة. نقدر نجهّز حفظًا تلقائيًا على الاستضافة، ثم نختبر الحفظ والمزامنة بعد رفع ملفاته.' : 'النتيجة: PHP يعمل، لكن بعض متطلبات الحفظ تحتاج ضبطًا. أرسل صورة هذه النتيجة لتحديد الخطوة التالية.'; ?></p>
<p>أرسل صورة هذه الصفحة أو انسخ النتيجة في المحادثة.</p>
<small>هذا فحص فقط؛ لم يُربط جدولك بالحفظ بعد، ولم تتغير ملفات الموقع. احذف ملف الفحص بعد الانتهاء.</small>
</main></body></html>
