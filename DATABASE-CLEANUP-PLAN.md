# خطة تنظيف قاعدة البيانات بعد توحيد الصفحات

## القاعدة الأساسية
- بيانات الموظف أو الفني: `employees`
- بيانات الفرع: `branches`
- الصلاحيات: `app_users`
- الإجازات: `vacations`
- زيارات الفروع: `siteVisits`
- إعداد الجدول والعطل: `schedule`
- نماذج التشيك ليست: `branch_checklists` + `checklist_fields`
- نتائج التشيك ليست: `checklist_submissions`
- ترقية الأجهزة: `windows_upgrades`

## لا تحذف الآن
لا تحذف أي Collection قبل تجربة جميع ملفات unified لمدة كافية.

## بعد التجربة
### يمكن أرشفته ثم حذفه لاحقاً
- `technicians` بعد التأكد أن كل الفنيين صاروا في `employees` مع `employeeType: technician`.
- `schedule/jadwal_annual_leave` بعد التأكد أن كل الإجازات صارت في `vacations`.
- بيانات `data.emps` داخل `schedule/jadwal_v6` بعد اعتماد `employees` في الجدول.

### يبقى
- `employees`
- `branches`
- `app_users`
- `vacations`
- `siteVisits`
- `schedule/jadwal_holidays`
- `schedule/manual_overrides`
- `branch_checklists`
- `checklist_fields`
- `checklist_submissions`
- `windows_upgrades`
- `brand_assets`

## طريقة الأمان
1. ارفع الصفحات الجديدة باسم test أولاً.
2. شغل `cleanup-migration-tool.html` من داخل النظام الرئيسي.
3. اضغط فحص البيانات.
4. بعد Backup اضغط تنفيذ الدمج الآمن.
5. جرّب الصفحات.
6. بعد التأكد، غيّر أسماء Collections القديمة إلى Backup أو صدرها ثم احذفها لاحقاً.
