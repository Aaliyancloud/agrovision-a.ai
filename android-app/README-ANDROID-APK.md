# AgroVision AI — Android Mobile App (Kotlin)

This folder contains the complete native Android Studio project wrapping **AgroVision AI Mobile App** (`https://agrovision-a.ai.studio/?mode=app`) with native Android permissions, live Camera capture (`MediaStore.ACTION_IMAGE_CAPTURE`), Gallery leaf photo picking, Pull-to-Refresh, Hardware Back button support, and offline asset caching.

## Option 1: Automatic Cloud APK Build (No Android Studio Needed)
1. Push this repository to GitHub (the included `.github/workflows/build-android-apk.yml` workflow is already configured).
2. Open the **Actions** tab on GitHub -> click **Build AgroVision Android APK** -> **Run workflow**.
3. Download `AgroVisionAI-debug-apk` from the workflow artifacts and install `app-debug.apk` on any Android phone!

## Option 2: Build Locally in Android Studio
1. Open this `android-app/` folder in **Android Studio (Koala / Ladybug or newer)**.
2. Wait for Gradle Sync to finish (SDK 35, JDK 17).
3. Click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
4. Transfer the generated `app/build/outputs/apk/debug/app-debug.apk` to your Android device and install!
