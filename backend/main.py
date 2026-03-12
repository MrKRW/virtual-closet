from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from rembg import remove
from PIL import Image
import io
import os
import uuid

# Initialize the server
app = FastAPI(title="Virtual Closet AI")

# Allow the mobile app to communicate with this backend without security blocks
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Creating folder on PC to store the processed clothing images
UPLOAD_DIR = "closet_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# -------------------------------
# The AI Background Removal 
# -------------------------------
@app.post("/remove-background/")
async def remove_background(file: UploadFile = File(...)):
    try:
        # 1. Read the raw image sent from the phone
        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents))
        
        # 2. Pass it to the AI to strip the background
        output_image = remove(input_image)
        
        # 3. Generate a unique name and save it as a transparent PNG
        filename = f"{uuid.uuid4()}.png" 
        filepath = os.path.join(UPLOAD_DIR, filename)
        output_image.save(filepath, format="PNG")
        
        # 4. Tell the app exactly where the new image lives
        return {
            "status": "success",
            "filename": filename,
            "url": f"/images/{filename}"
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
# ---------------------------------------------------------
# Endpoint to send the image back to the mobile app grid
# ---------------------------------------------------------
@app.get("/images/{filename}")
async def get_image(filename: str):
    filepath = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(filepath):
        return FileResponse(filepath)
    return {"error": "Image not found"}