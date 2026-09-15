const tinify = require('tinify');
const fs = require('fs');

const apiKey = process.env.TINIFY_API_KEY;
if (!apiKey) {
  console.error("Error: TINIFY_API_KEY secret is not set in GitHub Actions.");
  console.error("Please add it to your repository settings: Settings > Secrets and variables > Actions");
  process.exit(1);
}
tinify.key = apiKey;

// Parse the JSON array of changed files passed from the tj-actions/changed-files step
const files = JSON.parse(process.env.CHANGED_FILES || "[]");
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
