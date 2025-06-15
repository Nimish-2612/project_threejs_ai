import express from "express";
import fetch from "node-fetch"; // npm install node-fetch
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env"),
});

const router = express.Router();

// Query function to Hugging Face Inference API
async function query(data) {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev",
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HuggingFace API Error: ${text}`);
  }

  return await response.blob();
}

// Routes
router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("Prompt received:", prompt);

    const imageBlob = await query({ inputs: prompt });

    // Convert Blob to base64 for frontend
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    res.status(200).json({ photo: base64Image });
  } catch (err) {
    console.error("Image generation error:", err.message);
    res.status(500).json({ error: "Image generation failed." });
  }
});

export default router;
