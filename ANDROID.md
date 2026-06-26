# Build the PAADI Android App

The website already works as an installable PWA (Chrome → ⋮ → **Install app**).
If you also want a real `.apk` for the Play Store, use Capacitor.

## One-time setup on your computer

1. Install [Android Studio](https://developer.android.com/studio) and Node.js 20+.
2. Clone this project locally (GitHub → your machine).
3. From the project folder:

```bash
bun install
bun add @capacitor/core @capacitor/android
bun add -d @capacitor/cli
npx cap init PAADI in.pokkali.paadi --web-dir=dist
bun run build
npx cap add android
npx cap sync android
npx cap open android
```

`capacitor.config.ts` is already committed — it loads the live site
`https://pokkali.in` inside the Android shell, so every Lovable publish
instantly updates the app. To ship a fully offline build instead, remove the
`server` block in `capacitor.config.ts` and re-run `npx cap sync android`.

## Build the APK / AAB

In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
For the Play Store, choose **Build → Generate Signed Bundle / APK → Android App Bundle**.

## After any code change

```bash
bun run build
npx cap sync android
```

Then re-build the APK in Android Studio.