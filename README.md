# batch-image-crop

A command-line tool for batch processing images with cropping and resizing capabilities.

## Features

- Crop images from edges (top, bottom, left, right)
- Resize images to specific dimensions
- Maintain aspect ratio during resize
- Process multiple images in a directory
- Support for JPG, JPEG, PNG and WebP formats

### **Example 1: Basic Cropping**
Crop all images in the `input` directory to **200x200** pixels, starting from the top-left corner (0,0), and save them in `output`:
```sh
bun run index.ts -i ./input -o ./output -w 200 -h 200
```

---

### **Example 2: Cropping with Offsets**
Crop all images to **300x300** pixels but start from coordinate `(50,30)`:
```sh
bun run index.ts -i ./input -o ./output -w 300 -h 300 -x 50 -y 30
```

---

### **Example 3: Processing a Different Directory**
Process images in `/images/raw/` and save cropped images to `/images/cropped/`, with dimensions `150x150` starting at `(10,10)`:
```sh
bun run index.ts -i /images/raw/ -o /images/cropped/ -w 150 -h 150 -x 10 -y 10
```

---

### **Example 4: Handling Non-Image Files**
If the `input` directory contains non-image files, they will be automatically skipped:
```sh
bun run index.ts -i ./mixed_files -o ./cropped_images -w 250 -h 250
```
