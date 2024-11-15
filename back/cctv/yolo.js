const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

// Multer setup: File upload handling
const upload = multer({ dest: "uploads/" });

// Flask YOLO API URL (replace `<ngrok-url>` with actual Flask public URL from ngrok)
const YOLO_API_URL = "https://e51b-34-90-255-102.ngrok-free.app/upload-video"; // Replace with your ngrok URL

// YOLO detection API
router.post("/yolo/detect", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Send image to Flask YOLO server
    const formData = new FormData();
    formData.append("image", fs.createReadStream(filePath));

    const response = await axios.post(YOLO_API_URL, formData, {
      headers: formData.getHeaders(),
      responseType: "arraybuffer", // Expect binary BLOB data
    });

    // Cleanup uploaded file
    fs.unlinkSync(filePath);

    // Return binary response to client
    res.set("Content-Type", "application/octet-stream");
    res.send(response.data);
  } catch (error) {
    console.error("Error in /yolo/detect:", error.message);
    res.status(500).json({ error: "Failed to process image" });
  }
});

module.exports = router;
