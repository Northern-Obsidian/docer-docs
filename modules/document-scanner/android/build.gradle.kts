plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
}

group = "expo.modules.documentscanner"
version = "0.1.0"

android {
    namespace = "expo.modules.documentscanner"
    compileSdk = 34
    defaultConfig {
        minSdk = 24
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation(project(":expo-modules-core"))
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
}
