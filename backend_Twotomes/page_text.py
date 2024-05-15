"""save text to image file"""

import os
from fastapi import FastAPI
from PIL import Image, ImageDraw, ImageFont

app = FastAPI()

@app.post("/update-texture/")
async def update_texture(text: str):
    """テキストを受け取り、テキストを追加した画像を返す"""
    original_path = "input/textureA.png"
    output_dir = "output"
    base_name, ext = os.path.splitext(os.path.basename(original_path))
    output_path = os.path.join(output_dir, f"{base_name}_001{ext}")

    # テキストを追加する関数
    def add_text_to_image(image_path, output_path, text):
        """画像にテキストを追加する関数"""
        image = Image.open(image_path)
        draw = ImageDraw.Draw(image)
        font_size = 100  # 適切なサイズに調整してください
        font_path = "/usr/share/fonts/truetype/fonts-japanese-gothic.ttf"
        font = ImageFont.truetype(font_path, font_size)

        # テキストのサイズを計算
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        max_width, max_height = image.size

        # テキストの配置位置を計算（中央に配置）
        x = (max_width - text_width) / 2
        y = (max_height - text_height) / 2

        # テキストを追加
        draw.text((x, y), text, font=font, fill="red")
        # 画像を保存
        image.save(output_path)

    # 画像にテキストを追加
    add_text_to_image(original_path, output_path, text)

    return {
        "message": "Image updated successfully",
        "output_image": output_path,
    }
