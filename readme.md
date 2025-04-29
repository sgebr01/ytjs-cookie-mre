# ytjs-cookie-mre

This project is a **Minimal Reproducible Example (MRE)** for the issue: [**#960: Requests Authenticated using Cookies Not Working in React Native**](https://github.com/LuanRT/YouTube.js/issues/960) when using the `YouTube.js` library. It uses the getUnseenNotificationCount to try and verify whether the instance is correctly signed in, but of course, any endpoint can be switched out. You shouldn't need any tools outside of what's in this repo to use this.

### Running Project
To use this

1. `npm install`
2. `npx expo start`
3. Download the app "Expo Go" on your phone
4. Scan the QR code generated in terminal, that's it
5. Everything about creating the `Innertube` instance and using it is in App.tsx, the react-native polyfill implementation stuff is in ytjs.ts