import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { program } from 'commander';

program
  .requiredOption('-i, --input <dir>', 'Input image directory')
  .requiredOption('-o, --output <dir>', 'Output image directory')
  .option('-s, --size <size>', 'Crop size (e.g., 100x100 or 100x100@50,30)', parseSize)
  .option('-k, --keep-ratio', 'Maintain original aspect ratio')
  .option('-t, --top <pixels>', 'Number of pixels to crop from the top')
  .option('-b, --bottom <pixels>', 'Number of pixels to crop from the bottom')
  .option('-l, --left <pixels>', 'Number of pixels to crop from the left')
  .option('-r, --right <pixels>', 'Number of pixels to crop from the right');

program.parse(process.argv);

const options = program.opts();
const inputDir = options.input;
const outputDir = options.output;
const topCrop = options.top ? parseInt(options.top) : 0;
const bottomCrop = options.bottom ? parseInt(options.bottom) : 0;
const leftCrop = options.left ? parseInt(options.left) : 0;
const rightCrop = options.right ? parseInt(options.right) : 0;
const { width, height, x = 0, y = 0 } = options.size || {};
const keepRatio = options.keepRatio;

// Parse size parameter, format: widthxheight[@x,y]
function parseSize(size: string) {
  const match = size.match(/^(\d+)x(\d+)(?:@(\d+),(\d+))?$/);
  if (!match) {
    throw new Error('Invalid size format, correct format: widthxheight or widthxheight@x,y (e.g., 100x100 or 100x100@50,30)');
  }
  return {
    width: parseInt(match[1]),
    height: parseInt(match[2]),
    x: match[3] ? parseInt(match[3]) : 0,
    y: match[4] ? parseInt(match[4]) : 0
  };
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach(async file => {
    const inputFilePath = path.join(inputDir, file);
    const outputFilePath = path.join(outputDir, file);
    
    if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) {
      console.log(`Skipping non-image file: ${file}`);
      return;
    }

    try {
      let pipeline = sharp(inputFilePath);
      
      if (topCrop || bottomCrop || leftCrop || rightCrop) {
        // If edge cropping is specified
        const metadata = await pipeline.metadata();
        pipeline = pipeline.extract({
          left: leftCrop,
          top: topCrop,
          width: metadata.width! - leftCrop - rightCrop,
          height: metadata.height! - topCrop - bottomCrop
        });
      } else if (options.size) {
        // If size is specified
        if (keepRatio) {
          pipeline = pipeline.resize(width, height, {
            fit: 'contain',
            position: 'center'
          });
        } else {
          pipeline = pipeline.extract({ left: x, top: y, width, height });
        }
      }
      
      await pipeline.toFile(outputFilePath);
      console.log(`Processed: ${file}`);
    } catch (err) {
      console.error(`Error processing file ${file}:`, err);
    }
  });
});
