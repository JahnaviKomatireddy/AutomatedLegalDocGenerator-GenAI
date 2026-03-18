import axios from "axios";
import { PassThrough } from "stream";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { docType, fields } = req.body;

    if (!docType || !fields) {
      return res.status(400).json({ error: "Missing document type or fields" });
    }

    console.log("📨 Sending request to Flask server...");

    // ✅ Request Flask server and expect binary PDF data
    const aiRes = await axios.post("http://127.0.0.1:7000/ask",
      { docType, fields },
      {
        headers: { "Content-Type": "application/json" },
        responseType: "arraybuffer", // 👈 Important! Expect PDF bytes
        timeout: 900000, // 10 minutes
      }
    );

    console.log("✅ Received PDF data from Flask server");

    // ✅ Forward PDF file to client
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${docType.replace(/\s+/g, "_")}.pdf`
    );

    const stream = new PassThrough();
    stream.end(Buffer.from(aiRes.data));
    stream.pipe(res);
  } catch (err) {
    console.error("❌ Error generating document:", err.message);
    res.status(500).json({
      error: "Failed to generate document. Check if Flask GPT server is running properly.",
    });
  }
}
