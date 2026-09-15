const tinify = require('tinify');
const fs = require('fs');

const apiKey = process.env.TINIFY_API_KEY;
if (!apiKey) {
  console.error("=====================================================");
  console.error("🚨 CRITICAL ERROR: MISSING API KEY 🚨");
  console.error("The TINIFY_API_KEY secret is completely empty.");
  console.error("Google AI Studio settings do NOT sync to GitHub automatically.");
  console.error("You MUST go to GitHub.com -> Your Repository -> Settings -> Secrets and variables -> Actions");
  console.error("And add a 'New repository secret' named TINIFY_API_KEY.");
  console.error("=====================================================");
  process.exit(1);
}
tinify.key = apiKey;

console.log("Raw CHANGED_FILES input:", process.env.CHANGED_FILES);

let files = [];
try {
  files = JSON.parse(process.env.CHANGED_FILES || "[]");
} catch (e) {
  console.error("❌ Failed to parse CHANGED_FILES as JSON. Falling back to space-separated split.");
  console.error("Error:", e.message);
  // Fallback if tj-actions didn't output valid JSON
  files = (process.env.CHANGED_FILES || "").split(/\s+/).filter(f => f.trim().length > 0);
}
if (files.length === 0) {
  console.log("No newly added or modified images to optimize.");
  process.exit(0);
}

async function optimizeImages() {
  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    if (!fs.existsSync(file)) continue; // File might have been deleted in the commit
    
    console.log(`Optimizing ${file}...`);
    try {
      const source = tinify.fromFile(file);
      const ext = file.substring(file.lastIndexOf('.')).toLowerCase();
      
      if (ext === '.heic') {
         // HEIC needs to be converted to JPEG for cross-device compatibility per Tinify guidelines
         const newFile = file.replace(/\.heic$/i, '.jpg');
         const converted = source.convert({ type: ["image/jpeg"] });
         await converted.toFile(newFile);
         
         // Delete the original HEIC
         fs.unlinkSync(file); 
         console.log(`✅ Converted and optimized ${file} -> ${newFile}`);
      } else {
         // Standard optimization and overwrite
         await source.toFile(file);
         console.log(`✅ Successfully optimized ${file}`);
      }
      successCount++;
    } catch (err) {
      console.error(`❌ Failed to optimize ${file}:`, err.message);
      failCount++;
    }
  }

  console.log(`\nOptimization Complete: ${successCount} successful, ${failCount} failed.`);
  if (failCount > 0) {
    process.exit(1);
  }
}

optimizeImages();
