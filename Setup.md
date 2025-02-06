

  instead of this  ----> override fun getLifecycle(): Lifecycle = lifecycleRegistry  
write this in node_modules/react-native-vision-camera/android/src/main/java/com/mrousavy/camera/core/CameraSession.kt

override val lifecycle: Lifecycle
    get() = lifecycleRegistry