const fs = require('fs');
const path = require('path');

// Resolve command and episode directory
const args = process.argv.slice(2);
const command = args[0]; // 'dump', 'build', or 'validate'
let episodeArg = args.find(arg => !arg.startsWith('--') && arg !== 'dump' && arg !== 'build' && arg !== 'validate');

if (!command || !['dump', 'build', 'validate'].includes(command)) {
  console.error('Usage: node scripts/publisher/translate-helper.js <dump|build|validate> [episodeNumber]');
  process.exit(1);
}

const episodesDir = path.join(__dirname, '../../episodes');
let episodeNumber;

if (episodeArg) {
  episodeNumber = episodeArg.toString().padStart(4, '0');
} else {
  // Find the latest episode folder
  const folders = fs.readdirSync(episodesDir)
    .filter(f => fs.lstatSync(path.join(episodesDir, f)).isDirectory() && /^\d+$/.test(f))
    .map(f => parseInt(f))
    .sort((a, b) => b - a); // descending
  if (folders.length === 0) {
    console.error('No episode folders found.');
    process.exit(1);
  }
  episodeNumber = folders[0].toString().padStart(4, '0');
}

const episodeDir = path.join(episodesDir, episodeNumber);
console.log(`Targeting Episode: ${episodeNumber} (${episodeDir})`);

if (command === 'dump') {
  const srtPath = path.join(episodeDir, '1_recording/captions.sbv');
  if (!fs.existsSync(srtPath)) {
    console.error(`Error: captions.sbv not found at ${srtPath}`);
    process.exit(1);
  }
  const data = fs.readFileSync(srtPath, 'utf8');
  const blocks = data.split('\n\n').filter(b => b.trim().length > 0);
  
  const parsed = blocks.map((block, index) => {
    const lines = block.split('\n');
    const timestamp = lines[0];
    const text = lines.slice(1).join(' ').replace(/\s+/g, ' ').trim();
    return { index, timestamp, text };
  });

  const blocksJsonPath = path.join(episodeDir, '1_recording/blocks.json');
  fs.writeFileSync(blocksJsonPath, JSON.stringify(parsed, null, 2));
  console.log(`Dumped ${parsed.length} blocks to 1_recording/blocks.json`);

  // Write out the chunk files of 100 blocks each to 1_recording/chunk-*.json
  const chunkSize = 100;
  for (let i = 0; i < parsed.length; i += chunkSize) {
    const chunk = parsed.slice(i, i + chunkSize).map(b => b.text);
    const start = i;
    const end = Math.min(i + chunkSize - 1, parsed.length - 1);
    const chunkPath = path.join(episodeDir, `1_recording/chunk-${start}-${end}.json`);
    fs.writeFileSync(chunkPath, JSON.stringify(chunk, null, 2));
    console.log(`Saved source chunk for translation: 1_recording/chunk-${start}-${end}.json`);
  }
} else if (command === 'build') {
  const srtPath = path.join(episodeDir, '1_recording/captions.sbv');
  if (!fs.existsSync(srtPath)) {
    console.error(`Error: captions.sbv not found at ${srtPath}`);
    process.exit(1);
  }
  const data = fs.readFileSync(srtPath, 'utf8');
  const blocks = data.split('\n\n').filter(b => b.trim().length > 0);
  const totalBlocks = blocks.length;

  const publisherDir = path.join(episodeDir, '2_publisher');
  if (!fs.existsSync(publisherDir)) {
    console.error(`Error: 2_publisher/ directory not found in ${episodeDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(publisherDir);
  const transFiles = files
    .filter(f => f.startsWith('trans-') && f.endsWith('.json'))
    .sort((a, b) => {
      const aStart = parseInt(a.split('-')[1]);
      const bStart = parseInt(b.split('-')[1]);
      return aStart - bStart;
    });

  if (transFiles.length === 0) {
    console.error(`Error: No trans-*.json files found in ${publisherDir}`);
    console.log('Ensure you have saved translated chunks (e.g. trans-0-99.json, trans-100-199.json) in 2_publisher/');
    process.exit(1);
  }

  let translations = [];
  transFiles.forEach(file => {
    const filePath = path.join(publisherDir, file);
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!Array.isArray(content)) {
        console.error(`Error: File ${file} does not contain a JSON array.`);
        process.exit(1);
      }
      translations = translations.concat(content);
      console.log(`Loaded ${content.length} translations from ${file}`);
    } catch (e) {
      console.error(`Error parsing JSON in file ${file}: ${e.message}`);
      process.exit(1);
    }
  });

  console.log(`Total translations loaded: ${translations.length}`);
  console.log(`Original blocks in captions.sbv: ${totalBlocks}`);

  if (translations.length !== totalBlocks) {
    console.error(`Mismatch! Original has ${totalBlocks} blocks, but found ${translations.length} translations.`);
    console.log('Run the validate command to see alignment details:');
    console.log(`  node scripts/publisher/translate-helper.js validate ${episodeNumber}`);
    process.exit(1);
  }

  let sbvContent = '';
  for (let i = 0; i < totalBlocks; i++) {
    const lines = blocks[i].split('\n');
    const timestamp = lines[0];
    sbvContent += `${timestamp}\n${translations[i]}\n\n`;
  }
  sbvContent = sbvContent.trim() + '\n';

  const outputPath = path.join(publisherDir, 'youtube_captions_en.sbv');
  fs.writeFileSync(outputPath, sbvContent);
  console.log(`Successfully compiled and wrote ${outputPath} with ${translations.length} blocks!`);
} else if (command === 'validate') {
  const srtPath = path.join(episodeDir, '1_recording/captions.sbv');
  if (!fs.existsSync(srtPath)) {
    console.error(`Error: captions.sbv not found at ${srtPath}`);
    process.exit(1);
  }
  const data = fs.readFileSync(srtPath, 'utf8');
  const blocks = data.split('\n\n').filter(b => b.trim().length > 0);
  const totalBlocks = blocks.length;

  const publisherDir = path.join(episodeDir, '2_publisher');
  if (!fs.existsSync(publisherDir)) {
    console.error(`Error: 2_publisher/ directory not found in ${episodeDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(publisherDir);
  const transFiles = files
    .filter(f => f.startsWith('trans-') && f.endsWith('.json'))
    .sort((a, b) => {
      const aStart = parseInt(a.split('-')[1]);
      const bStart = parseInt(b.split('-')[1]);
      return aStart - bStart;
    });

  let translations = [];
  let chunkOffsets = [];
  let currentOffset = 0;
  
  transFiles.forEach(file => {
    const filePath = path.join(publisherDir, file);
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      chunkOffsets.push({ file, offset: currentOffset, length: content.length });
      translations = translations.concat(content);
      currentOffset += content.length;
    } catch (e) {
      console.error(`Error parsing JSON in file ${file}: ${e.message}`);
    }
  });

  console.log('--- Translation Chunk Coverage ---');
  chunkOffsets.forEach(c => {
    console.log(`- ${c.file}: starts at index ${c.offset}, contains ${c.length} blocks (indices ${c.offset} to ${c.offset + c.length - 1})`);
  });
  console.log(`Total translations loaded: ${translations.length}`);
  console.log(`Original blocks count: ${totalBlocks}`);

  if (translations.length === totalBlocks) {
    console.log('Perfect match! All block counts align.');
    return;
  }

  console.log('\n--- Diagnostic Check (Divergence / Sample Mismatches) ---');
  const maxLen = Math.max(totalBlocks, translations.length);
  for (let i = 0; i < maxLen; i++) {
    const origBlock = blocks[i];
    let origText = 'N/A';
    if (origBlock) {
      const lines = origBlock.split('\n');
      origText = lines.slice(1).join(' ').replace(/\s+/g, ' ').trim();
    }
    const transText = translations[i] || 'N/A';

    console.log(`${i.toString().padStart(3)}: [ES] "${origText.substring(0, 45)}..." => [EN] "${transText.replace(/\n/g, ' ').substring(0, 45)}..."`);
  }
}
