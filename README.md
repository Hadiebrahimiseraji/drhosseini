# drhosseini

Landing page for Dr. Faezeh Hosseini clinic (Vite + React + Tailwind).

این README شامل دستورالعمل کامل برای دیپلوی روی GitHub Pages (از همین برنچ) است.

## محلی — اجرا و تست

```bash
npm install
npm run dev
```

برای نمایش محلی در شبکه:

```bash
npm run preview -- --host 0.0.0.0 --port 4173
```

## ساخت

```bash
npm run build
```

خروجی در پوشه `dist/` ساخته می‌شود.

## اسکریپت‌های مرتبط با دیپلوی

- `npm run predeploy` — اجرای `build` قبل از دیپلوی
- `npm run deploy` — دیپلوی با `gh-pages` (اختیاری)

> در این repo همچنین یک GitHub Actions Workflow وجود دارد که روی push به برنچ
> `codex/setup-github-pages-for-react-project` اجرا و خروجی `dist/` را به Pages منتشر می‌کند.

## فعال‌سازی GitHub Pages (نکته مهم)

1. به Repository → Settings → Pages بروید.
2. در بخش Build and deployment، `Source` را روی **GitHub Actions** قرار دهید.

اگر اینجا روی branch/root یا `gh-pages` باشد، workflow اتوماتیک که artifact می‌سازد منتشر نخواهد شد.

## آدرس سایت پس از دیپلوی

```
https://hadiebrahimiseraji.github.io/drhosseini/
```

## نکات عیب‌یابی

- اگر 404 می‌بینید: مطمئن شوید Pages روی `GitHub Actions` تنظیم شده و workflow روی برنچ شما اجرا شده است.
- اگر assetها 404 شدند: مقدار `base` در `vite.config.js` باید `/drhosseini/` باشد (هم‌اکنون همین مقدار است).
- برای جلوگیری از 404 روی رفرش SPA، از `HashRouter` یا fallback مناسب استفاده کنید.

## تغییرات پیشنهادی

- اگر می‌خواهید روش سنتی `gh-pages` هم کار کند، پس از pull این برنچ:

```bash
npm install
npm run predeploy
npm run deploy
```

(برای `npm run deploy` نیاز به نصب `gh-pages` است که در `devDependencies` اضافه شده.)

---
