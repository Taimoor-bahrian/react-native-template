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

// 📌 Function to dynamically find the old package name
const findOldPackageName = (basePath) => {
  // if (!fs.existsSync(basePath)) return null;

  // // Check subdirectories in "java" folder
  // const checkDir = (dir) => {
  //   const subDirs = fs.readdirSync(dir);
  //   for (const subDir of subDirs) {
  //     const fullPath = path.join(dir, subDir);
  //     if (fs.statSync(fullPath).isDirectory()) {
  //       return checkDir(fullPath) || subDir; // Return deepest package found
  //     }
  //   }
  //   return null;
  // };

  // return checkDir(basePath);

  const javaPath = path.join(basePath, "android", "app", "src", "main", "java");
  if (!fs.existsSync(javaPath)) return null;

  let foundPath = null;
  
  function searchFolder(currentPath, packageParts) {
    const entries = fs.readdirSync(currentPath);
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry);
      if (fs.statSync(fullPath).isDirectory()) {
        if (!packageParts.length || packageParts.includes(entry)) {
          const newPackageParts = [...packageParts, entry];
          const testPath = path.join(javaPath, ...newPackageParts);
          if (fs.existsSync(path.join(testPath, "MainApplication.kt"))) {
            foundPath = newPackageParts.join(".");
            return;
          }
          searchFolder(fullPath, newPackageParts);
        }
      }
    }
  }

  searchFolder(javaPath, []);
  return foundPath;
};

// const oldPackage = findOldPackageName(androidJavaPath);
// if (!oldPackage) {
//   console.error("❌ Could not detect old package name. Exiting...");
//   process.exit(1);
// }
const androidManifestPath = path.join(projectRoot, "android", "app", "src", "main", "AndroidManifest.xml");

const getPackageFromManifest = () => {
  if (fs.existsSync(androidManifestPath)) {
    const content = fs.readFileSync(androidManifestPath, "utf8");
    const match = content.match(/package="([\w.]+)"/);
    return match ? match[1] : null;
  }
  return null;
};


const oldPackage = getPackageFromManifest();
if (!oldPackage) {
  console.error("❌ Could not detect old package name from AndroidManifest.xml. Exiting...");
  process.exit(1);
}

console.log(`🔄 Detected old package: ${oldPackage}`);

const oldPackagePath = path.join(androidJavaPath, ...oldPackage.split("."));
const newPackagePath = path.join(androidJavaPath, ...packageName.split("."));

// ---- iOS CONFIG ----
const iosProjectRoot = path.join(projectRoot, "ios");

// 📌 Function to detect iOS project name
const detectIOSProjectName = () => {
  const files = fs.readdirSync(iosProjectRoot);
  return files.find((file) => file.endsWith(".xcodeproj"))?.replace(".xcodeproj", "") || "MyApp";
};

const iosProjectName = detectIOSProjectName();
const iosProjectPath = path.join(iosProjectRoot, `${iosProjectName}.xcodeproj`, "project.pbxproj");
const iosInfoPlistPath = path.join(iosProjectRoot, iosProjectName, "Info.plist");

// 📌 Function to update text inside a file
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

// 📌 1. Update `AndroidManifest.xml`
// const androidManifestPath = path.join(projectRoot, "android", "app", "src", "main", "AndroidManifest.xml");

// const getPackageFromManifest = () => {
//   if (fs.existsSync(androidManifestPath)) {
//     const content = fs.readFileSync(androidManifestPath, "utf8");
//     const match = content.match(/package="([\w.]+)"/);
//     return match ? match[1] : null;
//   }
//   return null;
// };

// const androidManifestPath = path.join(androidPath, "AndroidManifest.xml");
console.log(`🔍 Checking AndroidManifest.xml: ${androidManifestPath}`);
updateFile(androidManifestPath, /package\s*=\s*"[\w.]+"/g, `package="${packageName}"`);

// 📌 2. Rename Package Folder (if exists)
if (fs.existsSync(oldPackagePath)) {
  console.log(`🔄 Renaming package folder from ${oldPackagePath} to ${newPackagePath}`);

  // Ensure the new package path exists
  fs.mkdirSync(newPackagePath, { recursive: true });

  fs.renameSync(oldPackagePath, newPackagePath);
  console.log(`✅ Renamed package folder to: ${newPackagePath}`);
} else {
  console.log(`❌ Old package folder not found: ${oldPackagePath}`);
}

// 📌 3. Update `MainApplication.kt` & `MainActivity.kt`
const mainApplicationPath = path.join(newPackagePath, "MainApplication.kt");
const mainActivityPath = path.join(newPackagePath, "MainActivity.kt");

console.log(`🔍 Checking MainApplication.kt: ${mainApplicationPath}`);
updateFile(mainApplicationPath, /package\s+[\w.]+/g, `package ${packageName}`);

console.log(`🔍 Checking MainActivity.kt: ${mainActivityPath}`);
updateFile(mainActivityPath, /package\s+[\w.]+/g, `package ${packageName}`);

// 📌 4. Update iOS Bundle ID
console.log(`🔍 Checking project.pbxproj: ${iosProjectPath}`);
updateFile(iosProjectPath, /PRODUCT_BUNDLE_IDENTIFIER\s*=\s*[\w.]+/g, `PRODUCT_BUNDLE_IDENTIFIER = ${iosBundleId}`);

console.log(`🔍 Checking Info.plist: ${iosInfoPlistPath}`);
updateFile(iosInfoPlistPath, /<string>[\w.]+<\/string>/g, `<string>${iosBundleId}</string>`);

console.log("✅ Package Name & Bundle ID Updated Successfully! 🎉");
