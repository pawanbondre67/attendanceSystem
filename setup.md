<!-- Rebuild with Fresh Gradle
Clean and rebuild Gradle:

cd android
./gradlew clean
./gradlew assembleDebug
cd .. -->



1. npx @react-native-community/cli@latest init AwesomeProject

2. yarn add @react-navigation/native   react-native-screens react-native-safe-area-context

// 3. add it in mainActivity


<!-- import android.os.Bundle;    add it at top -->  
<!-- 
class MainActivity: ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }

} -->

yarn add @react-navigation/native-stack
yarn add @react-navigation/elements



//installing vector icons

yarn add --save react-native-vector-icons

<!-- Edit android/app/build.gradle (NOT android/build.gradle) and add: -->

apply from: file("../../node_modules/react-native-vector-icons/fonts.gradle")


//add svg icons
yarn add react-native-svg


//add local storage
yarn add @react-native-async-storage/async-storage

