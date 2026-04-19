from pathlib import Path
from PIL import Image
import os

# Configuration
SOURCE = Path("docs/assets/images-src")
OUT = Path("docs/assets/images")
OUT.mkdir(parents=True, exist_ok=True)

# Define which images and sizes you need
targets = {
    "kobu-agency-fVi9Ipk7f60-unsplash.jpg": [480, 768, 960, 1280],
    "vitaly-gariev-8qQaWOBfiV0-unsplash.jpg": [480, 768, 960],
    "linkedin_headshot_330.png": [48, 96, 128],
    "jonathan-duncan.jpg": [48, 96, 128, 256],
}

print("Generating optimized image variants...")
print("-" * 50)

for filename, widths in targets.items():
    try:
        img_path = SOURCE / filename
        if not img_path.exists():
            print(f"⚠️  Skipping {filename} - not found in {SOURCE}")
            continue

        img = Image.open(img_path)
        print(f"Processing: {filename} ({img.width}x{img.height})")

        for w in widths:
            ratio = w / img.width
            h = round(img.height * ratio)
            resized = img.resize((w, h), Image.LANCZOS)

            stem = Path(filename).stem

            # Save WebP (modern format, smaller size)
            webp_path = OUT / f"{stem}-{w}.webp"
            resized.save(webp_path, format="WEBP", quality=82, method=6)
            print(f"  ✓ {webp_path.name} ({w}px wide)")

            # For JPEG originals, also save JPEG variants
            if filename.endswith((".jpg", ".jpeg")):
                jpg_path = OUT / f"{stem}-{w}.jpg"
                resized.save(jpg_path, format="JPEG", quality=82, optimize=True)
                print(f"  ✓ {jpg_path.name} ({w}px wide)")

    except Exception as e:
        print(f"  ✗ Error processing {filename}: {e}")

print("-" * 50)
print("✅ Generation complete!")
print(f"Output folder: {OUT}")
