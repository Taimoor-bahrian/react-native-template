#!/usr/bin/env node

console.log("This is post init script");

const fs = require("fs");
const path = require("path");

const packageName = process.env.PACKAGE_NAME || "com.myapp"; // ⚡ Default package name
const packagePath = packageName.replace(/\./g, "/"); // Convert package name to folder path format
const iosBundleId = packageName; // Same for iOS

const projectRoot = path.resolve(__dirname, "..", ".."); // Move up two levels to project root


console.log(`🔄 projectRoot: ${projectRoot}`);
console.log(`🔄 Updating package name to: ${packageName}`);

// ---- ANDROID CONFIG ----
const androidManifestPath = path.join(
  projectRoot,
  "..",
  "android",
  "app",
  "src",
  "main",
  "AndroidManifest.xml"
);

const oldPackagePath = path.join(projectRoot, "..", "android", "app", "src", "main", "java", "com", "myapp");
const newPackagePath = path.join(projectRoot, "..", "android", "app", "src", "main", "java", ...packageName.split("."));

// ---- iOS CONFIG ----
const iosProjectPath = path.join(
  projectRoot,
  "..",
  "ios",
  "Little.xcodeproj",
  "project.pbxproj"
);

const iosInfoPlistPath = path.join(projectRoot, "..", "ios", "Little", "Info.plist");

// Function to update package name in a file
const updateFile = (filePath, searchRegex, replaceValue) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");

    if (searchRegex.test(content)) {
      content = content.replace(searchRegex, replaceValue);
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`⚠️ No changes needed in: ${filePath}`);
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
};

// 📌 1. Debug: Check if AndroidManifest.xml exists
console.log(`🔍 Checking if AndroidManifest.xml exists at: ${androidManifestPath}`);
updateFile(androidManifestPath, /package="com\.myapp"/g, `package="${packageName}"`);

// 📌 2. Debug: Rename package folder
if (fs.existsSync(oldPackagePath)) {
  console.log(`🔄 Renaming package folder from ${oldPackagePath} to ${newPackagePath}`);
  fs.renameSync(oldPackagePath, newPackagePath);
  console.log(`✅ Renamed package folder to: ${newPackagePath}`);
} else {
  console.log(`❌ Old package folder not found: ${oldPackagePath}`);
}

// 📌 3. Debug: Update MainApplication.java & MainActivity.java
const mainApplicationPath = path.join(newPackagePath, "MainApplication.java");
const mainActivityPath = path.join(newPackagePath, "MainActivity.java");

console.log(`🔍 Checking if MainApplication.java exists at: ${mainApplicationPath}`);
updateFile(mainApplicationPath, /package com\.myapp/g, `package ${packageName}`);

console.log(`🔍 Checking if MainActivity.java exists at: ${mainActivityPath}`);
updateFile(mainActivityPath, /package com\.myapp/g, `package ${packageName}`);

// 📌 4. Debug: Update iOS Bundle ID
console.log(`🔍 Checking if project.pbxproj exists at: ${iosProjectPath}`);
updateFile(iosProjectPath, /PRODUCT_BUNDLE_IDENTIFIER = com\.myapp/g, `PRODUCT_BUNDLE_IDENTIFIER = ${iosBundleId}`);

console.log(`🔍 Checking if Info.plist exists at: ${iosInfoPlistPath}`);
updateFile(iosInfoPlistPath, /<string>com\.myapp<\/string>/g, `<string>${iosBundleId}</string>`);

console.log("✅ Package Name & Bundle ID Updated Successfully! 🎉");
