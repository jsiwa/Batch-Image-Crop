# batch-image-crop

A command-line tool for batch processing images with cropping and resizing capabilities.

## Features

- Crop images from edges (top, bottom, left, right)
- Resize images to specific dimensions
- Maintain aspect ratio during resize
- Process multiple images in a directory
- Support for JPG, JPEG, PNG, and WebP formats

## Installation

Ensure you have `bun` installed, then install dependencies:

```sh
bun install
```

## Usage

### **Example 1: Basic Cropping**

Crop all images in the `input` directory to **200x200** pixels and save them in `output`:

```sh
bun run index.ts -i ./input -o ./output -s 200x200
```

---

### **Example 2: Cropping with Offsets**

Crop all images to **300x300** pixels but start from coordinate `(50,30)`:

```sh
bun run index.ts -i ./input -o ./output -s 300x300@50,30
```

---

### **Example 3: Maintaining Aspect Ratio**

Resize images to **400x400**, preserving the aspect ratio:

```sh
bun run index.ts -i ./input -o ./output -s 400x400 -k
```

---

### **Example 4: Cropping from Edges**

Remove **50 pixels from the top** and **20 pixels from the bottom** of all images:

```sh
bun run index.ts -i ./input -o ./output -t 50 -b 20
```

---

### **Example 5: Processing a Different Directory**

Process images in `/input` and save cropped images to `/output`, with dimensions `150x150`:

```sh
bun run index.ts -i /input -o /output -s 150x150
```

---

### **Example 6: Handling Non-Image Files**

If the `input` directory contains non-image files, they will be automatically skipped:

```sh
bun run index.ts -i ./input -o ./output -s 250x250
```

