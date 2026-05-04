# Deployment

هذا المشروع عبارة عن موقع static (HTML/CSS/JS)، وتم تجهيز نشر تلقائي عبر GitHub Pages.

## الطريقة المعتمدة

1. ارفع التغييرات إلى فرع `main`.
2. ادخل إلى: **GitHub → Settings → Pages**.
3. في Source اختر: **GitHub Actions**.
4. بعد أي push على `main` سيتم تشغيل Workflow:
   - `.github/workflows/deploy-pages.yml`
5. عند نجاح التنفيذ، سيظهر رابط النشر في صفحة الـ Actions.

## ملاحظات

- ملف `CNAME` موجود في الجذر، لذلك الدومين المخصص سيستمر بعد النشر.
- لو أردت نشر يدوي بدون push، شغل workflow من تبويب **Actions** عبر `workflow_dispatch`.
