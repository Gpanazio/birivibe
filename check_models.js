const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    // Hack: try to list models via direct fetch if SDK method fails or is weird
    // But SDK usually has genAI.getGenerativeModel... 
    // Let's brute force test the most likely ones
    const candidates = [
        "gemini-2.0-flash-exp", 
        "gemini-2.0-flash-lite-preview-02-05", 
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro"
    ];

    console.log("Testing availability...");
    for (const m of candidates) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            await model.generateContent("Test");
            console.log(`✅ AVAILABLE: ${m}`);
        } catch (e) {
            console.log(`❌ FAILED: ${m} - ${e.message.split('[')[0]}`);
        }
    }
  } catch (e) {
    console.error(e);
  }
}
listModels();
