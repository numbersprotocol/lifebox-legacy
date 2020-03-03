# Lifebox Mobile Client

## Reference Development Environment

``` txt
Ionic:

   Ionic CLI                     : 5.2.1 (/home/seanwu/.nvm/versions/node/v10.16.0/lib/node_modules/ionic)
   Ionic Framework               : @ionic/angular 4.6.0
   @angular-devkit/build-angular : 0.13.9
   @angular-devkit/schematics    : 7.3.9
   @angular/cli                  : 7.3.9
   @ionic/angular-toolkit        : 1.5.1

Cordova:

   Cordova CLI       : 9.0.0 (cordova-lib@9.0.1)
   Cordova Platforms : android 8.0.0
   Cordova Plugins   : cordova-plugin-ionic-keyboard 2.1.3, cordova-plugin-ionic-webview 4.1.1, (and 4 other plugins)

Utility:

   cordova-res : not installed
   native-run  : 0.2.7

System:

   Android SDK Tools : 26.1.1 (/home/seanwu/android-sdk-26.1.1-4333796)
   NodeJS            : v10.16.0 (/home/seanwu/.nvm/versions/node/v10.16.0/bin/node)
   npm               : 6.9.0
   OS                : Linux 4.18
```

## Setup Development Environment

Assume the OS is Ubuntu 18.04.

### Install JDK 8 and Gradle

``` sh
sudo apt install openjdk-8-jdk gradle
```

### Setup Android SDK Command Line Tools

Download and unzip Android SDK tools.

``` sh
wget https://dl.google.com/android/repository/sdk-tools-linux-4333796.zip
unzip sdk-tools-linux-4333796.zip -d $HOME/android-sdk-26.1.1-4333796
```

Configure command line tools by adding the environment variables to shell startup scripts (e.g. `~/.bashrc`).

``` sh
# ~/.bashrc

# JDK
export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"

# Android SDK
ANDROIDDIR="$HOME"
export ANDROID_SDK_ROOT="$ANDROIDDIR/android-sdk-26.1.1-4333796"
# avdmanager, sdkmanager
export PATH=$PATH:$ANDROID_SDK_ROOT/tools/bin
# adb, logcat
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
# emulator
export PATH=$PATH:$ANDROID_SDK_ROOT/tools
```

Use the new startup script.

``` sh
source $HOME/.bashrc
```

Install SDK tools.

``` sh
sdkmanager 'build-tools;28.0.3' 'platform-tools' 'platforms;android-27' 'tools'
```

### Setup Node.js and Global Packages

[Use NVM to install Node.js](https://github.com/nvm-sh/nvm/blob/master/README.md) (highly recommended).

``` sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```

Install and use Node.js LTS version.

``` sh
nvm install --lts
```

We assume the version of Node.js for this project's development to be `10.x`.

Install Ionic CLI and Cordova CLI.

``` sh
npm install -g ionic cordova native-run
```

`native-run` is required if you want to [run the app in mobile devices with Cordova](#deploy-app-to-android-devices).

> You do **NOT** have to use `sudo` to install global NPM packages if you install Node.js and NPM with NVM.

### Download and Install Lifebox Mobile Client

Clone project and check to `feature-migration-ionic4` branch.

``` sh
git clone git@gitlab.com:DT42/numbers/numbers-mobile-client.git
cd numbers-mobile-client
git checkout feature-migration-ionic4
```

Install NPM packages.

``` sh
npm install
```

### `ionic info`

``` txt
Ionic:

   Ionic CLI                     : 5.2.1 (/home/seanwu/.nvm/versions/node/v10.16.0/lib/node_modules/ionic)
   Ionic Framework               : @ionic/angular 4.6.0
   @angular-devkit/build-angular : 0.13.9
   @angular-devkit/schematics    : 7.3.9
   @angular/cli                  : 7.3.9
   @ionic/angular-toolkit        : 1.5.1

Cordova:

   Cordova CLI       : 9.0.0 (cordova-lib@9.0.1)
   Cordova Platforms : not available
   Cordova Plugins   : not available

Utility:

   cordova-res : not installed
   native-run  : 0.2.7

System:

   Android SDK Tools : 26.1.1 (/home/seanwu/android-sdk-26.1.1-4333796)
   NodeJS            : v10.16.0 (/home/seanwu/.nvm/versions/node/v10.16.0/bin/node)
   npm               : 6.9.0
   OS                : Linux 4.18
```

## Run the App with Hot-Reload

### Run in Browser

``` sh
ionic serve
```

> Run in a browser would cause errors due to the lack of mobile API.

### Run in Mobile

There are 2 different ways to run the app on mobile devices.

#### [Ionic DevApp](https://ionicframework.com/docs/building/running)

Use [Ionic DevApp](https://ionicframework.com/docs/building/running) to run the app. If the app calls any native functionality, DevApp can handle this and return the correct native implementation. You do not have to install or configure complicated Native SDKs. Also, you do not have to use USB to debug the mobile devices.

#### [Deploy App to Android Devices](https://ionicframework.com/docs/building/android#running-with-cordova)

Make sure your devices are connected via USB with debugging mode enabled.

Run the following to start a long-running CLI process that boots up a live-reload server.

``` sh
ionic cordova run android -l
```

## Use of Ionic CLI

**Please use Ionic CLI to generate pages, services, directives, etc. to keep the project structure consistent.**

## Issues and Suggestion

1. `tour.page.ts` 排版出問題。可能需要重新設計 SCSS。
1. **_WORKAROUND_**: `cordova-plugin-background-geolocation` v^3.0.3 has the ![GitHub issue/pull request detail](https://img.shields.io/github/issues/detail/state/mauron85/cordova-plugin-background-geolocation/553.svg), and thus we cannot build or run on Android with Cordova. Currently, we use [this workaround](https://github.com/mauron85/cordova-plugin-background-geolocation/issues/553#issuecomment-507505198) to fix the problem. We should update this plugin after this issue has been closed.
1. Ugly Ionic-Creator-generated IDs should be eliminated.
1. Page name choice: record center (current one) or control center (better consistency)?
1. `href-inappbrowser="/signup"` in `login.html` does not work.
1. `datetime.service.ts` uses a string comparison to check object type, which might be a bad idea.
1. in `weather.service.ts`, `getWeatherByLocation()` using possibly non-exist string-literal (`'main'`) to access `Response` object. Search `tslint:disable-next-line: no-string-literal` to find them.
1. in `airquality.service.ts`, `getAirQualityByLocation()` using possibly non-exist string-literal (`'main'`) to access `Response` object. Search `tslint:disable-next-line: no-string-literal` to find them.
1. the page `account-setting` should be renamed as `account-settings`.
1. modulize page components. E.g. home, journal-daily-report, profile pages.
1. menu or back button in the login page. 需要 App 頁面的狀態圖來確定設計。
1. improve page (routing) structure.
1. how to share: `SharePopUpPage` or `SocialSharing`?
1. make injectable private in components.

## Testing Notes

1. Do **NOT** try to import `AppModule` in each `spec.ts` file, though it can make sure every service is provided, your tests have to reload **everything** every time, and the state of each test becomes hugely complex.
1. Because both [ionic-native-mocks](https://github.com/chrisgriffith/ionic-native-mocks) and [ionic-mocks](https://github.com/stonelasley/ionic-mocks) have not yet supported Ionic 4, we build our Ionic native mocks in `src/mocks`.
1. If you use `ReactiveFormModule` in component, you need to import `ReactiveFormModule` and `IonicModule.forRoot()` in `spec.ts`.
1. If you use `<ion-back-button>` in component and import `IonicModule.forRoot()` in `spec.ts`, you need to import `RouterTestingModule` in `spec.ts`. Rationale: `IonicModule.forRoot()` is the ngModule to make any `<ion-*>` directive work. When you use `ReactiveFormModule` to create form, you have to make sure `<ion-input>` is working, and thus, import `IonicModule.forRoot()` as well. Furthermore, due to `<ion-back-button>` is working by importing `IonicModule.forRoot()`, you need to import `RouterTestingModule` for the provider of `Location` which is required for any routing behavior.
