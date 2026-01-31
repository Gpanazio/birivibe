const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function list() {
    try {
        // Unfortunately listModels is not directly exposed on the main class in some versions,
        // but let's try a direct fetch if this fails
        // Actually, let's just try 'gemini-1.5-flash-002' which is the newest stable
        console.log("Trying gemini-1.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Test");
        console.log("Success with gemini-1.5-flash");
    } catch (e) {
        console.log("Failed gemini-1.5-flash", e.message);
    }
}
list();
