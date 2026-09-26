import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/travel-plan", async (req, res) => {
    try {
        const { stores, preferences } = req.body;

        const prompt = `
あなたは旅行プランを考えるAIです。

ユーザーが保存したスポット：
${JSON.stringify(stores, null, 2)}

旅行の希望：
${preferences || "特になし"}

保存されたスポットをできるだけ活用して、
無理のない旅行プランを日本語で作成してください。

以下を含めてください。
・おすすめのスポットを回る順番
・各スポットで過ごす内容
・その順番にした理由
・旅行全体のポイント

まだ実際の営業時間や交通状況は確認していないため、
正確な営業時間や移動時間は断定しないでください。
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
        });

        res.json({
            plan: response.text,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "AI旅行プランの作成に失敗しました。",
        });
    }
});

app.listen(port, () => {
    console.log(`AI server running at http://localhost:${port}`);
});