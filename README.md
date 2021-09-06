# SpaceX App
A simple app to keep track of SpaceX's launches.<br/>
Made by me in order to study Firebase libs usage.<br/>
Uses `auth` for authentication, `firestore` to save user's bookmarked launches and user profile data, `database` to save launches' comments and `storage` to save users' profile photos when manually changed via the app profile screen.
## To do
- Implement Github authentication
- Create user profiles cache to avoid multiple refetching of same data
## How to build
To build a new app with your own firebase services, create a new firebase project and put `google-services.json` inside `/android/app` or in its corresponding folder in `/ios`. Then, build it like any react-native app, with `react-native run-android/run-ios`, `cd android && ./gradlew assembleDebug` or `assembleRelease`.