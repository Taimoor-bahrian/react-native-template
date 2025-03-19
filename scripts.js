#!/usr/bin/env node

console.log("🚀 Running setup script...");

const fs = require("fs");
const path = require("path");

const packageName = process.env.PACKAGE_NAME || "com.myapp"; // Default package name
const packagePath = packageName.replace(/\./g, "/"); // Convert package name to folder format
const iosBundleId = packageName; // Same for iOS
const projectRoot = process.cwd(); // Project root directory

console.log(`🔄 projectRoot: ${projectRoot}`);
console.log(`🔄 Updating package name to: ${packageName}`);

// ---- ANDROID CONFIG ----
const androidPath = path.join(projectRoot, "android", "app", "src", "main");
const androidJavaPath = path.join(androidPath, "java");

const getPackageFromGradle = () => {
  const gradleFilePath = path.join(process.cwd(), "android", "app", "build.gradle");
  if (fs.existsSync(gradleFilePath)) {
    const content = fs.readFileSync(gradleFilePath, "utf8");
    const match = content.match(/applicationId\s+"([\w.]+)"/);
    return match ? match[1] : null;
  }
  return null;
};

const oldPackage = getPackageFromGradle();
console.log(`🔄 Detected old package: ${oldPackage}`);

const oldPackagePath = path.join(androidJavaPath, ...oldPackage.split("."));
const newPackagePath = path.join(androidJavaPath, ...packageName.split("."));

// ---- iOS CONFIG ----
const iosProjectRoot = path.join(projectRoot, "ios");

const detectIOSProjectName = () => {
  const files = fs.readdirSync(iosProjectRoot);
  return files.find((file) => file.endsWith(".xcodeproj"))?.replace(".xcodeproj", "") || "MyApp";
};

const iosProjectName = detectIOSProjectName();
const iosProjectPath = path.join(iosProjectRoot, `${iosProjectName}.xcodeproj`, "project.pbxproj");
const iosInfoPlistPath = path.join(iosProjectRoot, iosProjectName, "Info.plist");

const updateFile = (filePath, searchRegex, replaceValue) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    if (searchRegex.test(content)) {
      content = content.replace(searchRegex, replaceValue);
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`⚠️ Pattern not found in: ${filePath}`);
    }
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
};

// 📌 Update `namespace` in `build.gradle`
const buildGradlePath = path.join(projectRoot, "android", "app", "build.gradle");
console.log(`🔍 Updating namespace in build.gradle: ${buildGradlePath}`);
updateFile(buildGradlePath, /namespace\s+"[\w.]+"/g, `namespace "${packageName}"`);

// 📌 Update `applicationId` in `build.gradle`
console.log(`🔍 Updating applicationId in build.gradle: ${buildGradlePath}`);
updateFile(buildGradlePath, /applicationId\s+"[\w.]+"/g, `applicationId "${packageName}"`);

// 📌 Rename Package Folder
if (fs.existsSync(oldPackagePath)) {
  console.log(`🔄 Renaming package folder from ${oldPackagePath} to ${newPackagePath}`);
  fs.mkdirSync(newPackagePath, { recursive: true });
  fs.renameSync(oldPackagePath, newPackagePath);
  console.log(`✅ Renamed package folder to: ${newPackagePath}`);
} else {
  console.log(`❌ Old package folder not found: ${oldPackagePath}`);
}

// 📌 Update `MainApplication.kt` & `MainActivity.kt`
const mainApplicationPath = path.join(newPackagePath, "MainApplication.kt");
const mainActivityPath = path.join(newPackagePath, "MainActivity.kt");

console.log(`🔍 Checking MainApplication.kt: ${mainApplicationPath}`);
updateFile(mainApplicationPath, /package\s+[\w.]+/g, `package ${packageName}`);

console.log(`🔍 Checking MainActivity.kt: ${mainActivityPath}`);
updateFile(mainActivityPath, /package\s+[\w.]+/g, `package ${packageName}`);

// 📌 Update iOS Bundle ID
console.log(`🔍 Checking project.pbxproj: ${iosProjectPath}`);
// updateFile(iosProjectPath, /PRODUCT_BUNDLE_IDENTIFIER\s*=\s*"?[\w.]+"?/g, `PRODUCT_BUNDLE_IDENTIFIER = "${iosBundleId}"`);
updateFile(iosProjectPath, /PRODUCT_BUNDLE_IDENTIFIER\s*=\s*"?[\w.]+"?\$?\(PRODUCT_NAME:rfc1034identifier\)";?/g, `PRODUCT_BUNDLE_IDENTIFIER = "${iosBundleId}.$(PRODUCT_NAME:rfc1034identifier)";`);

console.log(`🔍 Checking Info.plist: ${iosInfoPlistPath}`);
updateFile(iosInfoPlistPath, /<string>[\w.]+<\/string>/g, `<string>${iosBundleId}</string>`);

console.log("✅ Package Name & Bundle ID Updated Successfully! 🎉");
