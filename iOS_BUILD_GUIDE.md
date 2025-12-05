# iOS Build Guide for Vaani App

## Prerequisites

### Required Software (macOS only)
- **Xcode 15.0+** (from Mac App Store)
- **Xcode Command Line Tools**
- **CocoaPods** (for dependency management)
- **Node.js 18+** (if not already installed)

### Setup Instructions

1. **Install Xcode Command Line Tools**
   ```bash
   xcode-select --install
   ```

2. **Install CocoaPods** (if not already installed)
   ```bash
   sudo gem install cocoapods
   ```

3. **Verify Installation**
   ```bash
   xcodebuild -version
   pod --version
   ```

## Project Setup

### 1. Install iOS Dependencies
```bash
cd "your-project-path/React Native/ios"
pod install
```

### 2. Open in Xcode
```bash
open MobileApp.xcworkspace
```
**Important:** Always open the `.xcworkspace` file, NOT the `.xcodeproj` file!

## App Configuration

### Current Settings
- **App Name:** Vaani
- **Bundle ID:** Update in Xcode (typically: com.yourcompany.vaani)
- **Logo:** Already copied to iOS assets
- **Version:** 1.0.0

### Required Updates in Xcode

1. **Select Project Target**
   - Open `MobileApp.xcworkspace` in Xcode
   - Select "MobileApp" project in the navigator
   - Select "MobileApp" target

2. **Update Bundle Identifier**
   - Go to "General" tab
   - Change Bundle Identifier to: `com.yourcompany.vaani`
   - Or use your preferred domain

3. **Update Display Name**
   - In "General" tab, set Display Name to: `Vaani`

4. **Configure App Icons**
   - Select "Images.xcassets" in the navigator
   - Select "AppIcon" 
   - Drag your logo files to appropriate slots:
     - iPhone App 60pt @2x (120x120)
     - iPhone App 60pt @3x (180x180)
     - App Store 1024pt (1024x1024)

## Code Signing (Required for Device/App Store)

### Development Signing
1. **Apple Developer Account**
   - You need an Apple Developer account ($99/year)
   - Sign in at developer.apple.com

2. **In Xcode**
   - Go to "Signing & Capabilities" tab
   - Check "Automatically manage signing"
   - Select your development team
   - Xcode will create necessary certificates

### Distribution Signing (for App Store)
1. **Create App Store Connect Record**
   - Go to appstoreconnect.apple.com
   - Create new app with same Bundle ID

2. **Archive Configuration**
   - In Xcode, select "Generic iOS Device" or connected device
   - Go to Product → Archive

## Building IPA

### Method 1: Archive via Xcode (Recommended)

1. **Prepare for Archive**
   ```bash
   cd "your-project-path/React Native"
   npm run ios:release
   ```
   Or manually:
   ```bash
   npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle
   ```

2. **In Xcode**
   - Select "Generic iOS Device" as target
   - Product → Archive
   - Wait for archive to complete
   - In Organizer, select "Distribute App"
   - Choose distribution method:
     - **App Store Connect** (for App Store)
     - **Development** (for testing)
     - **Ad Hoc** (for limited distribution)
     - **Enterprise** (if you have enterprise account)

3. **Export IPA**
   - Follow Xcode prompts
   - IPA will be saved to chosen location

### Method 2: Command Line (Advanced)

1. **Build Archive**
   ```bash
   cd "your-project-path/React Native/ios"
   xcodebuild archive \
     -workspace MobileApp.xcworkspace \
     -scheme MobileApp \
     -configuration Release \
     -archivePath build/MobileApp.xcarchive
   ```

2. **Export IPA**
   ```bash
   xcodebuild -exportArchive \
     -archivePath build/MobileApp.xcarchive \
     -exportPath build/ \
     -exportOptionsPlist ExportOptions.plist
   ```

### Method 3: React Native CLI

1. **Build Release**
   ```bash
   cd "your-project-path/React Native"
   npx react-native run-ios --configuration Release
   ```

## Troubleshooting

### Common Issues

1. **Pod Install Fails**
   ```bash
   cd ios
   pod deintegrate
   pod install
   ```

2. **Build Fails - Clean Build**
   ```bash
   cd ios
   xcodebuild clean
   ```
   Or in Xcode: Product → Clean Build Folder

3. **Metro Bundle Issues**
   ```bash
   npx react-native start --reset-cache
   ```

4. **Signing Issues**
   - Check Bundle ID matches App Store Connect
   - Ensure certificates are valid
   - Try "Automatically manage signing" in Xcode

### Required Files for iOS

All these files are already configured:
- ✅ `ios/MobileApp/Info.plist` (App name: Vaani)
- ✅ `ios/MobileApp/Images.xcassets/AppIcon.appiconset/` (Logo files)
- ✅ `ios/Podfile` (Dependencies)
- ✅ `package.json` (App name: vaani)

## File Locations

After building, you'll find:
- **Archive:** `ios/build/MobileApp.xcarchive`
- **IPA:** `ios/build/MobileApp.ipa` (or export location)
- **dSYM:** For crash reporting (keep this file)

## Distribution

### TestFlight (Beta Testing)
1. Upload IPA via Xcode Organizer
2. Add testers in App Store Connect
3. Testers receive email with install link

### App Store Release
1. Upload via Xcode or Application Loader
2. Fill app metadata in App Store Connect
3. Submit for review
4. Apple review process (1-7 days typically)

## Next Steps

1. **Transfer to macOS machine**
2. **Follow setup instructions above**
3. **Open project in Xcode**
4. **Configure signing**
5. **Archive and export IPA**

## Notes

- iOS builds require macOS and Xcode
- You'll need Apple Developer account for device testing and App Store distribution
- The app name has been updated to "Vaani" throughout the project
- Logo files have been copied to iOS assets directory
- All React Native dependencies are already configured

## Contact

If you encounter issues:
1. Check Xcode build logs
2. Verify all certificates are valid
3. Ensure Bundle ID is unique and matches App Store Connect
4. Try cleaning and rebuilding
