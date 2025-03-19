#!/usr/bin/env node

console.log("This is post init script");

const fs = require("fs");
const path = require("path");

const packageName = process.env.PACKAGE_NAME || "com.myapp"; // Custom package name
const iosBundleId = packageName; // Same bundle ID for iOS

// ---- ANDROID CONFIG ----
const androidManifestPath = path.join(
  __dirname,
  "..",
  "android",
  "app",
  "src",
  "main",
  "AndroidManifest.xml"
);

const mainApplicationPath = path.join(
  __dirname,
  "..",
  "android",
  "app",
  "src",
  "main",
  "java",
  "com",
  "myapp",
  "MainApplication.java"
);

const mainActivityPath = path.join(
  __dirname,
  "..",
  "android",
  "app",
  "src",
  "main",
  "java",
  "com",
  "myapp",
  "MainActivity.java"
);

// ---- iOS CONFIG ----
const iosProjectPath = path.join(
  __dirname,
  "..",
  "ios",
  "MyApp.xcodeproj",
  "project.pbxproj"
);

const iosInfoPlistPath = path.join(__dirname, "..", "ios", "MyApp", "Info.plist");

// Function to update package/bundle ID
const updateFile = (filePath, searchRegex, replaceValue) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    content = content.replace(searchRegex, replaceValue);
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Updated: ${filePath}`);
  }
};

// Update Android Package Name
updateFile(androidManifestPath, /package="com\.myapp"/g, `package="${packageName}"`);
updateFile(mainApplicationPath, /com\.myapp/g, packageName);
updateFile(mainActivityPath, /com\.myapp/g, packageName);

// Update iOS Bundle ID
updateFile(iosProjectPath, /PRODUCT_BUNDLE_IDENTIFIER = com\.myapp/g, `PRODUCT_BUNDLE_IDENTIFIER = ${iosBundleId}`);
updateFile(iosInfoPlistPath, /<string>com\.myapp<\/string>/g, `<string>${iosBundleId}</string>`);

console.log("✅ Package Name & Bundle ID Updated Successfully! 🎉");