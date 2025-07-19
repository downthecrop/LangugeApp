# HanaCount

Welcome to HanaCount, a React Native app for mastering Korean numbers! With support for buth Sino-Korean to native Korean numerals, HanaCount offers a focused approach to boost your number recall speed in everyday contexts like dates, money, and time.

## Features:
- Focused Dual Number System Training: Engage with both Sino-Korean and native Korean numbers.
- Counting Mastery: Learn to count objects, people, and more using the right Korean markers.
- Practical Applications: Practice numbers in real-life situations including months, dates, money, and time.
- User-Friendly Design: Enjoy learning with an interface built on Material Design 3 principles.


## Setup

`git clone https://github.com/downthecrop/LangugeApp`

`cd LangugeApp`

`npm install`


## Running

You can launch the app in the browser but it is intended for Android/iOS Mobile devices. Works well and was developed using the Android Studio device simulator.

`npm start`

`a` - Launch on Android Device/Simulator (Use Expo Go SDK 50)

## Building

> Note: SHA1/256 fingerprint need to be added to your Firebase Google Signin to function correctly

`npx react-native doctor`

`expo run:android`


## Midjourney V6 Image Prompt

Quiz items use AI generated images as their background image. To keep the style consistent please use the following prompt if you intend to add additional course material

```
 A flat illustration of {}. flat illustrations in the style of a colorful cartoon. The style is simple lines with a white background and fresh colors that have high-end color matching. clipart artwork of uncomplicated corporate artwork, city, in digital artstyle. --ar 21:9 --s 750
```


## Firebase Setup

To use the backup/restore functions built into HanaCount for your own fork you can use the following rule in firebase firestore. You will also need to update the `webClientId` in the `UserSettings` screen.

```
  service cloud.firestore {
    match /databases/{database}/documents {
      match /quizScores/{userId} {
        allow read, update, delete: if request.auth != null && request.auth.uid == userId;
        allow create: if request.auth != null;
      }
    }
  }
```

You will also need to add your signing fingerprint to the Google Signin  https://developers.google.com/android/guides/client-auth
