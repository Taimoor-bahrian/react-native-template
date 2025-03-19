#!/usr/bin/env node

console.log("This is post init script");

const fs = require("fs");
const path = require("path");

const packageName = process.env.PACKAGE_NAME || "com.myapp"; // ⚡ Default package name (change dynamically)
const packagePath = packageName.replace(/\./g, "/"); // Convert package name to folder path format
const iosBundleId = packageName; // Same for iOS

console.log(`🔄 Updating package name to: ${packageName}`);

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

// Old package name folder (before renaming)
const oldPackagePath = path.join(__dirname, "..", "android", "app", "src", "main", "java", "com", "myapp");

// New package name folder
const newPackagePath = path.join(__dirname, "..", "android", "app", "src", "main", "java", ...packageName.split("."));

// ---- iOS CONFIG ----
const iosProjectPath = path.join(
  __dirname,
  "..",
  "ios",
  "Little.xcodeproj",
  "project.pbxproj"
);

const iosInfoPlistPath = path.join(__dirname, "..", "ios", "Little", "Info.plist");

// Function to update package name in a file
const updateFile = (filePath, searchRegex, replaceValue) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    content = content.replace(searchRegex, replaceValue);
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ Updated: ${filePath}`);
  }
};

// 📌 1. Update Android Manifest.xml
updateFile(androidManifestPath, /package="com\.myapp"/g, `package="${packageName}"`);

// 📌 2. Rename package folder (com.myapp → com.newpackage)
if (fs.existsSync(oldPackagePath)) {
  fs.renameSync(oldPackagePath, newPackagePath);
  console.log(`✅ Renamed package folder to: ${newPackagePath}`);
}

// 📌 3. Update MainApplication.java & MainActivity.java
updateFile(
  path.join(newPackagePath, "MainApplication.java"),
  /package com\.myapp/g,
  `package ${packageName}`
);

updateFile(
  path.join(newPackagePath, "MainActivity.java"),
  /package com\.myapp/g,
  `package ${packageName}`
);

// 📌 4. Update iOS Bundle ID
updateFile(iosProjectPath, /PRODUCT_BUNDLE_IDENTIFIER = com\.myapp/g, `PRODUCT_BUNDLE_IDENTIFIER = ${iosBundleId}`);
updateFile(iosInfoPlistPath, /<string>com\.myapp<\/string>/g, `<string>${iosBundleId}</string>`);

console.log("✅ Package Name & Bundle ID Updated Successfully! 🎉");