import tinify from 'tinify';
import { glob } from 'glob';
import fs from 'fs/promises';

const apiKey = process.env.TINIFY_API_KEY;
if (!apiKey) {
  console.error("🚨 CRITICAL ERROR: MISSING API KEY 🚨");
  console.error("Please add TINIFY_API_KEY as a repository secret in GitHub.");
  process.exit(1);
}
tinify.key = apiKey;

// We store the compression state to avoid re-compressing and wasting API credits
const STATE_FILE = 'compressed-images.json';

async function run() {
  let state = {};
  
  // Load previous state if it exists
  try {
    const stateData = await fs.readFile(STATE_FILE, 'utf-8');
    state = JSON.parse(stateData);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error("Warning: Could not read state file, starting fresh.", err.message);
    }
  }

  // Find all uncompressed image files using glob
  const images = await glob('**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
    ignore: ['node_modules/**']
  });

  console.log(`Found ${images.length} image(s) in the repository.`);

  let compressedCount = 0;
  let failedCount = 0;

  for (const file of images) {
    const stats = await fs.stat(file);
    const lastModified = stats.mtimeMs; // Track by file modification time

    // Skip if file hasn't been modified since we last compressed it
    if (state[file] && state[file] === lastModified) {
      continue;
    }

    console.log(`Optimizing: ${file}`);
    try {
      const source = tinify.fromFile(file);
      await source.toFile(file); // Overwrite the original image
      
      // Re-read stats to get the post-compression modification time
      const newStats = await fs.stat(file);
      state[file] = newStats.mtimeMs;
      
      compressedCount++;
      console.log(`✅ Successfully optimized: ${file}`);
    } catch (err) {
      console.error(`❌ Failed to optimize ${file}:`, err.message);
      failedCount++;
    }
  }

  // Save the state file back so it can be committed
  if (compressedCount > 0 || Object.keys(state).length > 0) {
    await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
  }

  if (compressedCount > 0) {
    console.log(`\nOptimization Complete: ${compressedCount} successful, ${failedCount} failed.`);
  } else {
    console.log("\nNo new or modified images needed optimization.");
  }

  // Fail the action if API quota exceeded or network error occurred on any file
  if (failedCount > 0) {
    process.exit(1); 
  }
}

run();
