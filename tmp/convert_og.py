from PIL import Image
import os

input_path = r"C:\Users\juvai\Desktop\nbscsmcldflare\nb-cld-convex\.gemini\antigravity\brain\8259b1b2-d7c9-42ce-88b1-d6c31e4a073c\og_image_v2_1200x630_jpeg_1773553378107.png"
# Note: I need to use the absolute path provided in the tool output. 
# The brain directory is usually relative to the user's home or workspace.
# I'll use the absolute path provided earlier.
input_path = r"C:\Users\juvai\.gemini\antigravity\brain\8259b1b2-d7c9-42ce-88b1-d6c31e4a073c\og_image_v2_1200x630_jpeg_1773553378107.png"
output_path = r"C:\Users\juvai\Desktop\nbscsmcldflare\nb-cld-convex\public\og-image.jpg"

try:
    with Image.open(input_path) as img:
        # Resize to exactly 1200x630
        img = img.resize((1200, 630), Image.Resampling.LANCZOS)
        # Convert to RGB if it was RGBA (PNG)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        # Save as JPEG with high quality
        img.save(output_path, "JPEG", quality=95, optimize=True)
        print(f"Successfully converted {input_path} to {output_path}")
except Exception as e:
    print(f"Error: {e}")
