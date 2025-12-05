#!/bin/bash

# iOS Setup and Build Script for Vaani App
# Run this script on macOS with Xcode installed

echo "🍎 Vaani iOS Build Setup"
echo "========================"

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Error: This script must be run on macOS"
    exit 1
fi

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Error: Xcode is not installed or command line tools are missing"
    echo "   Please install Xcode from the Mac App Store"
    echo "   Then run: xcode-select --install"
    exit 1
fi

# Check if CocoaPods is installed
if ! command -v pod &> /dev/null; then
    echo "📦 Installing CocoaPods..."
    sudo gem install cocoapods
fi

# Navigate to project directory
cd "$(dirname "$0")"

echo "📱 Setting up iOS dependencies..."

# Install CocoaPods dependencies
cd ios
pod install

if [ $? -eq 0 ]; then
    echo "✅ iOS dependencies installed successfully"
else
    echo "❌ Failed to install iOS dependencies"
    exit 1
fi

cd ..

echo "🛠  Project is ready for iOS development"
echo ""
echo "Next Steps:"
echo "1. Open ios/MobileApp.xcworkspace in Xcode"
echo "2. Select your development team in Signing & Capabilities"
echo "3. Update Bundle Identifier if needed"
echo "4. Build and run on device or simulator"
echo ""
echo "To build IPA:"
echo "1. Select 'Generic iOS Device' as target"
echo "2. Product → Archive"
echo "3. Distribute App → Choose export method"
echo ""
echo "Or use command line:"
echo "npm run ios:bundle"
echo "xcodebuild archive -workspace ios/MobileApp.xcworkspace -scheme MobileApp -configuration Release -archivePath build/MobileApp.xcarchive"
echo "xcodebuild -exportArchive -archivePath build/MobileApp.xcarchive -exportPath build/ -exportOptionsPlist ios/ExportOptions.plist"