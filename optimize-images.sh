#!/bin/bash

# Image Optimization Script for Portfolio
# This script compresses images for web use

echo "🖼️  Optimizing images for web..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install imagemagick
        else
            echo "Please install Homebrew first: https://brew.sh"
            exit 1
        fi
    else
        echo "Please install ImageMagick manually"
        exit 1
    fi
fi

# Create optimized directory
mkdir -p photos/optimized

# Function to optimize image
optimize_image() {
    local input="$1"
    local output="photos/optimized/$(basename "$input")"
    
    echo "📸 Optimizing $(basename "$input")..."
    
    # Resize to max 1200px width, compress to 85% quality
    convert "$input" \
        -resize '1200x1200>' \
        -quality 85 \
        -strip \
        -interlace Plane \
        "$output"
    
    # Show size reduction
    original_size=$(stat -f%z "$input" 2>/dev/null || stat -c%s "$input" 2>/dev/null)
    optimized_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
    
    if [ "$original_size" -gt 0 ] && [ "$optimized_size" -gt 0 ]; then
        reduction=$((100 - (optimized_size * 100 / original_size)))
        echo "✅ Reduced by ${reduction}% ($(numfmt --to=iec $original_size) → $(numfmt --to=iec $optimized_size))"
    fi
}

# Optimize all images in photos directory
for img in photos/*.jpg photos/*.jpeg photos/*.png; do
    if [ -f "$img" ]; then
        optimize_image "$img"
    fi
done

echo "🎉 Image optimization complete!"
echo "📁 Optimized images saved to: photos/optimized/"
echo "💡 Replace original images with optimized versions for faster loading"
