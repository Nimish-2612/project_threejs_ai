import express from "express";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Runware } from "@runware/sdk-js";

dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env"),
});

const router = express.Router();

const runware = new Runware({ apiKey: process.env.RUNWARE_API_KEY });

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from Runware Image Generator!" });
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("Received prompt from frontend:", prompt);

    const images = await runware.requestImages({
      positivePrompt: prompt,
      model: "runware:101@1",
      width: 1024,
      height: 1024,
    });

    const imageUrl = images[0].imageURL;

    res.status(200).json({ photo: imageUrl }); // return image URL
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Runware image generation failed." });
  }
});

export default router;
