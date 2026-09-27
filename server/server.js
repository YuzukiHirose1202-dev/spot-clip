import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { load } from "cheerio";

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/instagram/analyze", async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                error: "Instagram URLが必要です。",
            });
        }

        // Instagramページを取得
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Instagramページの取得に失敗しました: ${response.status}`
            );
        }

        const html = await response.text();

        // HTMLからOG情報を取得
        const $ = load(html);

        const title =
            $('meta[property="og:title"]').attr("content") || "";

        const description =
            $('meta[property="og:description"]').attr("content") || "";

        const image =
            $('meta[property="og:image"]').attr("content") || "";

        // 投稿文をAIに渡して店舗情報を抽出
        const prompt = `
            以下はInstagram投稿から取得した情報です。

            タイトル：
            ${title}

            投稿文：
            ${description}

            この投稿で紹介されている店舗について、
            以下の情報を抽出してください。

            ・店舗名
            ・地図検索に使える住所

            住所については、都道府県から番地までの住所だけを返してください。
            建物名、ビル名、階数、フードコート名、施設名などは住所に含めないでください。

            例：
            「愛知県名古屋市中村区名駅４丁目１４−１０ 5F 柳橋Food Market」
            →
            「愛知県名古屋市中村区名駅４丁目１４−１０」

            住所が投稿内にない場合は、推測せず空文字にしてください。

            必ずJSON形式だけで返してください。

            {
            "name": "店舗名",
            "address": "住所"
            }

            店舗名や住所が見つからない場合は、空文字にしてください。
            `;

        console.log("GeminiにInstagram情報を解析させています...");
        const aiResponse = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
        });
        console.log("Geminiから回答が返ってきました");
        console.log("Gemini回答:", aiResponse.text);

        const text = aiResponse.text.trim();

        // ```json ～ ``` が付いていた場合に取り除く
        const jsonText = text
            .replace(/^```json\s*/, "")
            .replace(/^```\s*/, "")
            .replace(/\s*```$/, "")
            .trim();

        const placeInfo = JSON.parse(jsonText);

        res.json({
            name: placeInfo.name || "",
            address: placeInfo.address || "",
            image,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Instagram情報の解析に失敗しました。",
        });
    }
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