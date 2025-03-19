#!/usr/bin/env node

console.log("🚀 Running setup script...");

const fs = require("fs");
const path = require("path");

const packageName = process.env.PACKAGE_NAME || "com.myapp"; // Default package name
const packagePath = packageName.replace(/\./g, "/"); // Convert package name to folder format
const iosBundleId = packageName; // Same for iOS
const projectRoot = process.cwd(); // Project root directory
const applicationName = process.env.APPLICATION_NAME || "MyApp"; // Default application name

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

// 📌 Update `namespace` and `applicationId` in `build.gradle`
const buildGradlePath = path.join(projectRoot, "android", "app", "build.gradle");
updateFile(buildGradlePath, /namespace\s+"[\w.]+"/g, `namespace "${packageName}"`);
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
updateFile(mainApplicationPath, /package\s+[\w.]+/g, `package ${packageName}`);
updateFile(mainActivityPath, /package\s+[\w.]+/g, `package ${packageName}`);

// 📌 Update iOS Bundle ID
updateFile(iosProjectPath, /PRODUCT_BUNDLE_IDENTIFIER\s*=\s*"?[\w.]+"?\$?\(PRODUCT_NAME:rfc1034identifier\)"?;/g, `PRODUCT_BUNDLE_IDENTIFIER = "${iosBundleId}.$(PRODUCT_NAME:rfc1034identifier)";`);
updateFile(iosInfoPlistPath, /<string>[\w.]+<\/string>/g, `<string>${iosBundleId}</string>`);

// 📌 Update Application Name
updateFile(mainActivityPath, /(?<=override fun getMainComponentName\(\): String = ")\w+(?=")/g, applicationName);
updateFile(path.join(projectRoot, "app.json"), /"name":\s*"[^"]+"/g, `"name": "${applicationName}"`);
updateFile(path.join(projectRoot, "package.json"), /"name":\s*"[^"]+"/g, `"name": "${applicationName}"`);
updateFile(path.join(projectRoot, "android", "settings.gradle"), /rootProject.name\s*=\s*['"][^'"]+['"]/g, `rootProject.name = '${applicationName}'`);
updateFile(path.join(projectRoot, "android", "app", "src", "main", "res", "values", "strings.xml"), /<string name="app_name">[^<]+<\/string>/g, `<string name="app_name">${applicationName}</string>`);
updateFile(iosInfoPlistPath, /<key>CFBundleDisplayName<\/key>\n\s*<string>[^<]+<\/string>/g, `<key>CFBundleDisplayName</key>\n  <string>${applicationName}</string>`);

console.log("✅ Package Name & Bundle ID Updated Successfully! 🎉");
