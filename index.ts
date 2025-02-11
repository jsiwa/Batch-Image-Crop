import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { program } from 'commander';

program
  .requiredOption('-i, --input <dir>', '输入图片目录')
  .requiredOption('-o, --output <dir>', '输出图片目录')
  .option('-s, --size <size>', '裁剪尺寸 (例如: 100x100 或 100x100@50,30)', parseSize)
  .option('-k, --keep-ratio', '保持原始宽高比')
  .option('-t, --top <pixels>', '从顶部裁剪的像素数')
  .option('-b, --bottom <pixels>', '从底部裁剪的像素数')
  .option('-l, --left <pixels>', '从左侧裁剪的像素数')
  .option('-r, --right <pixels>', '从右侧裁剪的像素数');

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

// 解析尺寸参数，格式: 宽x高[@x,y]
function parseSize(size: string) {
  const match = size.match(/^(\d+)x(\d+)(?:@(\d+),(\d+))?$/);
  if (!match) {
    throw new Error('尺寸格式错误，正确格式: 宽x高 或 宽x高@x,y (例如: 100x100 或 100x100@50,30)');
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
    console.error('读取目录出错:', err);
    return;
  }

  files.forEach(async file => {
    const inputFilePath = path.join(inputDir, file);
    const outputFilePath = path.join(outputDir, file);
    
    if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) {
      console.log(`跳过非图片文件: ${file}`);
      return;
    }

    try {
      let pipeline = sharp(inputFilePath);
      
      if (topCrop || bottomCrop || leftCrop || rightCrop) {
        // 如果指定了边缘裁剪
        const metadata = await pipeline.metadata();
        pipeline = pipeline.extract({
          left: leftCrop,
          top: topCrop,
          width: metadata.width! - leftCrop - rightCrop,
          height: metadata.height! - topCrop - bottomCrop
        });
      } else if (options.size) {
        // 如果指定了尺寸
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
      console.log(`已处理: ${file}`);
    } catch (err) {
      console.error(`处理文件 ${file} 出错:`, err);
    }
  });
});
